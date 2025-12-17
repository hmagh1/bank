import React, { useState } from 'react';
import accountService from '../../services/accountService';
import Alert from '../../components/Alert';
import './Agent.css';

const ManageAccounts = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const searchAccount = async () => {
    if (!accountNumber.trim()) {
      setError('Veuillez entrer un numéro de compte');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);
    setAccountInfo(null);

    try {
      // Try to get operations to verify account exists
      const data = await accountService.getOperations(accountNumber, 0, 1);
      // If we get here, account exists - we need to extract account info
      // Since we don't have a direct endpoint, we'll show basic info
      setAccountInfo({
        accountNumber: accountNumber,
        exists: true,
        hasOperations: data.totalElements > 0,
      });
    } catch (err) {
      setError('Compte non trouvé ou erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    setError('');
    setSuccess('');
    setActionLoading(true);

    try {
      switch (action) {
        case 'block':
          await accountService.blockAccount(accountNumber);
          setSuccess(`Compte ${accountNumber} bloqué avec succès`);
          break;
        case 'unblock':
          await accountService.unblockAccount(accountNumber);
          setSuccess(`Compte ${accountNumber} débloqué avec succès`);
          break;
        case 'close':
          await accountService.closeAccount(accountNumber);
          setSuccess(`Compte ${accountNumber} clôturé avec succès`);
          break;
        default:
          break;
      }
      // Refresh account info
      searchAccount();
    } catch (err) {
      setError(err.response?.data?.message || `Erreur lors de l'action sur le compte`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">⚙️ Gestion des Comptes</h1>
      </div>

      <div className="manage-accounts-container">
        <div className="card manage-card">
          <Alert type="error" message={error} onClose={() => setError('')} />
          <Alert type="success" message={success} onClose={() => setSuccess('')} />

          <div className="search-section">
            <div className="form-group">
              <label htmlFor="accountNumber">Numéro de compte</label>
              <div className="search-input-group">
                <input
                  type="text"
                  id="accountNumber"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Entrez le numéro de compte"
                  onKeyPress={(e) => e.key === 'Enter' && searchAccount()}
                />
                <button
                  onClick={searchAccount}
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? '...' : '🔍 Rechercher'}
                </button>
              </div>
            </div>
          </div>

          {accountInfo && (
            <div className="account-details-section">
              <h3>Compte trouvé : {accountInfo.accountNumber}</h3>
              <p>Ce compte existe et est accessible.</p>

              <div className="action-buttons">
                <button
                  className="btn btn-warning"
                  onClick={() => handleAction('block')}
                  disabled={actionLoading}
                >
                  {actionLoading ? '...' : '🔒 Bloquer'}
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => handleAction('unblock')}
                  disabled={actionLoading}
                >
                  {actionLoading ? '...' : '🔓 Débloquer'}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleAction('close')}
                  disabled={actionLoading}
                >
                  {actionLoading ? '...' : '❌ Clôturer'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="manage-info">
          <div className="card">
            <h3>ℹ️ Information</h3>
            <p>Gérez les statuts des comptes clients :</p>
            <ul>
              <li><strong>Bloquer :</strong> Suspend temporairement le compte</li>
              <li><strong>Débloquer :</strong> Réactive un compte bloqué</li>
              <li><strong>Clôturer :</strong> Ferme définitivement le compte</li>
            </ul>
            <div className="status-legend">
              <h4>Légende des statuts</h4>
              <p><span className="badge badge-open">OUVERT</span> Compte actif</p>
              <p><span className="badge badge-blocked">BLOQUÉ</span> Compte suspendu</p>
              <p><span className="badge badge-closed">CLÔTURÉ</span> Compte fermé</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAccounts;
