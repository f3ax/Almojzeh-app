import { useTranslation } from 'react-i18next';

const statusStyles = {
  scheduled: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-600',
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  overdue: 'bg-red-100 text-red-800',
};

const statusKeys = {
  scheduled: 'jobs.scheduled',
  'in-progress': 'jobs.inProgress',
  completed: 'jobs.completed',
  cancelled: 'jobs.cancelled',
  paid: 'invoices.paid',
  pending: 'invoices.pending',
  overdue: 'invoices.overdue',
};

export default function StatusBadge({ status }) {
  const { t } = useTranslation();
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-600'}`}>
      {t(statusKeys[status] || status)}
    </span>
  );
}
