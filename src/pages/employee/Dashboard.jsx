import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/shared/Card';
import StatusBadge from '../../components/shared/StatusBadge';
import * as db from '../../services/db';
import {
  Briefcase, Users, Receipt, CheckCircle, ArrowLeft, ArrowRight,
  Calendar, Clock
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0d9488', '#f59e0b', '#3b82f6', '#ef4444'];

export default function EmployeeDashboard() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRtl = i18n.language === 'ar';
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  const stats = useMemo(() => {
    const jobs = db.getJobs();
    const customers = db.getCustomers();
    const invoices = db.getInvoices();
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = today.slice(0, 7);

    const todayJobs = jobs.filter(j => j.scheduledDate === today);
    const activeJobs = jobs.filter(j => j.status === 'scheduled' || j.status === 'in-progress');
    const completedThisMonth = jobs.filter(j => j.status === 'completed' && j.completedAt?.startsWith(thisMonth));
    const pendingInvoices = invoices.filter(i => i.status === 'pending' || i.status === 'overdue');

    const upcoming = jobs
      .filter(j => j.scheduledDate >= today && j.status !== 'cancelled' && j.status !== 'completed')
      .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))
      .slice(0, 5);

    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toISOString().slice(0, 7);
      const label = d.toLocaleDateString(isRtl ? 'ar-JO' : 'en-US', { month: 'short' });
      const count = jobs.filter(j => j.completedAt?.startsWith(key)).length;
      last6Months.push({ month: label, count });
    }

    const statusDist = [
      { name: t('jobs.completed'), value: jobs.filter(j => j.status === 'completed').length },
      { name: t('jobs.scheduled'), value: jobs.filter(j => j.status === 'scheduled').length },
      { name: t('jobs.inProgress'), value: jobs.filter(j => j.status === 'in-progress').length },
      { name: t('jobs.cancelled'), value: jobs.filter(j => j.status === 'cancelled').length },
    ].filter(s => s.value > 0);

    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
    const pendingRevenue = pendingInvoices.reduce((s, i) => s + i.amount, 0);

    return {
      todayJobs: todayJobs.length,
      totalCustomers: customers.length,
      activeJobs: activeJobs.length,
      pendingInvoices: pendingInvoices.length,
      completedThisMonth: completedThisMonth.length,
      upcoming,
      last6Months,
      statusDist,
      totalRevenue,
      pendingRevenue,
    };
  }, [t, isRtl]);

  const statCards = [
    { label: t('dashboard.todayJobs'), value: stats.todayJobs, icon: Calendar, color: 'text-blue-600 bg-blue-50' },
    { label: t('dashboard.activeJobs'), value: stats.activeJobs, icon: Briefcase, color: 'text-yellow-600 bg-yellow-50' },
    { label: t('dashboard.totalCustomers'), value: stats.totalCustomers, icon: Users, color: 'text-teal-600 bg-teal-50' },
    { label: t('dashboard.completedThisMonth'), value: stats.completedThisMonth, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
    { label: t('dashboard.pendingInvoices'), value: stats.pendingInvoices, icon: Receipt, color: 'text-red-600 bg-red-50' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">
        {t('dashboard.welcomeBack')}، {user?.name}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-2`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card title={t('dashboard.jobsOverTime')}>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.last6Months}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title={t('dashboard.revenueOverview')}>
          <div className="flex items-center gap-6">
            <div className="h-44 w-44 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.statusDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                    {stats.statusDist.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">{t('invoices.paid')}</p>
                <p className="text-xl font-bold text-green-700">{stats.totalRevenue} {t('invoices.currency')}</p>
              </div>
              <div>
                <p className="text-gray-500">{t('invoices.pending')}</p>
                <p className="text-xl font-bold text-yellow-700">{stats.pendingRevenue} {t('invoices.currency')}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card
        title={t('dashboard.upcomingJobs')}
        action={
          <Link to="/app/jobs" className="text-sm text-teal-700 hover:underline inline-flex items-center gap-1">
            {t('jobs.title')} <Arrow size={14} />
          </Link>
        }
      >
        {stats.upcoming.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 text-center">{t('jobs.noJobs')}</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {stats.upcoming.map(job => {
              const site = db.getSiteById(job.siteId);
              const customer = db.getCustomerById(job.customerId);
              return (
                <Link key={job.id} to={`/app/jobs/${job.id}`} className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-4 px-4 transition-colors">
                  <div>
                    <p className="font-medium text-gray-800">{site?.name || '-'}</p>
                    <p className="text-sm text-gray-500">{customer?.contactName || customer?.companyName}</p>
                  </div>
                  <div className="text-end">
                    <p className="text-sm text-gray-600 flex items-center gap-1"><Calendar size={14} /> {job.scheduledDate}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1"><Clock size={14} /> {job.scheduledTime}</p>
                    <StatusBadge status={job.status} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
