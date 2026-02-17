import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateVote() {
  const [title, setTitle] = useState('');
  const [organizerName, setOrganizerName] = useState('');
  const [referenceExample, setReferenceExample] = useState('');
  const [singleVote, setSingleVote] = useState(false);
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [voteLink, setVoteLink] = useState('');
  const navigate = useNavigate();

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setVoteLink('');

    if (!title || !organizerName || options.some(opt => !opt.trim())) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/votes/create', {
        title,
        organizer_name: organizerName,
        options: options.filter(opt => opt.trim()),
        single_vote: singleVote,
        reference_example: referenceExample
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccess('Vote créé avec succès!');
      setVoteLink(response.data.vote_link);
      
      // Reset form
      setTitle('');
      setOrganizerName('');
      setReferenceExample('');
      setSingleVote(false);
      setOptions(['', '']);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la création du vote');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(voteLink);
    alert('Lien copié au presse-papiers!');
  };

  return (
    <div>
      <div className="navbar">
        <h1>✨ Créer un vote</h1>
        <button onClick={() => navigate('/dashboard')} style={{ backgroundColor: '#64748b' }}>
          Retour
        </button>
      </div>

      <div className="container">
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>📋 Titre du vote:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Quel est votre couleur préférée?"
              />
            </div>

            <div className="form-group">
              <label>👤 Nom de l'organisateur:</label>
              <input
                type="text"
                value={organizerName}
                onChange={(e) => setOrganizerName(e.target.value)}
                placeholder="Ex: Jean Dupont"
              />
            </div>

            <div className="form-group">
              <label>🔖 Exemple de référence (pour les votants):</label>
              <input
                type="text"
                value={referenceExample}
                onChange={(e) => setReferenceExample(e.target.value)}
                placeholder="Ex: CODE123 ou ID_EMPLOYE"
              />
            </div>

            <div className="form-group">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="singleVote"
                  checked={singleVote}
                  onChange={(e) => setSingleVote(e.target.checked)}
                />
                <label htmlFor="singleVote">
                  🔒 Vote unique (une seule option par personne)
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>📝 Options de vote:</label>
              {options.map((option, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    style={{ flex: 1 }}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="danger"
                      style={{ padding: '10px 15px' }}
                    >
                      ❌ Supprimer
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddOption}
                style={{ backgroundColor: 'var(--warning)', marginTop: '10px' }}
              >
                ➕ Ajouter une option
              </button>
            </div>

            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}

            <button type="submit" style={{ width: '100%', marginTop: '20px' }} className="success">
              🚀 Créer le vote
            </button>
          </form>

          {voteLink && (
            <div style={{ marginTop: '30px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
              <h3 style={{ color: 'var(--success)', marginBottom: '15px' }}>
                ✅ Votre lien de vote unique:
              </h3>
              <div className="link-box">
                {voteLink}
              </div>
              <button onClick={copyToClipboard} className="copy-btn">
                📋 Copier le lien
              </button>
              <p style={{ marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
                📤 Partagez ce lien avec les personnes qui souhaitent voter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateVote;
