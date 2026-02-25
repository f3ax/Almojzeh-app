import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/shared/Card';
import StatusBadge from '../../components/shared/StatusBadge';
import * as db from '../../services/db';
import { Receipt } from 'lucide-react';

export default function CustomerInvoices() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const customer = useMemo(() => db.getCustomerByUserId(user?.id), [user]);
  const invoices = useMemo(() => {
    if (!customer) return [];
    return db.getInvoicesByCustomerId(customer.id).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }, [customer]);

  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const totalPending = invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">{t('invoices.title')}</h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <p className="text-sm text-green-600">{t('invoices.paid')}</p>
          <p className="text-xl font-bold text-green-700">{totalPaid} {t('invoices.currency')}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
          <p className="text-sm text-yellow-600">{t('invoices.pending')}</p>
          <p className="text-xl font-bold text-yellow-700">{totalPending} {t('invoices.currency')}</p>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-12 text-gray-500">{t('invoices.noInvoices')}</div>
      ) : (
        <div className="space-y-3">
          {invoices.map(inv => (
            <div key={inv.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${inv.status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                    <Receipt size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{inv.amount} {t('invoices.currency')}</p>
                    <p className="text-xs text-gray-500">{t('invoices.dueDate')}: {inv.dueDate}</p>
                    {inv.paidDate && <p className="text-xs text-green-600">{t('invoices.paidDate')}: {inv.paidDate}</p>}
                  </div>
                </div>
                <StatusBadge status={inv.status} />
              </div>
              {inv.notes && <p className="text-sm text-gray-500 mt-2">{inv.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
