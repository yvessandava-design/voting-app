import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function VotePage() {
  const { voteToken } = useParams();
  const [vote, setVote] = useState(null);
  const [voterName, setVoterName] = useState('');
  const [voterReference, setVoterReference] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVote();
  }, [voteToken]);

  const fetchVote = async () => {
    try {
      const response = await axios.get(`/api/votes/${voteToken}`);
      setVote(response.data);
    } catch (err) {
      setError('Vote non trouvé');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (optionId) => {
    if (vote.vote.single_vote) {
      setSelectedOptions([optionId]);
    } else {
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(selectedOptions.filter(id => id !== optionId));
      } else {
        setSelectedOptions([...selectedOptions, optionId]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!voterName || !voterReference || selectedOptions.length === 0) {
      setError('Veuillez remplir tous les champs et sélectionner au moins une option');
      return;
    }

    try {
      await axios.post(`/api/votes/${voteToken}/submit`, {
        voter_name: voterName,
        voter_reference: voterReference,
        selected_options: selectedOptions
      });

      setSuccess('Vote enregistré avec succès!');
      setVoterName('');
      setVoterReference('');
      setSelectedOptions([]);

      setTimeout(() => {
        navigate(`/results/${voteToken}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'enregistrement du vote');
    }
  };

  if (loading) {
    return <div className="container"><p>Chargement...</p></div>;
  }

  if (error && !vote) {
    return (
      <div className="container">
        <div className="card" style={{ marginTop: '50px' }}>
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="navbar">
        <h1>🗳️ Voter</h1>
        <button onClick={() => navigate(`/results/${voteToken}`)} style={{ backgroundColor: 'var(--success)' }}>
          📊 Voir les résultats
        </button>
      </div>

      <div className="container">
        {vote && (
          <div className="card">
            <h2 style={{ marginTop: 0 }}>{vote.vote.title}</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              <strong>Organisateur:</strong> {vote.vote.organizer_name}
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>👤 Votre nom:</label>
                <input
                  type="text"
                  value={voterName}
                  onChange={(e) => setVoterName(e.target.value)}
                  placeholder="Entrez votre nom"
                />
              </div>

              <div className="form-group">
                <label>🔖 Référence (ex: {vote.vote.reference_example || 'CODE'}):</label>
                <input
                  type="text"
                  value={voterReference}
                  onChange={(e) => setVoterReference(e.target.value)}
                  placeholder={vote.vote.reference_example || 'Entrez votre référence'}
                />
              </div>

              <div className="form-group">
                <label>
                  {vote.vote.single_vote 
                    ? '⭕ Sélectionnez une option:' 
                    : '☑️ Sélectionnez une ou plusieurs options:'}
                </label>
                {vote.options.map((option) => (
                  <div key={option.id} className="option-item">
                    <input
                      type={vote.vote.single_vote ? "radio" : "checkbox"}
                      id={`option-${option.id}`}
                      name="options"
                      value={option.id}
                      checked={selectedOptions.includes(option.id)}
                      onChange={() => handleOptionChange(option.id)}
                    />
                    <label htmlFor={`option-${option.id}`}>{option.option_text}</label>
                  </div>
                ))}
              </div>

              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}

              <button type="submit" style={{ width: '100%' }} className="success">
                ✅ Voter
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default VotePage;
