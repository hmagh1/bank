import React, { useState, useEffect, useCallback } from 'react';
import dashboardService from '../../services/dashboardService';
import accountService from '../../services/accountService';
import { formatCurrency, formatDate, getOperationBadgeClass, getOperationLabel } from '../../utils/formatters';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import Pagination from '../../components/Pagination';
import './Client.css';

const History = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingAccounts, setFetchingAccounts] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  const fetchOperations = useCallback(async (page) => {
    if (!selectedAccount) return;
    
    try {
      setLoading(true);
      setError('');
      const data = await accountService.getOperations(selectedAccount, page, pageSize);
      setOperations(data.content || []);
      setTotalPages(data.totalPages || 0);
      setCurrentPage(page);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des opérations');
      setOperations([]);
    } finally {
      setLoading(false);
    }
  }, [selectedAccount]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setFetchingAccounts(true);
        const data = await dashboardService.getDashboard();
        setAccounts(data.accounts || []);
        if (data.accounts?.length > 0) {
          setSelectedAccount(data.accounts[0].accountNumber);
        }
      } catch (err) {
        setError('Erreur lors du chargement des comptes');
      } finally {
        setFetchingAccounts(false);
      }
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchOperations(0);
    }
  }, [selectedAccount, fetchOperations]);

  const handlePageChange = (newPage) => {
    fetchOperations(newPage);
  };

  if (fetchingAccounts) {
    return <LoadingSpinner message="Chargement des comptes..." />;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">📜 Historique des Opérations</h1>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />

      <div className="card">
        <div className="form-group">
          <label htmlFor="account">Sélectionnez un compte</label>
          <select
            id="account"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
          >
            <option value="">Choisir un compte</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.accountNumber}>
                {account.accountNumber} - Solde: {formatCurrency(account.balance)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <LoadingSpinner message="Chargement des opérations..." />
        ) : operations.length > 0 ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Montant</th>
                  <th>Compte Source</th>
                  <th>Compte Destination</th>
                </tr>
              </thead>
              <tbody>
                {operations.map((op, index) => (
                  <tr key={index}>
                    <td>{formatDate(op.createdAt)}</td>
                    <td>
                      <span className={getOperationBadgeClass(op.type)}>
                        {getOperationLabel(op.type)}
                      </span>
                    </td>
                    <td>
                      <span className={op.type === 'DEPOSIT' ? 'text-success' : op.type === 'WITHDRAW' ? 'text-danger' : ''}>
                        {op.type === 'DEPOSIT' ? '+' : op.type === 'WITHDRAW' ? '-' : ''}{formatCurrency(op.amount)}
                      </span>
                    </td>
                    <td>{op.sourceAccount || '-'}</td>
                    <td>{op.destinationAccount || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : selectedAccount ? (
          <div className="empty-state">
            <p>🔍 Aucune opération trouvée pour ce compte</p>
          </div>
        ) : (
          <div className="empty-state">
            <p>👆 Sélectionnez un compte pour voir l'historique</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
