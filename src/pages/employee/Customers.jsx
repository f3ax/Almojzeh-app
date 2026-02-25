import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Card from '../../components/shared/Card';
import Modal from '../../components/shared/Modal';
import * as db from '../../services/db';
import { Plus, Phone, Mail, MapPin, Building } from 'lucide-react';

export default function Customers() {
  const { t } = useTranslation();
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [form, setForm] = useState({ contactName: '', companyName: '', phone: '', email: '', address: '', notes: '' });

  const customers = useMemo(() => {
    let list = db.getCustomers();
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c => c.contactName.toLowerCase().includes(q) || (c.companyName || '').toLowerCase().includes(q) || c.phone.includes(q));
    }
    return list;
  }, [search, refresh]);

  const handleCreate = (e) => {
    e.preventDefault();
    db.createCustomer(form);
    setShowNew(false);
    setForm({ contactName: '', companyName: '', phone: '', email: '', address: '', notes: '' });
    setRefresh(r => r + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">{t('customers.title')}</h2>
        <button onClick={() => setShowNew(true)} className="bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-800 transition-colors inline-flex items-center gap-1">
          <Plus size={18} /> {t('customers.new')}
        </button>
      </div>

      <input type="text" value={search} onChange={e => setSearch(e.target.value)}
        placeholder={t('common.search')} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" />

      {customers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">{t('customers.noCustomers')}</div>
      ) : (
        <div className="space-y-3">
          {customers.map(c => {
            const sites = db.getSitesByCustomerId(c.id);
            const jobs = db.getJobsByCustomerId(c.id);
            return (
              <Link key={c.id} to={`/app/customers/${c.id}`}
                className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{c.contactName}</p>
                    {c.companyName && <p className="text-sm text-gray-500 flex items-center gap-1"><Building size={14} /> {c.companyName}</p>}
                  </div>
                  <span className="text-xs text-gray-400">{sites.length} {t('customers.sites')} | {jobs.length} {t('jobs.title')}</span>
                </div>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1"><Phone size={14} /> {c.phone}</span>
                  {c.email && <span className="inline-flex items-center gap-1"><Mail size={14} /> {c.email}</span>}
                  <span className="inline-flex items-center gap-1"><MapPin size={14} /> {c.address}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <Modal open={showNew} onClose={() => setShowNew(false)} title={t('customers.create')}>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('customers.name')}</label>
            <input type="text" value={form.contactName} onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('customers.company')}</label>
            <input type="text" value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('customers.phone')}</label>
            <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('customers.email')}</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('customers.address')}</label>
            <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl" required />
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
