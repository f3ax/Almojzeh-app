import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/shared/Card';
import StatusBadge from '../../components/shared/StatusBadge';
import Modal from '../../components/shared/Modal';
import * as db from '../../services/db';
import { Plus, Calendar, Clock, MapPin } from 'lucide-react';

export default function Jobs() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ siteId: '', customerId: '', employeeId: '', scheduledDate: '', scheduledTime: '', type: 'inspection', notes: '' });

  const jobs = useMemo(() => {
    let list = db.getJobs();
    if (filter !== 'all') list = list.filter(j => j.status === filter);
    return list.sort((a, b) => b.scheduledDate.localeCompare(a.scheduledDate));
  }, [filter, showNew]);

  const customers = db.getCustomers();
  const sites = db.getSites();
  const employees = db.getUsers().filter(u => u.role === 'employee' || u.role === 'admin');

  const customerSites = form.customerId ? sites.filter(s => s.customerId === form.customerId) : [];

  const handleCreate = (e) => {
    e.preventDefault();
    db.createJob(form);
    setShowNew(false);
    setForm({ siteId: '', customerId: '', employeeId: '', scheduledDate: '', scheduledTime: '', type: 'inspection', notes: '' });
  };

  const filters = [
    { key: 'all', label: t('jobs.all') },
    { key: 'scheduled', label: t('jobs.scheduled') },
    { key: 'in-progress', label: t('jobs.inProgress') },
    { key: 'completed', label: t('jobs.completed') },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">{t('jobs.title')}</h2>
        <button onClick={() => setShowNew(true)} className="bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-800 transition-colors inline-flex items-center gap-1">
          <Plus size={18} /> {t('jobs.new')}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === f.key ? 'bg-teal-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">{t('jobs.noJobs')}</div>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => {
            const site = db.getSiteById(job.siteId);
            const customer = db.getCustomerById(job.customerId);
            const emp = db.getUserById(job.employeeId);
            return (
              <Link key={job.id} to={`/app/jobs/${job.id}`}
                className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{site?.name || '-'}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{customer?.contactName || customer?.companyName}</p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><MapPin size={12} /> {site?.address}</p>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1"><Calendar size={14} /> {job.scheduledDate}</span>
                  <span className="inline-flex items-center gap-1"><Clock size={14} /> {job.scheduledTime}</span>
                  {emp && <span>{emp.name}</span>}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <Modal open={showNew} onClose={() => setShowNew(false)} title={t('jobs.create')}>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('jobs.customer')}</label>
            <select value={form.customerId} onChange={e => setForm(f => ({ ...f, customerId: e.target.value, siteId: '' }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl" required>
              <option value="">--</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.contactName} {c.companyName ? `(${c.companyName})` : ''}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('jobs.site')}</label>
            <select value={form.siteId} onChange={e => setForm(f => ({ ...f, siteId: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl" required>
              <option value="">--</option>
              {customerSites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('jobs.employee')}</label>
            <select value={form.employeeId} onChange={e => setForm(f => ({ ...f, employeeId: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl" required>
              <option value="">--</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('jobs.date')}</label>
              <input type="date" value={form.scheduledDate} onChange={e => setForm(f => ({ ...f, scheduledDate: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('jobs.time')}</label>
              <input type="time" value={form.scheduledTime} onChange={e => setForm(f => ({ ...f, scheduledTime: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('jobs.type')}</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl">
              <option value="inspection">{t('jobs.inspection')}</option>
              <option value="treatment">{t('jobs.treatment')}</option>
              <option value="follow-up">{t('jobs.followUp')}</option>
            </select>
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
