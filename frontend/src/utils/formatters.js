export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'OPEN':
      return 'badge badge-open';
    case 'BLOCKED':
      return 'badge badge-blocked';
    case 'CLOSED':
      return 'badge badge-closed';
    default:
      return 'badge';
  }
};

export const getOperationBadgeClass = (type) => {
  switch (type) {
    case 'DEPOSIT':
      return 'badge badge-deposit';
    case 'WITHDRAW':
      return 'badge badge-withdraw';
    case 'TRANSFER':
      return 'badge badge-transfer';
    default:
      return 'badge';
  }
};

export const getStatusLabel = (status) => {
  switch (status) {
    case 'OPEN':
      return 'Ouvert';
    case 'BLOCKED':
      return 'Bloqué';
    case 'CLOSED':
      return 'Clôturé';
    default:
      return status;
  }
};

export const getOperationLabel = (type) => {
  switch (type) {
    case 'DEPOSIT':
      return 'Dépôt';
    case 'WITHDRAW':
      return 'Retrait';
    case 'TRANSFER':
      return 'Virement';
    default:
      return type;
  }
};
