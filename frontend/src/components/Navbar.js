import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  // Determine if user is agent based on username
  const isAgent = user?.username?.includes('agent');

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🏦</span>
          <span className="brand-text">E-Bank</span>
        </Link>

        <div className="navbar-menu">
          {isAgent ? (
            // Agent Menu
            <>
              <Link to="/agent/clients" className={`nav-link ${isActive('/agent/clients') ? 'active' : ''}`}>
                👥 Clients
              </Link>
              <Link to="/agent/create-client" className={`nav-link ${isActive('/agent/create-client') ? 'active' : ''}`}>
                ➕ Nouveau Client
              </Link>
              <Link to="/agent/operations" className={`nav-link ${isActive('/agent/operations') ? 'active' : ''}`}>
                💰 Opérations
              </Link>
              <Link to="/agent/manage-accounts" className={`nav-link ${isActive('/agent/manage-accounts') ? 'active' : ''}`}>
                ⚙️ Gestion Comptes
              </Link>
            </>
          ) : (
            // Client Menu
            <>
              <Link to="/client/dashboard" className={`nav-link ${isActive('/client/dashboard') ? 'active' : ''}`}>
                📊 Dashboard
              </Link>
              <Link to="/client/deposit" className={`nav-link ${isActive('/client/deposit') ? 'active' : ''}`}>
                💵 Dépôt
              </Link>
              <Link to="/client/withdraw" className={`nav-link ${isActive('/client/withdraw') ? 'active' : ''}`}>
                💸 Retrait
              </Link>
              <Link to="/client/transfer" className={`nav-link ${isActive('/client/transfer') ? 'active' : ''}`}>
                🔄 Virement
              </Link>
              <Link to="/client/history" className={`nav-link ${isActive('/client/history') ? 'active' : ''}`}>
                📜 Historique
              </Link>
            </>
          )}
        </div>

        <div className="navbar-user">
          <Link to="/profile" className="user-info">
            <span className="user-icon">👤</span>
            <span className="user-name">{user?.username}</span>
          </Link>
          <button onClick={handleLogout} className="btn-logout">
            🚪 Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
