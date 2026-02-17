import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Results() {
  const { voteToken } = useParams();
  const [voteData, setVoteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchResults();
    // Refresh results every 5 seconds
    const interval = setInterval(fetchResults, 5000);
    return () => clearInterval(interval);
  }, [voteToken]);

  const fetchResults = async () => {
    try {
      const response = await axios.get(`/api/votes/${voteToken}/results`);
      setVoteData(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des résultats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container"><p>Chargement...</p></div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="card" style={{ marginTop: '50px' }}>
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  const totalVotes = voteData.results.reduce((sum, result) => sum + result.vote_count, 0);

  return (
    <div>
      <div className="navbar">
        <h1>📊 Résultats du vote</h1>
        <button onClick={() => navigate(`/vote/${voteToken}`)} className="success">
          🗳️ Voter
        </button>
      </div>

      <div className="container">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>{voteData.vote.title}</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            <strong>Organisateur:</strong> {voteData.vote.organizer_name}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '10px' }}>
            <strong>Nombre total de votes:</strong> {totalVotes}
          </p>

          <div style={{ marginTop: '30px' }}>
            {voteData.results.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
                Aucun vote pour le moment
              </p>
            ) : (
              voteData.results.map((result) => {
                const percentage = totalVotes > 0 ? (result.vote_count / totalVotes) * 100 : 0;
                return (
                  <div key={result.id} className="result-item">
                    <div className="result-label">
                      {result.option_text}
                    </div>
                    <div className="result-bar">
                      <div 
                        className="result-fill"
                        style={{ width: `${percentage}%` }}
                      >
                        {percentage > 10 && `${percentage.toFixed(1)}%`}
                      </div>
                    </div>
                    <div className="result-count">
                      {result.vote_count} vote{result.vote_count !== 1 ? 's' : ''}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <button 
          onClick={() => navigate('/dashboard')} 
          className="back-btn"
          style={{ marginTop: '20px' }}
        >
          ← Retour au Dashboard
        </button>
      </div>
    </div>
  );
}

export default Results;
