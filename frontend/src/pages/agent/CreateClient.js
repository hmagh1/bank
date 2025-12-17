import React, { useState } from 'react';
import agentService from '../../services/agentService';
import Alert from '../../components/Alert';
import './Agent.css';

const CreateClient = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    identityNumber: '',
    tempPassword: '1234',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.username.trim()) {
      setError("Le nom d'utilisateur est requis");
      return;
    }

    if (!formData.email.trim()) {
      setError("L'email est requis");
      return;
    }

    if (!formData.identityNumber.trim()) {
      setError("Le numéro d'identité est requis");
      return;
    }

    setLoading(true);

    try {
      await agentService.createClient(formData);
      setSuccess(`Client "${formData.username}" créé avec succès ! Mot de passe temporaire: ${formData.tempPassword}`);
      setFormData({
        username: '',
        email: '',
        identityNumber: '',
        tempPassword: '1234',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création du client');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">➕ Créer un Nouveau Client</h1>
      </div>

      <div className="create-client-container">
        <div className="card create-client-card">
          <Alert type="error" message={error} onClose={() => setError('')} />
          <Alert type="success" message={success} onClose={() => setSuccess('')} />

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Nom d'utilisateur *</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Entrez le nom d'utilisateur"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@exemple.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="identityNumber">Numéro d'identité *</label>
              <input
                type="text"
                id="identityNumber"
                name="identityNumber"
                value={formData.identityNumber}
                onChange={handleChange}
                placeholder="Ex: AB123456"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tempPassword">Mot de passe temporaire</label>
              <input
                type="text"
                id="tempPassword"
                name="tempPassword"
                value={formData.tempPassword}
                onChange={handleChange}
                placeholder="Par défaut: 1234"
              />
              <small className="form-help">
                Le client devra changer ce mot de passe à sa première connexion.
              </small>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? <><span className="spinner"></span> Création...</> : '➕ Créer le Client'}
            </button>
          </form>
        </div>

        <div className="create-client-info">
          <div className="card">
            <h3>📋 Instructions</h3>
            <ul>
              <li>Le nom d'utilisateur doit être unique</li>
              <li>L'email doit être valide et unique</li>
              <li>Le numéro d'identité est obligatoire (CNI, Passeport, etc.)</li>
              <li>Un compte bancaire sera créé automatiquement</li>
              <li>Le client recevra un email avec ses identifiants</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateClient;
