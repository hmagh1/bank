import React, { useState } from 'react';
import accountService from '../../services/accountService';
import { formatCurrency } from '../../utils/formatters';
import Alert from '../../components/Alert';
import './Agent.css';

const AgentOperations = () => {
  const [operationType, setOperationType] = useState('deposit');
  const [formData, setFormData] = useState({
    accountNumber: '',
    toAccount: '',
    amount: '',
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

    const amount = parseFloat(formData.amount);
    if (!formData.accountNumber.trim()) {
      setError('Veuillez entrer un numéro de compte');
      return;
    }

    if (!amount || amount <= 0) {
      setError('Le montant doit être supérieur à 0');
      return;
    }

    if (operationType === 'transfer' && !formData.toAccount.trim()) {
      setError('Veuillez entrer le compte destinataire');
      return;
    }

    if (operationType === 'transfer' && formData.accountNumber === formData.toAccount) {
      setError('Les comptes source et destination doivent être différents');
      return;
    }

    setLoading(true);

    try {
      switch (operationType) {
        case 'deposit':
          await accountService.deposit(formData.accountNumber, amount);
          setSuccess(`Dépôt de ${formatCurrency(amount)} effectué sur le compte ${formData.accountNumber}`);
          break;
        case 'withdraw':
          await accountService.withdraw(formData.accountNumber, amount);
          setSuccess(`Retrait de ${formatCurrency(amount)} effectué sur le compte ${formData.accountNumber}`);
          break;
        case 'transfer':
          await accountService.transfer(formData.accountNumber, formData.toAccount, amount);
          setSuccess(`Virement de ${formatCurrency(amount)} effectué de ${formData.accountNumber} vers ${formData.toAccount}`);
          break;
        default:
          break;
      }
      setFormData({
        accountNumber: '',
        toAccount: '',
        amount: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'opération");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">💰 Opérations Bancaires</h1>
      </div>

      <div className="operations-container">
        <div className="card operations-card">
          <div className="operation-tabs">
            <button
              className={`tab ${operationType === 'deposit' ? 'active' : ''}`}
              onClick={() => setOperationType('deposit')}
            >
              💵 Dépôt
            </button>
            <button
              className={`tab ${operationType === 'withdraw' ? 'active' : ''}`}
              onClick={() => setOperationType('withdraw')}
            >
              💸 Retrait
            </button>
            <button
              className={`tab ${operationType === 'transfer' ? 'active' : ''}`}
              onClick={() => setOperationType('transfer')}
            >
              🔄 Virement
            </button>
          </div>

          <Alert type="error" message={error} onClose={() => setError('')} />
          <Alert type="success" message={success} onClose={() => setSuccess('')} />

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="accountNumber">
                {operationType === 'transfer' ? 'Compte source' : 'Numéro de compte'}
              </label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Entrez le numéro de compte"
                required
              />
            </div>

            {operationType === 'transfer' && (
              <div className="form-group">
                <label htmlFor="toAccount">Compte destinataire</label>
                <input
                  type="text"
                  id="toAccount"
                  name="toAccount"
                  value={formData.toAccount}
                  onChange={handleChange}
                  placeholder="Entrez le numéro du compte destinataire"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="amount">Montant (€)</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Entrez le montant"
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <button
              type="submit"
              className={`btn btn-block ${
                operationType === 'deposit'
                  ? 'btn-success'
                  : operationType === 'withdraw'
                  ? 'btn-danger'
                  : 'btn-primary'
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Traitement...
                </>
              ) : operationType === 'deposit' ? (
                '💵 Effectuer le dépôt'
              ) : operationType === 'withdraw' ? (
                '💸 Effectuer le retrait'
              ) : (
                '🔄 Effectuer le virement'
              )}
            </button>
          </form>
        </div>

        <div className="operations-info">
          <div className="card">
            <h3>
              {operationType === 'deposit'
                ? '💵 Dépôt'
                : operationType === 'withdraw'
                ? '💸 Retrait'
                : '🔄 Virement'}
            </h3>
            <p>
              {operationType === 'deposit'
                ? "Créditer un compte client avec le montant spécifié."
                : operationType === 'withdraw'
                ? "Débiter un compte client du montant spécifié."
                : "Transférer des fonds d'un compte à un autre."}
            </p>
            <ul>
              <li>Vérifiez le numéro de compte</li>
              <li>Montant minimum: 0.01 €</li>
              {operationType === 'withdraw' && <li>Le compte doit avoir un solde suffisant</li>}
              {operationType === 'transfer' && (
                <>
                  <li>Vérifiez le compte destinataire</li>
                  <li>Le compte source doit avoir un solde suffisant</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentOperations;
