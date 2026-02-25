import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/shared/Card';
import * as db from '../../services/db';
import { Camera, CameraOff, CheckSquare, MapPin, History, AlertTriangle, ImagePlus, X } from 'lucide-react';

const CHECKLIST_KEYS = ['perimeter', 'kitchen', 'bathroom', 'storage', 'gelBait', 'traps', 'spray', 'safety', 'customerInformed'];

export default function Scan() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [foundSite, setFoundSite] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [checkItems, setCheckItems] = useState([]);
  const [saved, setSaved] = useState(false);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  const lookupBarcode = useCallback((code) => {
    const site = db.getSiteByBarcode(code.trim());
    if (site) {
      setFoundSite(site);
      setNotFound(false);
      setCheckItems(CHECKLIST_KEYS.map((key, i) => ({ id: `scan_${i}`, key, checked: false, notes: '', image: null })));
      setSaved(false);
    } else {
      setFoundSite(null);
      setNotFound(true);
    }
  }, []);

  const startScanner = async () => {
    setScanning(true);
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const scanner = new Html5Qrcode('scanner-region');
      html5QrCodeRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (text) => {
          lookupBarcode(text);
          scanner.stop().catch(() => {});
          setScanning(false);
        },
        () => {}
      );
    } catch {
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try { await html5QrCodeRef.current.stop(); } catch {}
    }
    setScanning(false);
  };

  useEffect(() => { return () => { stopScanner(); }; }, []);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) lookupBarcode(manualCode);
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

  const handleSaveChecklist = () => {
    const job = db.createJob({
      siteId: foundSite.id,
      customerId: foundSite.customerId,
      employeeId: user.id,
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: new Date().toTimeString().slice(0, 5),
      type: 'inspection',
      status: 'completed',
      completedAt: new Date().toISOString().split('T')[0],
      notes: '',
    });
    db.createChecklist({
      jobId: job.id,
      siteId: foundSite.id,
      completedBy: user.id,
      items: checkItems,
    });
    setSaved(true);
  };

  const customer = foundSite ? db.getCustomerById(foundSite.customerId) : null;
  const pastJobs = foundSite ? db.getJobsBySiteId(foundSite.id).filter(j => j.status === 'completed').slice(-3) : [];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">{t('scan.title')}</h2>

      <Card>
        <div className="space-y-4">
          <div id="scanner-region" ref={scannerRef} className={`rounded-lg overflow-hidden ${scanning ? 'min-h-[240px]' : 'hidden'}`} />

          <div className="flex gap-2">
            {!scanning ? (
              <button onClick={startScanner} className="flex-1 bg-teal-700 text-white py-3 rounded-xl font-medium hover:bg-teal-800 transition-colors inline-flex items-center justify-center gap-2">
                <Camera size={20} /> {t('scan.openCamera')}
              </button>
            ) : (
              <button onClick={stopScanner} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors inline-flex items-center justify-center gap-2">
                <CameraOff size={20} /> {t('scan.stopCamera')}
              </button>
            )}
          </div>

          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={e => setManualCode(e.target.value)}
              placeholder="ALM-S001"
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button type="submit" className="bg-gray-800 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-900 transition-colors">
              {t('common.search')}
            </button>
          </form>
        </div>
      </Card>

      {notFound && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="text-red-500" size={20} />
          <p className="text-red-700 text-sm">{t('scan.siteNotFound')}</p>
        </div>
      )}

      {foundSite && (
        <>
          <Card title={t('scan.siteFound')}>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-lg text-gray-800">{foundSite.name}</p>
              <p className="flex items-center gap-2 text-gray-500"><MapPin size={16} /> {foundSite.address}</p>
              <p className="text-gray-600">{customer?.contactName} {customer?.companyName ? `(${customer.companyName})` : ''}</p>
              <p className="text-xs text-gray-400">{t('barcodes.code')}: {foundSite.barcode}</p>
            </div>

            {pastJobs.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-2"><History size={14} /> {t('dashboard.recentActivity')}</p>
                {pastJobs.map(j => (
                  <p key={j.id} className="text-xs text-gray-500 py-1">{j.completedAt} - {t(`jobs.${j.type === 'follow-up' ? 'followUp' : j.type}`)}</p>
                ))}
              </div>
            )}
          </Card>

          <Card title={t('checklist.title')} action={
            !saved && (
              <button onClick={handleSaveChecklist} className="text-sm bg-teal-700 text-white px-3 py-1.5 rounded-lg hover:bg-teal-800 transition-colors">
                {t('checklist.submit')}
              </button>
            )
          }>
            {saved ? (
              <div className="text-center py-6">
                <CheckSquare className="text-green-500 mx-auto mb-2" size={32} />
                <p className="text-green-700 font-medium">{t('checklist.submitted')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {checkItems.map((item, idx) => (
                  <div key={item.id} className="p-2.5 rounded-lg hover:bg-gray-50 border border-gray-100">
                    <div className="flex items-start gap-3">
                      <button onClick={() => toggleItem(idx)} className={`mt-0.5 w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${item.checked ? 'bg-teal-600 border-teal-600 text-white' : 'border-gray-300'}`}>
                        {item.checked && <CheckSquare size={14} />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{t(`checklist.items.${item.key}`)}</p>
                        <input type="text" value={item.notes} onChange={e => setItemNote(idx, e.target.value)}
                          placeholder={t('checklist.notes')} className="mt-1 w-full text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500" />
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
            )}
          </Card>
        </>
      )}
    </div>
  );
}
