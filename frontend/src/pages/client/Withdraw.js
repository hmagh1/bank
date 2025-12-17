import React, { useState, useEffect } from 'react';
import dashboardService from '../../services/dashboardService';
import accountService from '../../services/accountService';
import { formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import './Client.css';

const Withdraw = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingAccounts, setFetchingAccounts] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setFetchingAccounts(true);
      const data = await dashboardService.getDashboard();
      const openAccounts = data.accounts?.filter(acc => acc.status === 'OPEN') || [];
      setAccounts(openAccounts);
      if (openAccounts.length > 0) {
        setSelectedAccount(openAccounts[0].accountNumber);
      }
    } catch (err) {
      setError('Erreur lors du chargement des comptes');
    } finally {
      setFetchingAccounts(false);
    }
  };

  const getSelectedAccountBalance = () => {
    const account = accounts.find(acc => acc.accountNumber === selectedAccount);
    return account ? parseFloat(account.balance) : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedAccount) {
      setError('Veuillez sélectionner un compte');
      return;
    }

    const amountNum = parseFloat(amount);
    if (!amount || amountNum <= 0) {
      setError('Le montant doit être supérieur à 0');
      return;
    }

    if (amountNum > getSelectedAccountBalance()) {
      setError('Solde insuffisant');
      return;
    }

    setLoading(true);

    try {
      await accountService.withdraw(selectedAccount, amountNum);
      setSuccess(`Retrait de ${formatCurrency(amountNum)} effectué avec succès !`);
      setAmount('');
      fetchAccounts();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du retrait');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingAccounts) {
    return <LoadingSpinner message="Chargement des comptes..." />;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">💸 Effectuer un Retrait</h1>
      </div>

      <div className="operation-container">
        <div className="card operation-card">
          <Alert type="error" message={error} onClose={() => setError('')} />
          <Alert type="success" message={success} onClose={() => setSuccess('')} />

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="account">Compte source</label>
              <select
                id="account"
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                required
              >
                <option value="">Sélectionnez un compte</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.accountNumber}>
                    {account.accountNumber} - Solde: {formatCurrency(account.balance)}
                  </option>
                ))}
              </select>
            </div>

            {selectedAccount && (
              <div className="balance-info">
                Solde disponible: <strong>{formatCurrency(getSelectedAccountBalance())}</strong>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="amount">Montant (€)</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Entrez le montant"
                min="0.01"
                step="0.01"
                max={getSelectedAccountBalance()}
                required
              />
            </div>

            <button type="submit" className="btn btn-danger btn-block" disabled={loading || accounts.length === 0}>
              {loading ? <><span className="spinner"></span> Traitement...</> : '💸 Effectuer le retrait'}
            </button>
          </form>

          {accounts.length === 0 && (
            <div className="alert alert-warning mt-2">
              Aucun compte ouvert disponible pour effectuer un retrait.
            </div>
          )}
        </div>

        <div className="operation-info">
          <div className="card">
            <h3>💡 Information</h3>
            <p>Le retrait sera débité immédiatement de votre compte.</p>
            <ul>
              <li>Montant minimum: 0.01 €</li>
              <li>Maximum: solde disponible</li>
              <li>Exécution immédiate</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
