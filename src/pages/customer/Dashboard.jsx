import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/shared/Card';
import StatusBadge from '../../components/shared/StatusBadge';
import * as db from '../../services/db';
import { Calendar, Clock, Receipt, Briefcase, ArrowLeft, ArrowRight } from 'lucide-react';

export default function CustomerDashboard() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const Arrow = i18n.language === 'ar' ? ArrowLeft : ArrowRight;

  const data = useMemo(() => {
    const customer = db.getCustomerByUserId(user?.id);
    if (!customer) return null;

    const jobs = db.getJobsByCustomerId(customer.id).sort((a, b) => b.scheduledDate.localeCompare(a.scheduledDate));
    const invoices = db.getInvoicesByCustomerId(customer.id);
    const today = new Date().toISOString().split('T')[0];
    const upcoming = jobs.filter(j => j.scheduledDate >= today && j.status !== 'cancelled' && j.status !== 'completed').slice(0, 3);
    const recent = jobs.filter(j => j.status === 'completed').slice(0, 5);
    const paidTotal = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
    const pendingTotal = invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.amount, 0);

    return { customer, jobs, invoices, upcoming, recent, paidTotal, pendingTotal };
  }, [user]);

  if (!data) return <div className="text-center py-12 text-gray-500">{t('common.noData')}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">{t('dashboard.welcomeBack')}، {user?.name}</h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
            <Briefcase size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.jobs.length}</p>
          <p className="text-xs text-gray-500">{t('nav.visits')}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center mb-2">
            <Receipt size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.pendingTotal} <span className="text-sm font-normal">{t('invoices.currency')}</span></p>
          <p className="text-xs text-gray-500">{t('dashboard.outstandingPayments')}</p>
        </div>
      </div>

      {data.upcoming.length > 0 && (
        <Card title={t('dashboard.nextVisit')}>
          {data.upcoming.map(job => {
            const site = db.getSiteById(job.siteId);
            const emp = db.getUserById(job.employeeId);
            return (
              <div key={job.id} className="py-2">
                <p className="font-medium text-gray-800">{site?.name}</p>
                <div className="flex gap-3 text-sm text-gray-500 mt-1">
                  <span className="inline-flex items-center gap-1"><Calendar size={14} /> {job.scheduledDate}</span>
                  <span className="inline-flex items-center gap-1"><Clock size={14} /> {job.scheduledTime}</span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{emp?.name}</p>
                <StatusBadge status={job.status} />
              </div>
            );
          })}
        </Card>
      )}

      <Card
        title={t('dashboard.recentActivity')}
        action={
          <Link to="/customer/visits" className="text-sm text-teal-700 hover:underline inline-flex items-center gap-1">
            {t('nav.visits')} <Arrow size={14} />
          </Link>
        }
      >
        {data.recent.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">{t('common.noData')}</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {data.recent.map(job => {
              const site = db.getSiteById(job.siteId);
              return (
                <Link key={job.id} to={`/customer/visits/${job.id}`} className="py-3 flex items-center justify-between hover:bg-gray-50 -mx-4 px-4 transition-colors">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{site?.name}</p>
                    <p className="text-xs text-gray-500">{job.completedAt}</p>
                  </div>
                  <StatusBadge status={job.status} />
                </Link>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
