import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    try {
      const token = localStorage.getItem('token');
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div>
      <div className="navbar">
        <h1>Plateforme de Vote</h1>
        <div className="navbar-actions">
          <span className="navbar-user">Bienvenue, {user.email}</span>
          <button onClick={handleLogout}>Déconnexion</button>
        </div>
      </div>

      <div className="container">
        <h2>Explication de la plateforme</h2>
        <div className="card">
          <p>
            Bienvenue sur notre plateforme de vote! Vous pouvez créer des votes et permettre
            aux autres de voter. Voici comment ça fonctionne:
          </p>
          <ul>
            <li><strong>Créer un vote:</strong> Cliquez sur "Créer un vote" pour créer un nouveau sondage</li>
            <li><strong>Partager le lien:</strong> Vous recevrez un lien unique pour votre vote</li>
            <li><strong>Voter:</strong> Les gens peuvent voter en entrant leur nom et une référence</li>
            <li><strong>Voir les résultats:</strong> Consultez les résultats du vote à tout moment</li>
            <li><strong>Gérer les votes:</strong> Fermez ou réouvrez vos votes à tout moment</li>
          </ul>
        </div>

        <div className="button-group">
          <button 
            onClick={() => navigate('/create-vote')}
            className="success"
          >
            ➕ Créer un vote
          </button>
          <button 
            onClick={() => navigate('/vote-progress')}
            style={{ backgroundColor: 'var(--primary)' }}
          >
            📈 Voir mes votes
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
