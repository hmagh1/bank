import React, { useState } from 'react';
import accountService from '../../services/accountService';
import { formatCurrency, formatDate, getOperationBadgeClass, getOperationLabel } from '../../utils/formatters';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import Pagination from '../../components/Pagination';
import './Agent.css';

const AgentHistory = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searched, setSearched] = useState(false);
  const pageSize = 10;

  const fetchOperations = async (page = 0) => {
    if (!accountNumber.trim()) {
      setError('Veuillez entrer un numéro de compte');
      return;
    }

    setError('');
    setLoading(true);
    setSearched(true);

    try {
      const data = await accountService.getOperations(accountNumber, page, pageSize);
      setOperations(data.content || []);
      setTotalPages(data.totalPages || 0);
      setCurrentPage(page);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des opérations');
      setOperations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOperations(0);
  };

  const handlePageChange = (newPage) => {
    fetchOperations(newPage);
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">📜 Historique des Opérations</h1>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />

      <div className="card">
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-group">
            <label htmlFor="accountNumber">Numéro de compte</label>
            <div className="search-input-group">
              <input
                type="text"
                id="accountNumber"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Entrez le numéro de compte"
              />
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '...' : '🔍 Rechercher'}
              </button>
            </div>
          </div>
        </form>
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
        ) : searched ? (
          <div className="empty-state">
            <p>🔍 Aucune opération trouvée pour ce compte</p>
          </div>
        ) : (
          <div className="empty-state">
            <p>👆 Entrez un numéro de compte pour voir l'historique</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentHistory;
