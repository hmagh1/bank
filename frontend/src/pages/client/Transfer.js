import React, { useState, useEffect } from 'react';
import dashboardService from '../../services/dashboardService';
import accountService from '../../services/accountService';
import { formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import './Client.css';

const Transfer = () => {
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
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
        setFromAccount(openAccounts[0].accountNumber);
      }
    } catch (err) {
      setError('Erreur lors du chargement des comptes');
    } finally {
      setFetchingAccounts(false);
    }
  };

  const getFromAccountBalance = () => {
    const account = accounts.find(acc => acc.accountNumber === fromAccount);
    return account ? parseFloat(account.balance) : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fromAccount) {
      setError('Veuillez sélectionner un compte source');
      return;
    }

    if (!toAccount) {
      setError('Veuillez entrer le numéro du compte bénéficiaire');
      return;
    }

    if (fromAccount === toAccount) {
      setError('Le compte source et le compte destination doivent être différents');
      return;
    }

    const amountNum = parseFloat(amount);
    if (!amount || amountNum <= 0) {
      setError('Le montant doit être supérieur à 0');
      return;
    }

    if (amountNum > getFromAccountBalance()) {
      setError('Solde insuffisant');
      return;
    }

    setLoading(true);

    try {
      await accountService.transfer(fromAccount, toAccount, amountNum);
      setSuccess(`Virement de ${formatCurrency(amountNum)} effectué avec succès !`);
      setAmount('');
      setToAccount('');
      fetchAccounts();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du virement');
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
        <h1 className="page-title">🔄 Effectuer un Virement</h1>
      </div>

      <div className="operation-container">
        <div className="card operation-card">
          <Alert type="error" message={error} onClose={() => setError('')} />
          <Alert type="success" message={success} onClose={() => setSuccess('')} />

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fromAccount">Compte source</label>
              <select
                id="fromAccount"
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
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

            {fromAccount && (
              <div className="balance-info">
                Solde disponible: <strong>{formatCurrency(getFromAccountBalance())}</strong>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="toAccount">Compte bénéficiaire (RIB)</label>
              <input
                type="text"
                id="toAccount"
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                placeholder="Entrez le numéro de compte"
                required
              />
            </div>

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
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading || accounts.length === 0}>
              {loading ? <><span className="spinner"></span> Traitement...</> : '🔄 Effectuer le virement'}
            </button>
          </form>

          {accounts.length === 0 && (
            <div className="alert alert-warning mt-2">
              Aucun compte ouvert disponible pour effectuer un virement.
            </div>
          )}
        </div>

        <div className="operation-info">
          <div className="card">
            <h3>💡 Information</h3>
            <p>Le virement sera effectué instantanément.</p>
            <ul>
              <li>Vérifiez bien le RIB du bénéficiaire</li>
              <li>Montant minimum: 0.01 €</li>
              <li>Maximum: solde disponible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfer;
