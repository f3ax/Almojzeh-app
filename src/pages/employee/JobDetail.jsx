import { useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/shared/Card';
import StatusBadge from '../../components/shared/StatusBadge';
import * as db from '../../services/db';
import { ArrowRight, ArrowLeft, Calendar, Clock, MapPin, User, CheckSquare, Camera, Plus, Trash2, ImagePlus, X } from 'lucide-react';

const CHECKLIST_KEYS = ['perimeter', 'kitchen', 'bathroom', 'storage', 'gelBait', 'traps', 'spray', 'safety', 'customerInformed'];

export default function JobDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const Arrow = i18n.language === 'ar' ? ArrowRight : ArrowLeft;
  const [refresh, setRefresh] = useState(0);
  const jobImageInputRef = useRef(null);

  const job = useMemo(() => db.getJobById(id), [id, refresh]);
  const site = useMemo(() => job ? db.getSiteById(job.siteId) : null, [job]);
  const customer = useMemo(() => job ? db.getCustomerById(job.customerId) : null, [job]);
  const emp = useMemo(() => job ? db.getUserById(job.employeeId) : null, [job]);
  const checklist = useMemo(() => job ? db.getChecklistByJobId(job.id) : null, [job, refresh]);
  const images = useMemo(() => job ? db.getImagesByJobId(job.id) : [], [job, refresh]);

  const [checkItems, setCheckItems] = useState(() => {
    if (checklist) return checklist.items;
    return CHECKLIST_KEYS.map((key, i) => ({ id: `new_${i}`, key, checked: false, notes: '', image: null }));
  });

  if (!job) return <div className="text-center py-12 text-gray-500">{t('jobs.noJobs')}</div>;

  const handleStatusChange = (status) => {
    const update = { status };
    if (status === 'completed') update.completedAt = new Date().toISOString().split('T')[0];
    db.updateJob(id, update);
    setRefresh(r => r + 1);
  };

  const handleSaveChecklist = () => {
    if (checklist) {
      db.updateChecklist(checklist.id, { items: checkItems });
    } else {
      db.createChecklist({ jobId: job.id, siteId: job.siteId, completedBy: user.id, items: checkItems });
    }
    setRefresh(r => r + 1);
  };

  const toggleItem = (idx) => {
    setCheckItems(prev => prev.map((item, i) => i === idx ? { ...item, checked: !item.checked } : item));
  };

  const setItemNote = (idx, notes) => {
    setCheckItems(prev => prev.map((item, i) => i === idx ? { ...item, notes } : item));
  };

  const handleChecklistItemImage = async (idx, file) => {
    if (!file) return;
    const dataUrl = await db.fileToBase64(file);
    setCheckItems(prev => prev.map((item, i) => i === idx ? { ...item, image: dataUrl } : item));
  };

  const removeChecklistItemImage = (idx) => {
    setCheckItems(prev => prev.map((item, i) => i === idx ? { ...item, image: null } : item));
  };

  const handleJobImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      const dataUrl = await db.fileToBase64(file);
      db.createImage({ jobId: job.id, uploadedBy: user.id, dataUrl, caption: file.name });
    }
    setRefresh(r => r + 1);
    if (jobImageInputRef.current) jobImageInputRef.current.value = '';
  };

  const handleDeleteImage = (imgId) => {
    db.deleteImage(imgId);
    setRefresh(r => r + 1);
  };

  return (
    <div className="space-y-4">
      <button onClick={() => navigate('/app/jobs')} className="text-teal-700 text-sm inline-flex items-center gap-1 hover:underline">
        <Arrow size={16} /> {t('jobs.title')}
      </button>

      <div className="flex items-start justify-between">
        <h2 className="text-xl font-bold text-gray-800">{t('jobs.details')}</h2>
        <StatusBadge status={job.status} />
      </div>

      <Card>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p className="flex items-center gap-2"><MapPin size={16} className="text-gray-400" /> <span className="font-medium">{site?.name}</span></p>
            <p className="text-gray-500 ps-6">{site?.address}</p>
            <p className="flex items-center gap-2"><User size={16} className="text-gray-400" /> {customer?.contactName} {customer?.companyName ? `(${customer.companyName})` : ''}</p>
          </div>
          <div className="space-y-2">
            <p className="flex items-center gap-2"><Calendar size={16} className="text-gray-400" /> {job.scheduledDate}</p>
            <p className="flex items-center gap-2"><Clock size={16} className="text-gray-400" /> {job.scheduledTime}</p>
            <p className="flex items-center gap-2"><User size={16} className="text-gray-400" /> {emp?.name}</p>
          </div>
        </div>
        {job.notes && <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{job.notes}</p>}

        {job.status !== 'completed' && job.status !== 'cancelled' && (
          <div className="flex gap-2 mt-4">
            {job.status === 'scheduled' && (
              <button onClick={() => handleStatusChange('in-progress')} className="bg-yellow-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-yellow-600 transition-colors">
                {t('jobs.inProgress')}
              </button>
            )}
            <button onClick={() => handleStatusChange('completed')} className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors">
              {t('jobs.completed')}
            </button>
            <button onClick={() => handleStatusChange('cancelled')} className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-200 transition-colors">
              {t('jobs.cancelled')}
            </button>
          </div>
        )}
      </Card>

      <Card title={t('checklist.title')} action={
        <button onClick={handleSaveChecklist} className="text-sm bg-teal-700 text-white px-3 py-1.5 rounded-lg hover:bg-teal-800 transition-colors">
          {t('checklist.submit')}
        </button>
      }>
        <div className="space-y-3">
          {checkItems.map((item, idx) => (
            <div key={item.id || idx} className="p-2.5 rounded-lg hover:bg-gray-50 border border-gray-100">
              <div className="flex items-start gap-3">
                <button onClick={() => toggleItem(idx)} className={`mt-0.5 w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${item.checked ? 'bg-teal-600 border-teal-600 text-white' : 'border-gray-300'}`}>
                  {item.checked && <CheckSquare size={14} />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{t(`checklist.items.${item.key}`)}</p>
                  <input
                    type="text"
                    value={item.notes}
                    onChange={(e) => setItemNote(idx, e.target.value)}
                    placeholder={t('checklist.notes')}
                    className="mt-1 w-full text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  <div className="mt-2 flex items-center gap-2">
                    {item.image ? (
                      <div className="relative inline-block">
                        <img src={item.image} alt="" className="h-16 w-16 object-cover rounded-lg border border-gray-200" />
                        <button onClick={() => removeChecklistItemImage(idx)}
                          className="absolute -top-1.5 -right-1.5 rtl:-left-1.5 rtl:right-auto w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <label className="inline-flex items-center gap-1 text-xs text-teal-700 hover:text-teal-800 cursor-pointer py-1 px-2 rounded-lg border border-dashed border-teal-300 hover:border-teal-500 transition-colors">
                        <ImagePlus size={14} />
                        <span>{t('common.images')}</span>
                        <input type="file" accept="image/*" capture="environment" className="hidden"
                          onChange={(e) => handleChecklistItemImage(idx, e.target.files?.[0])} />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card
        title={t('common.images')}
        action={
          <label className="inline-flex items-center gap-1 text-sm bg-teal-700 text-white px-3 py-1.5 rounded-lg hover:bg-teal-800 transition-colors cursor-pointer">
            <Plus size={16} />
            <span>{t('common.add')}</span>
            <input ref={jobImageInputRef} type="file" accept="image/*" multiple capture="environment" className="hidden"
              onChange={handleJobImageUpload} />
          </label>
        }
      >
        {images.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Camera size={32} className="mx-auto mb-2" />
            <p className="text-sm">{t('common.noData')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map(img => (
              <div key={img.id} className="relative group">
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
                <button onClick={() => handleDeleteImage(img.id)}
                  className="absolute top-1.5 right-1.5 rtl:left-1.5 rtl:right-auto w-7 h-7 bg-red-500/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                  <Trash2 size={14} />
                </button>
                {img.caption && <p className="text-xs text-gray-500 mt-1 truncate">{img.caption}</p>}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
