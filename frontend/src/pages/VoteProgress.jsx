import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function VoteProgress() {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchVotesProgress();
  }, [token]);

  const fetchVotesProgress = async () => {
    try {
      const response = await axios.get('/api/votes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setVotes(response.data.votes);
    } catch (err) {
      console.error('Error fetching votes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseVote = async (voteToken) => {
    if (window.confirm('Êtes-vous sûr de vouloir fermer ce vote?')) {
      try {
        await axios.post(`/api/votes/${voteToken}/close`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        fetchVotesProgress();
      } catch (err) {
        alert(err.response?.data?.error || 'Erreur lors de la fermeture du vote');
      }
    }
  };

  const handleReopenVote = async (voteToken) => {
    try {
      await axios.post(`/api/votes/${voteToken}/reopen`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchVotesProgress();
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de la réouverture du vote');
    }
  };

  const handleViewResults = (voteToken) => {
    navigate(`/results/${voteToken}`);
  };

  return (
    <div>
      <div className="navbar">
        <h1>Suivi de vos votes</h1>
        <button onClick={() => navigate('/dashboard')} style={{ backgroundColor: '#64748b' }}>
          Retour au Dashboard
        </button>
      </div>

      <div className="container">
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Chargement...</p>
        ) : votes.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Vous n'avez pas encore créé de votes.</p>
        ) : (
          <div>
            {votes.map((vote) => (
              <div key={vote.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: 'var(--primary)', marginBottom: '12px' }}>
                      {vote.title}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', margin: '8px 0' }}>
                      <strong>Organisateur:</strong> {vote.organizer_name}
                    </p>
                    <p style={{ 
                      color: 'var(--text-muted)', 
                      margin: '8px 0',
                      fontSize: '13px'
                    }}>
                      <strong>Créé le:</strong> {new Date(vote.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <div className="vote-status" style={{
                      marginTop: '12px'
                    }}>
                      <span className={`vote-status ${vote.status}`}>
                        {vote.status === 'active' ? '🟢 Actif' : '🔴 Fermé'}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <div className="button-group">
                    <button 
                      onClick={() => handleViewResults(vote.vote_token)}
                      className="success"
                    >
                      📊 Voir les résultats
                    </button>
                    {vote.status === 'active' ? (
                      <button 
                        onClick={() => handleCloseVote(vote.vote_token)}
                        className="danger"
                      >
                        🔒 Fermer le vote
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleReopenVote(vote.vote_token)}
                        style={{ backgroundColor: 'var(--warning)' }}
                      >
                        🔓 Réouvrir le vote
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VoteProgress;
