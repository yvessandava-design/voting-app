const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('../middleware/auth');
const pool = require('../db');

const router = express.Router();

// Create a vote
router.post('/create', authenticateToken, async (req, res) => {
  const { title, organizer_name, options, single_vote, reference_example } = req.body;
  const user_id = req.user.id;

  try {
    // Validate input
    if (!title || !organizer_name || !options || options.length < 2) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    // Generate unique vote link token
    const vote_token = uuidv4();

    // Create vote
    const voteResult = await pool.query(
      `INSERT INTO votes (user_id, title, organizer_name, single_vote, reference_example, vote_token, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'active')
       RETURNING id, vote_token`,
      [user_id, title, organizer_name, single_vote || false, reference_example || '', vote_token]
    );

    const vote = voteResult.rows[0];

    // Insert options
    for (const option of options) {
      await pool.query(
        'INSERT INTO vote_options (vote_id, option_text) VALUES ($1, $2)',
        [vote.id, option]
      );
    }

    const voteLinkUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/vote/${vote.vote_token}`;

    res.status(201).json({
      message: 'Vote created successfully',
      vote_id: vote.id,
      vote_token: vote.vote_token,
      vote_link: voteLinkUrl
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get vote details (for voting page)
router.get('/:vote_token', async (req, res) => {
  const { vote_token } = req.params;

  try {
    // Get vote
    const voteResult = await pool.query(
      'SELECT id, title, organizer_name, single_vote, reference_example, status FROM votes WHERE vote_token = $1',
      [vote_token]
    );

    if (voteResult.rows.length === 0) {
      return res.status(404).json({ error: 'Vote not found' });
    }

    const vote = voteResult.rows[0];

    // Get options
    const optionsResult = await pool.query(
      'SELECT id, option_text FROM vote_options WHERE vote_id = $1',
      [vote.id]
    );

    res.json({
      vote: {
        id: vote.id,
        title: vote.title,
        organizer_name: vote.organizer_name,
        single_vote: vote.single_vote,
        reference_example: vote.reference_example,
        status: vote.status
      },
      options: optionsResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's votes
router.get('/', authenticateToken, async (req, res) => {
  const user_id = req.user.id;

  try {
    const votesResult = await pool.query(
      'SELECT id, title, organizer_name, vote_token, status, created_at FROM votes WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );

    res.json({ votes: votesResult.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit a vote
router.post('/:vote_token/submit', async (req, res) => {
  const { vote_token } = req.params;
  const { voter_name, voter_reference, selected_options } = req.body;

  try {
    // Validate input
    if (!voter_name || !voter_reference || !selected_options || selected_options.length === 0) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    // Get vote
    const voteResult = await pool.query(
      'SELECT id, single_vote, status FROM votes WHERE vote_token = $1',
      [vote_token]
    );

    if (voteResult.rows.length === 0) {
      return res.status(404).json({ error: 'Vote not found' });
    }

    const vote = voteResult.rows[0];

    if (vote.status !== 'active') {
      return res.status(400).json({ error: 'Vote is not active' });
    }

    if (vote.single_vote && selected_options.length > 1) {
      return res.status(400).json({ error: 'Only one option allowed' });
    }

    // Check if voter already voted with same reference
    const existingVote = await pool.query(
      'SELECT id FROM votes_submitted WHERE vote_id = $1 AND voter_reference = $2',
      [vote.id, voter_reference]
    );

    if (existingVote.rows.length > 0) {
      return res.status(400).json({ error: 'You have already voted' });
    }

    // Insert votes
    for (const option_id of selected_options) {
      await pool.query(
        'INSERT INTO votes_submitted (vote_id, voter_name, voter_reference, option_id) VALUES ($1, $2, $3, $4)',
        [vote.id, voter_name, voter_reference, option_id]
      );
    }

    res.json({ message: 'Vote submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get vote results
router.get('/:vote_token/results', async (req, res) => {
  const { vote_token } = req.params;

  try {
    // Get vote
    const voteResult = await pool.query(
      'SELECT id, title, organizer_name FROM votes WHERE vote_token = $1',
      [vote_token]
    );

    if (voteResult.rows.length === 0) {
      return res.status(404).json({ error: 'Vote not found' });
    }

    const vote = voteResult.rows[0];

    // Get results
    const resultsQuery = `
      SELECT 
        vo.id,
        vo.option_text,
        COUNT(vs.id) as vote_count
      FROM vote_options vo
      LEFT JOIN votes_submitted vs ON vo.id = vs.option_id
      WHERE vo.vote_id = $1
      GROUP BY vo.id, vo.option_text
      ORDER BY vote_count DESC
    `;

    const resultsResult = await pool.query(resultsQuery, [vote.id]);

    res.json({
      vote: {
        title: vote.title,
        organizer_name: vote.organizer_name
      },
      results: resultsResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Close a vote
router.post('/:vote_token/close', authenticateToken, async (req, res) => {
  const { vote_token } = req.params;
  const user_id = req.user.id;

  try {
    // Verify user owns the vote
    const voteResult = await pool.query(
      'SELECT id, user_id, status FROM votes WHERE vote_token = $1',
      [vote_token]
    );

    if (voteResult.rows.length === 0) {
      return res.status(404).json({ error: 'Vote not found' });
    }

    const vote = voteResult.rows[0];

    if (vote.user_id !== user_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (vote.status === 'closed') {
      return res.status(400).json({ error: 'Vote already closed' });
    }

    // Close the vote
    await pool.query(
      'UPDATE votes SET status = $1 WHERE id = $2',
      ['closed', vote.id]
    );

    res.json({ message: 'Vote closed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reopen a vote
router.post('/:vote_token/reopen', authenticateToken, async (req, res) => {
  const { vote_token } = req.params;
  const user_id = req.user.id;

  try {
    // Verify user owns the vote
    const voteResult = await pool.query(
      'SELECT id, user_id, status FROM votes WHERE vote_token = $1',
      [vote_token]
    );

    if (voteResult.rows.length === 0) {
      return res.status(404).json({ error: 'Vote not found' });
    }

    const vote = voteResult.rows[0];

    if (vote.user_id !== user_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (vote.status === 'active') {
      return res.status(400).json({ error: 'Vote already active' });
    }

    // Reopen the vote
    await pool.query(
      'UPDATE votes SET status = $1 WHERE id = $2',
      ['active', vote.id]
    );

    res.json({ message: 'Vote reopened successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
