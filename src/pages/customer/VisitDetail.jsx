import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../../components/shared/Card';
import StatusBadge from '../../components/shared/StatusBadge';
import * as db from '../../services/db';
import { ArrowRight, ArrowLeft, Calendar, Clock, MapPin, User, CheckCircle, XCircle, Camera } from 'lucide-react';

export default function VisitDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const Arrow = i18n.language === 'ar' ? ArrowRight : ArrowLeft;

  const job = useMemo(() => db.getJobById(id), [id]);
  const site = useMemo(() => job ? db.getSiteById(job.siteId) : null, [job]);
  const emp = useMemo(() => job ? db.getUserById(job.employeeId) : null, [job]);
  const checklist = useMemo(() => job ? db.getChecklistByJobId(job.id) : null, [job]);
  const images = useMemo(() => job ? db.getImagesByJobId(job.id) : [], [job]);

  if (!job) return <div className="text-center py-12 text-gray-500">{t('common.noData')}</div>;

  const checklistImages = checklist ? checklist.items.filter(item => item.image) : [];

  return (
    <div className="space-y-4">
      <button onClick={() => navigate('/customer/visits')} className="text-teal-700 text-sm inline-flex items-center gap-1 hover:underline">
        <Arrow size={16} /> {t('nav.visits')}
      </button>

      <div className="flex items-start justify-between">
        <h2 className="text-xl font-bold text-gray-800">{site?.name}</h2>
        <StatusBadge status={job.status} />
      </div>

      <Card>
        <div className="space-y-2 text-sm">
          <p className="flex items-center gap-2"><MapPin size={16} className="text-gray-400" /> {site?.address}</p>
          <p className="flex items-center gap-2"><Calendar size={16} className="text-gray-400" /> {job.scheduledDate}</p>
          <p className="flex items-center gap-2"><Clock size={16} className="text-gray-400" /> {job.scheduledTime}</p>
          <p className="flex items-center gap-2"><User size={16} className="text-gray-400" /> {emp?.name}</p>
          <p className="text-gray-500">{t('jobs.type')}: {t(`jobs.${job.type === 'follow-up' ? 'followUp' : job.type}`)}</p>
        </div>
        {job.notes && <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{job.notes}</p>}
      </Card>

      {checklist && (
        <Card title={t('checklist.title')}>
          <div className="space-y-2">
            {checklist.items.map((item, idx) => (
              <div key={idx} className="py-1.5">
                <div className="flex items-start gap-3">
                  {item.checked ? (
                    <CheckCircle size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle size={18} className="text-gray-300 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm ${item.checked ? 'text-gray-800' : 'text-gray-400'}`}>
                      {t(`checklist.items.${item.key}`)}
                    </p>
                    {item.notes && <p className="text-xs text-gray-500 mt-0.5">{item.notes}</p>}
                    {item.image && (
                      <img src={item.image} alt="" className="mt-2 h-24 w-auto object-cover rounded-lg border border-gray-200" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {(images.length > 0 || checklistImages.length > 0) && (
        <Card title={t('common.images')}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map(img => (
              <div key={img.id}>
                {img.dataUrl ? (
                  <img src={img.dataUrl} alt={img.caption || ''} className="w-full aspect-square object-cover rounded-lg border border-gray-200" />
                ) : (
                  <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
                    <div className="text-center p-2">
                      <Camera size={24} className="text-gray-400 mx-auto" />
                      <p className="text-xs text-gray-500 mt-1">{img.caption}</p>
                    </div>
                  </div>
                )}
                {img.caption && <p className="text-xs text-gray-500 mt-1 truncate">{img.caption}</p>}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
