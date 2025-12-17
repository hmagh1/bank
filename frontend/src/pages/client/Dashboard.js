import React, { useState, useEffect } from 'react';
import dashboardService from '../../services/dashboardService';
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusLabel, getOperationBadgeClass, getOperationLabel } from '../../utils/formatters';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import './Client.css';

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getDashboard();
      setDashboard(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement du dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Chargement de votre dashboard..." />;
  }

  const totalBalance = dashboard?.accounts?.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0) || 0;

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">📊 Mon Dashboard</h1>
        <button onClick={fetchDashboard} className="btn btn-secondary">
          🔄 Actualiser
        </button>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card balance-card">
          <div className="summary-icon">💰</div>
          <div className="summary-content">
            <p className="summary-label">Solde Total</p>
            <p className="summary-value">{formatCurrency(totalBalance)}</p>
          </div>
        </div>
        <div className="summary-card accounts-card">
          <div className="summary-icon">🏦</div>
          <div className="summary-content">
            <p className="summary-label">Mes Comptes</p>
            <p className="summary-value">{dashboard?.accounts?.length || 0}</p>
          </div>
        </div>
        <div className="summary-card operations-card">
          <div className="summary-icon">📜</div>
          <div className="summary-content">
            <p className="summary-label">Dernières Opérations</p>
            <p className="summary-value">{dashboard?.operations?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Accounts List */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🏦 Mes Comptes</h2>
        </div>
        {dashboard?.accounts?.length > 0 ? (
          <div className="accounts-grid">
            {dashboard.accounts.map((account) => (
              <div key={account.id} className="account-card">
                <div className="account-number">{account.accountNumber}</div>
                <div className="account-balance">{formatCurrency(account.balance)}</div>
                <span className={getStatusBadgeClass(account.status)}>
                  {getStatusLabel(account.status)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>Aucun compte trouvé</p>
          </div>
        )}
      </div>

      {/* Recent Operations */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📜 Dernières Opérations</h2>
        </div>
        {dashboard?.operations?.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Montant</th>
                <th>Compte Source</th>
                <th>Compte Dest.</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.operations.map((op, index) => (
                <tr key={index}>
                  <td>{formatDate(op.createdAt)}</td>
                  <td>
                    <span className={getOperationBadgeClass(op.type)}>
                      {getOperationLabel(op.type)}
                    </span>
                  </td>
                  <td className={op.type === 'DEPOSIT' ? 'text-success' : 'text-danger'}>
                    {op.type === 'DEPOSIT' ? '+' : '-'}{formatCurrency(op.amount)}
                  </td>
                  <td>{op.sourceAccount || '-'}</td>
                  <td>{op.destinationAccount || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>Aucune opération récente</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
