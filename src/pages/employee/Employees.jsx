import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/shared/Card';
import Modal from '../../components/shared/Modal';
import * as db from '../../services/db';
import { Plus, Trash2, Shield, User } from 'lucide-react';

export default function Employees() {
  const { t } = useTranslation();
  const [showNew, setShowNew] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [form, setForm] = useState({ name: '', username: '', password: '', role: 'employee' });

  const employees = useMemo(() => {
    return db.getUsers().filter(u => u.role === 'admin' || u.role === 'employee');
  }, [refresh]);

  const handleCreate = (e) => {
    e.preventDefault();
    const existing = db.getUserByUsername(form.username);
    if (existing) {
      alert(t('common.error'));
      return;
    }
    db.createUser(form);
    setShowNew(false);
    setForm({ name: '', username: '', password: '', role: 'employee' });
    setRefresh(r => r + 1);
  };

  const handleDelete = (user) => {
    if (window.confirm(`${t('common.confirm')}: ${t('employees.remove')} ${user.name}?`)) {
      db.deleteUser(user.id);
      setRefresh(r => r + 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">{t('employees.title')}</h2>
        <button onClick={() => setShowNew(true)} className="bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-800 transition-colors inline-flex items-center gap-1">
          <Plus size={18} /> {t('employees.new')}
        </button>
      </div>

      {employees.length === 0 ? (
        <div className="text-center py-12 text-gray-500">{t('employees.noEmployees')}</div>
      ) : (
        <div className="space-y-3">
          {employees.map(emp => {
            const jobCount = db.getJobsByEmployeeId(emp.id).length;
            return (
              <div key={emp.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${emp.role === 'admin' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600'}`}>
                      {emp.role === 'admin' ? <Shield size={18} /> : <User size={18} />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{emp.name}</p>
                      <p className="text-sm text-gray-500">@{emp.username} · {emp.role === 'admin' ? t('employees.admin') : t('employees.employee')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{jobCount} {t('jobs.title')}</span>
                    <button onClick={() => handleDelete(emp)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={showNew} onClose={() => setShowNew(false)} title={t('employees.create')}>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('employees.name')}</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('employees.username')}</label>
            <input type="text" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('employees.password')}</label>
            <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('employees.role')}</label>
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl">
              <option value="employee">{t('employees.employee')}</option>
              <option value="admin">{t('employees.admin')}</option>
            </select>
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
