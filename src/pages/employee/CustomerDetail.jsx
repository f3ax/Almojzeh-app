import { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../../components/shared/Card';
import StatusBadge from '../../components/shared/StatusBadge';
import * as db from '../../services/db';
import { ArrowRight, ArrowLeft, Phone, Mail, MapPin, Building, QrCode } from 'lucide-react';

export default function CustomerDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const Arrow = i18n.language === 'ar' ? ArrowRight : ArrowLeft;

  const customer = useMemo(() => db.getCustomerById(id), [id]);
  const sites = useMemo(() => customer ? db.getSitesByCustomerId(customer.id) : [], [customer]);
  const jobs = useMemo(() => customer ? db.getJobsByCustomerId(customer.id).sort((a, b) => b.scheduledDate.localeCompare(a.scheduledDate)) : [], [customer]);
  const invoices = useMemo(() => customer ? db.getInvoicesByCustomerId(customer.id) : [], [customer]);

  if (!customer) return <div className="text-center py-12 text-gray-500">{t('customers.noCustomers')}</div>;

  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const totalPending = invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-4">
      <button onClick={() => navigate('/app/customers')} className="text-teal-700 text-sm inline-flex items-center gap-1 hover:underline">
        <Arrow size={16} /> {t('customers.title')}
      </button>

      <h2 className="text-xl font-bold text-gray-800">{t('customers.details')}</h2>

      <Card>
        <div className="space-y-2 text-sm">
          <p className="text-lg font-semibold text-gray-800">{customer.contactName}</p>
          {customer.companyName && <p className="flex items-center gap-2 text-gray-600"><Building size={16} /> {customer.companyName}</p>}
          <p className="flex items-center gap-2 text-gray-600"><Phone size={16} /> {customer.phone}</p>
          {customer.email && <p className="flex items-center gap-2 text-gray-600"><Mail size={16} /> {customer.email}</p>}
          <p className="flex items-center gap-2 text-gray-600"><MapPin size={16} /> {customer.address}</p>
        </div>
        <div className="flex gap-4 mt-4 pt-3 border-t border-gray-100 text-sm">
          <div>
            <p className="text-gray-500">{t('invoices.paid')}</p>
            <p className="font-bold text-green-700">{totalPaid} {t('invoices.currency')}</p>
          </div>
          <div>
            <p className="text-gray-500">{t('invoices.pending')}</p>
            <p className="font-bold text-yellow-700">{totalPending} {t('invoices.currency')}</p>
          </div>
        </div>
      </Card>

      <Card title={`${t('customers.sites')} (${sites.length})`}>
        {sites.length === 0 ? (
          <p className="text-gray-500 text-sm">{t('common.noData')}</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {sites.map(s => (
              <div key={s.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{s.name}</p>
                  <p className="text-xs text-gray-500">{s.address}</p>
                </div>
                <span className="text-xs text-gray-400 flex items-center gap-1"><QrCode size={12} /> {s.barcode}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title={`${t('jobs.title')} (${jobs.length})`}>
        {jobs.length === 0 ? (
          <p className="text-gray-500 text-sm">{t('jobs.noJobs')}</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {jobs.slice(0, 10).map(j => {
              const site = db.getSiteById(j.siteId);
              return (
                <Link key={j.id} to={`/app/jobs/${j.id}`} className="py-3 flex items-center justify-between hover:bg-gray-50 -mx-4 px-4 transition-colors">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{site?.name}</p>
                    <p className="text-xs text-gray-500">{j.scheduledDate} {j.scheduledTime}</p>
                  </div>
                  <StatusBadge status={j.status} />
                </Link>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
