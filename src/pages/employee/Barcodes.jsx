import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/shared/Card';
import * as db from '../../services/db';
import JsBarcode from 'jsbarcode';
import { Printer, Plus } from 'lucide-react';
import Modal from '../../components/shared/Modal';

function BarcodeImage({ value }) {
  const svgRef = useRef(null);
  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format: 'CODE128',
          width: 2,
          height: 60,
          displayValue: true,
          fontSize: 14,
          margin: 10,
        });
      } catch {}
    }
  }, [value]);
  return <svg ref={svgRef} />;
}

export default function Barcodes() {
  const { t } = useTranslation();
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ customerId: '', name: '', address: '', type: 'commercial' });
  const [refresh, setRefresh] = useState(0);

  const sites = useMemo(() => db.getSites(), [refresh]);
  const customers = db.getCustomers();

  const handleCreate = (e) => {
    e.preventDefault();
    db.createSite(form);
    setShowNew(false);
    setForm({ customerId: '', name: '', address: '', type: 'commercial' });
    setRefresh(r => r + 1);
  };

  const handlePrint = (site) => {
    const printWindow = window.open('', '_blank', 'width=400,height=300');
    const svg = document.getElementById(`barcode-${site.id}`);
    if (svg && printWindow) {
      printWindow.document.write(`
        <html><head><title>${site.name}</title></head>
        <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif">
          <h3>${site.name}</h3>
          <p style="color:#666">${site.address}</p>
          ${svg.outerHTML}
          <script>window.print();</script>
        </body></html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">{t('barcodes.title')}</h2>
        <button onClick={() => setShowNew(true)} className="bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-800 transition-colors inline-flex items-center gap-1">
          <Plus size={18} /> {t('customers.addSite')}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sites.map(site => {
          const customer = db.getCustomerById(site.customerId);
          return (
            <Card key={site.id}>
              <div className="text-center">
                <p className="font-semibold text-gray-800">{site.name}</p>
                <p className="text-xs text-gray-500 mb-2">{customer?.contactName} - {site.address}</p>
                <div className="flex justify-center" id={`barcode-${site.id}`}>
                  <BarcodeImage value={site.barcode} />
                </div>
                <button onClick={() => handlePrint(site)} className="mt-3 text-sm text-teal-700 hover:underline inline-flex items-center gap-1">
                  <Printer size={14} /> {t('barcodes.print')}
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal open={showNew} onClose={() => setShowNew(false)} title={t('customers.addSite')}>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('jobs.customer')}</label>
            <select value={form.customerId} onChange={e => setForm(f => ({ ...f, customerId: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl" required>
              <option value="">--</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.contactName} {c.companyName ? `(${c.companyName})` : ''}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('customers.name')}</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('customers.address')}</label>
            <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl" required />
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
