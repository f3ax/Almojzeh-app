import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import StatusBadge from '../../components/shared/StatusBadge';
import * as db from '../../services/db';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

export default function Visits() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const visits = useMemo(() => {
    const customer = db.getCustomerByUserId(user?.id);
    if (!customer) return [];
    return db.getJobsByCustomerId(customer.id).sort((a, b) => b.scheduledDate.localeCompare(a.scheduledDate));
  }, [user]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">{t('nav.visits')}</h2>

      {visits.length === 0 ? (
        <div className="text-center py-12 text-gray-500">{t('common.noData')}</div>
      ) : (
        <div className="space-y-3">
          {visits.map(job => {
            const site = db.getSiteById(job.siteId);
            const emp = db.getUserById(job.employeeId);
            return (
              <Link key={job.id} to={`/customer/visits/${job.id}`}
                className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{site?.name || '-'}</p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><MapPin size={12} /> {site?.address}</p>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1"><Calendar size={14} /> {job.scheduledDate}</span>
                  <span className="inline-flex items-center gap-1"><Clock size={14} /> {job.scheduledTime}</span>
                  {emp && <span className="inline-flex items-center gap-1"><User size={14} /> {emp.name}</span>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
