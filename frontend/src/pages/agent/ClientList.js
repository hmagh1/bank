import React, { useState, useEffect } from 'react';
import agentService from '../../services/agentService';
import accountService from '../../services/accountService';
import { formatCurrency, getStatusBadgeClass, getStatusLabel } from '../../utils/formatters';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import './Agent.css';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedClient, setExpandedClient] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await agentService.getClients();
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (clientId) => {
    setExpandedClient(expandedClient === clientId ? null : clientId);
  };

  const handleAccountAction = async (accountNumber, action) => {
    setError('');
    setSuccess('');
    setActionLoading(accountNumber);

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
      fetchClients();
    } catch (err) {
      setError(err.response?.data?.message || `Erreur lors de l'action sur le compte`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Chargement des clients..." />;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">👥 Liste des Clients</h1>
        <button onClick={fetchClients} className="btn btn-secondary">
          🔄 Actualiser
        </button>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />
      <Alert type="success" message={success} onClose={() => setSuccess('')} />

      <div className="card">
        {clients.length > 0 ? (
          <table className="table clients-table">
            <thead>
              <tr>
                <th></th>
                <th>Nom d'utilisateur</th>
                <th>Email</th>
                <th>N° Identité</th>
                <th>Nb Comptes</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <React.Fragment key={client.id}>
                  <tr>
                    <td>
                      <button
                        className="expand-button"
                        onClick={() => toggleExpand(client.id)}
                      >
                        {expandedClient === client.id ? '▼' : '▶'}
                      </button>
                    </td>
                    <td>{client.username}</td>
                    <td>{client.email || '-'}</td>
                    <td>{client.identityNumber || '-'}</td>
                    <td>{client.accounts?.length || 0}</td>
                  </tr>
                  {expandedClient === client.id && client.accounts?.length > 0 && (
                    <tr className="expanded-row">
                      <td colSpan="5">
                        <div className="accounts-details">
                          <h4>Comptes du client</h4>
                          <table className="table nested-table">
                            <thead>
                              <tr>
                                <th>N° Compte</th>
                                <th>Solde</th>
                                <th>Statut</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {client.accounts.map((account) => (
                                <tr key={account.id}>
                                  <td>{account.accountNumber}</td>
                                  <td>{formatCurrency(account.balance)}</td>
                                  <td>
                                    <span className={getStatusBadgeClass(account.status)}>
                                      {getStatusLabel(account.status)}
                                    </span>
                                  </td>
                                  <td>
                                    <div className="account-actions">
                                      {account.status === 'OPEN' && (
                                        <button
                                          className="btn btn-warning btn-sm"
                                          onClick={() => handleAccountAction(account.accountNumber, 'block')}
                                          disabled={actionLoading === account.accountNumber}
                                        >
                                          {actionLoading === account.accountNumber ? '...' : '🔒 Bloquer'}
                                        </button>
                                      )}
                                      {account.status === 'BLOCKED' && (
                                        <button
                                          className="btn btn-success btn-sm"
                                          onClick={() => handleAccountAction(account.accountNumber, 'unblock')}
                                          disabled={actionLoading === account.accountNumber}
                                        >
                                          {actionLoading === account.accountNumber ? '...' : '🔓 Débloquer'}
                                        </button>
                                      )}
                                      {account.status !== 'CLOSED' && (
                                        <button
                                          className="btn btn-danger btn-sm"
                                          onClick={() => handleAccountAction(account.accountNumber, 'close')}
                                          disabled={actionLoading === account.accountNumber}
                                        >
                                          {actionLoading === account.accountNumber ? '...' : '❌ Clôturer'}
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>🔍 Aucun client trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientList;
