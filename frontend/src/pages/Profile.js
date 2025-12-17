import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getMe();
      setProfile(data);
    } catch (err) {
      setError('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Chargement du profil..." />;
  }

  const isAgent = user?.username?.includes('agent');

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">👤 Mon Profil</h1>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />

      <div className="profile-container">
        <div className="card profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {isAgent ? '👮' : '👤'}
            </div>
            <div className="profile-info">
              <h2>{profile?.username || user?.username}</h2>
              <span className={`role-badge ${isAgent ? 'agent' : 'client'}`}>
                {isAgent ? 'AGENT' : 'CLIENT'}
              </span>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-row">
              <span className="detail-label">Nom d'utilisateur</span>
              <span className="detail-value">{profile?.username || user?.username}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Rôle(s)</span>
              <span className="detail-value">
                {profile?.roles?.map((role, i) => (
                  <span key={i} className="role-tag">
                    {typeof role === 'string' ? role : role.authority}
                  </span>
                ))}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Première connexion</span>
              <span className="detail-value">
                {profile?.firstLogin ? 'Oui' : 'Non'}
              </span>
            </div>
          </div>

          <div className="profile-actions">
            <Link to="/change-password" className="btn btn-primary">
              🔐 Changer mon mot de passe
            </Link>
          </div>
        </div>

        <div className="profile-sidebar">
          <div className="card">
            <h3>📋 Actions rapides</h3>
            <div className="quick-actions">
              {isAgent ? (
                <>
                  <Link to="/agent/clients" className="quick-action">
                    👥 Voir les clients
                  </Link>
                  <Link to="/agent/create-client" className="quick-action">
                    ➕ Créer un client
                  </Link>
                  <Link to="/agent/operations" className="quick-action">
                    💰 Opérations
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/client/dashboard" className="quick-action">
                    📊 Dashboard
                  </Link>
                  <Link to="/client/transfer" className="quick-action">
                    🔄 Virement
                  </Link>
                  <Link to="/client/history" className="quick-action">
                    📜 Historique
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
