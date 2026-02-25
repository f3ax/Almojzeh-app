import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/shared/Card';
import * as db from '../../services/db';
import { Download, FileText } from 'lucide-react';

export default function CustomerReports() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isAr = i18n.language === 'ar';

  const customer = useMemo(() => db.getCustomerByUserId(user?.id), [user]);
  const completedJobs = useMemo(() => {
    if (!customer) return [];
    return db.getJobsByCustomerId(customer.id).filter(j => j.status === 'completed').sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  }, [customer]);

  const downloadReport = async (job) => {
    const { default: jsPDF } = await import('jspdf');
    await import('jspdf-autotable');

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const site = db.getSiteById(job.siteId);
    const emp = db.getUserById(job.employeeId);
    const checklist = db.getChecklistByJobId(job.id);

    doc.setFontSize(18);
    doc.text(isAr ? 'المعجزة لمكافحة الحشرات' : 'Al-Mojza Pest Control', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(t('reports.daily'), pageWidth / 2, 30, { align: 'center' });

    doc.setFontSize(10);
    const info = [
      ['Date', job.completedAt],
      ['Site', site?.name || '-'],
      ['Address', site?.address || '-'],
      ['Technician', emp?.name || '-'],
      ['Type', job.type],
    ];
    doc.autoTable({ startY: 40, body: info, theme: 'plain', styles: { fontSize: 10 } });

    if (checklist) {
      const checkData = checklist.items.map(item => [
        t(`checklist.items.${item.key}`),
        item.checked ? 'Yes' : 'No',
        item.notes || '-',
      ]);
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Item', 'Done', 'Notes']],
        body: checkData,
        theme: 'grid',
        headStyles: { fillColor: [13, 148, 136] },
        styles: { fontSize: 9 },
      });
    }

    doc.save(`visit-report-${job.completedAt}.pdf`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">{t('reports.title')}</h2>

      {completedJobs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">{t('reports.noReports')}</div>
      ) : (
        <div className="space-y-3">
          {completedJobs.map(job => {
            const site = db.getSiteById(job.siteId);
            return (
              <div key={job.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{site?.name}</p>
                    <p className="text-xs text-gray-500">{job.completedAt} · {t(`jobs.${job.type === 'follow-up' ? 'followUp' : job.type}`)}</p>
                  </div>
                </div>
                <button onClick={() => downloadReport(job)} className="p-2 rounded-lg text-teal-700 hover:bg-teal-50 transition-colors">
                  <Download size={18} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
