import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/shared/Card';
import StatusBadge from '../../components/shared/StatusBadge';
import Modal from '../../components/shared/Modal';
import * as db from '../../services/db';
import { Plus, DollarSign } from 'lucide-react';

export default function Invoices() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');
  const [showNew, setShowNew] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [form, setForm] = useState({ customerId: '', amount: '', dueDate: '', notes: '' });

  const invoices = useMemo(() => {
    let list = db.getInvoices();
    if (filter !== 'all') list = list.filter(i => i.status === filter);
    return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }, [filter, refresh]);

  const customers = db.getCustomers();

  const handleCreate = (e) => {
    e.preventDefault();
    db.createInvoice({ ...form, amount: parseFloat(form.amount), currency: 'JOD', status: 'pending' });
    setShowNew(false);
    setForm({ customerId: '', amount: '', dueDate: '', notes: '' });
    setRefresh(r => r + 1);
  };

  const togglePaid = (inv) => {
    if (inv.status === 'paid') {
      db.updateInvoice(inv.id, { status: 'pending', paidDate: null });
    } else {
      db.updateInvoice(inv.id, { status: 'paid', paidDate: new Date().toISOString().split('T')[0] });
    }
    setRefresh(r => r + 1);
  };

  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const totalPending = invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.amount, 0);

  const filters = [
    { key: 'all', label: t('jobs.all') },
    { key: 'pending', label: t('invoices.pending') },
    { key: 'paid', label: t('invoices.paid') },
    { key: 'overdue', label: t('invoices.overdue') },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">{t('invoices.title')}</h2>
        <button onClick={() => setShowNew(true)} className="bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-800 transition-colors inline-flex items-center gap-1">
          <Plus size={18} /> {t('invoices.new')}
        </button>
      </div>

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

      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === f.key ? 'bg-teal-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-12 text-gray-500">{t('invoices.noInvoices')}</div>
      ) : (
        <div className="space-y-3">
          {invoices.map(inv => {
            const customer = db.getCustomerById(inv.customerId);
            return (
              <div key={inv.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{customer?.contactName || '-'}</p>
                    {customer?.companyName && <p className="text-sm text-gray-500">{customer.companyName}</p>}
                  </div>
                  <div className="text-end">
                    <p className="font-bold text-gray-900">{inv.amount} {t('invoices.currency')}</p>
                    <StatusBadge status={inv.status} />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 text-sm">
                  <span className="text-gray-500">{t('invoices.dueDate')}: {inv.dueDate}</span>
                  <button onClick={() => togglePaid(inv)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${inv.status === 'paid' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                    {inv.status === 'paid' ? t('invoices.markUnpaid') : t('invoices.markPaid')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={showNew} onClose={() => setShowNew(false)} title={t('invoices.new')}>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('jobs.customer')}</label>
            <select value={form.customerId} onChange={e => setForm(f => ({ ...f, customerId: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl" required>
              <option value="">--</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.contactName} {c.companyName ? `(${c.companyName})` : ''}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('invoices.amount')} ({t('invoices.currency')})</label>
            <input type="number" step="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('invoices.dueDate')}</label>
            <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('jobs.notes')}</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl" rows={2} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-teal-700 text-white py-2.5 rounded-xl font-medium hover:bg-teal-800 transition-colors">{t('common.save')}</button>
            <button type="button" onClick={() => setShowNew(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors">{t('common.cancel')}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
