import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/shared/Card';
import * as db from '../../services/db';
import { FileText, Download } from 'lucide-react';

export default function Reports() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [reportType, setReportType] = useState('daily');
  const [customerId, setCustomerId] = useState('');
  const [siteId, setSiteId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const customers = db.getCustomers();
  const customerSites = customerId ? db.getSitesByCustomerId(customerId) : [];

  const generatePdf = async () => {
    const { default: jsPDF } = await import('jspdf');
    await import('jspdf-autotable');

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(18);
    doc.text(isAr ? 'المعجزة لمكافحة الحشرات' : 'Al-Mojza Pest Control', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(reportType === 'daily' ? t('reports.daily') : t('reports.monthly'), pageWidth / 2, 30, { align: 'center' });

    let jobs = db.getJobs().filter(j => j.status === 'completed');
    if (customerId) jobs = jobs.filter(j => j.customerId === customerId);
    if (siteId) jobs = jobs.filter(j => j.siteId === siteId);
    if (dateFrom) jobs = jobs.filter(j => j.completedAt >= dateFrom);
    if (dateTo) jobs = jobs.filter(j => j.completedAt <= dateTo);

    jobs.sort((a, b) => a.completedAt.localeCompare(b.completedAt));

    const tableData = jobs.map(j => {
      const site = db.getSiteById(j.siteId);
      const customer = db.getCustomerById(j.customerId);
      const emp = db.getUserById(j.employeeId);
      const checklist = db.getChecklistByJobId(j.id);
      const checkedCount = checklist ? checklist.items.filter(i => i.checked).length : 0;
      const totalItems = checklist ? checklist.items.length : 0;
      return [
        j.completedAt,
        site?.name || '-',
        customer?.contactName || '-',
        emp?.name || '-',
        t(`jobs.${j.type === 'follow-up' ? 'followUp' : j.type}`),
        `${checkedCount}/${totalItems}`,
      ];
    });

    doc.autoTable({
      startY: 40,
      head: [['Date', 'Site', 'Customer', 'Technician', 'Type', 'Checklist']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [13, 148, 136] },
      styles: { fontSize: 9, cellPadding: 3 },
    });

    const totalInvoices = db.getInvoices().filter(inv => {
      if (customerId && inv.customerId !== customerId) return false;
      return true;
    });
    const paidTotal = totalInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
    const pendingTotal = totalInvoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.amount, 0);

    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(10);
    doc.text(`Total Jobs: ${jobs.length}`, 14, finalY);
    doc.text(`Total Paid: ${paidTotal} JOD`, 14, finalY + 7);
    doc.text(`Total Pending: ${pendingTotal} JOD`, 14, finalY + 14);

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, doc.internal.pageSize.getHeight() - 10);

    doc.save(`report-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">{t('reports.title')}</h2>

      <Card>
        <div className="space-y-4">
          <div className="flex gap-3">
            <button onClick={() => setReportType('daily')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${reportType === 'daily' ? 'bg-teal-700 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {t('reports.daily')}
            </button>
            <button onClick={() => setReportType('monthly')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${reportType === 'monthly' ? 'bg-teal-700 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {t('reports.monthly')}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('reports.customer')}</label>
            <select value={customerId} onChange={e => { setCustomerId(e.target.value); setSiteId(''); }}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl">
              <option value="">{t('jobs.all')}</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.contactName} {c.companyName ? `(${c.companyName})` : ''}</option>)}
            </select>
          </div>

          {customerId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('reports.site')}</label>
              <select value={siteId} onChange={e => setSiteId(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl">
                <option value="">{t('jobs.all')}</option>
                {customerSites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('reports.from')}</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('reports.to')}</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl" />
            </div>
          </div>

          <button onClick={generatePdf} className="w-full bg-teal-700 text-white py-3 rounded-xl font-medium hover:bg-teal-800 transition-colors inline-flex items-center justify-center gap-2">
            <Download size={18} /> {t('reports.generate')}
          </button>
        </div>
      </Card>
    </div>
  );
}
