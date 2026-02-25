import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard, Briefcase, ScanBarcode, QrCode,
  Users, UserCog, FileText, Receipt, Settings, X
} from 'lucide-react';

const employeeLinks = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'nav.dashboard' },
  { to: '/app/jobs', icon: Briefcase, label: 'nav.jobs' },
  { to: '/app/scan', icon: ScanBarcode, label: 'nav.scan' },
  { to: '/app/barcodes', icon: QrCode, label: 'nav.barcodes' },
  { to: '/app/customers', icon: Users, label: 'nav.customers' },
  { to: '/app/reports', icon: FileText, label: 'nav.reports' },
  { to: '/app/invoices', icon: Receipt, label: 'nav.invoices' },
];

const adminOnlyLinks = [
  { to: '/app/employees', icon: UserCog, label: 'nav.employees' },
  { to: '/app/settings', icon: Settings, label: 'nav.settings' },
];

const customerLinks = [
  { to: '/customer/dashboard', icon: LayoutDashboard, label: 'nav.dashboard' },
  { to: '/customer/visits', icon: Briefcase, label: 'nav.visits' },
  { to: '/customer/reports', icon: FileText, label: 'nav.reports' },
  { to: '/customer/invoices', icon: Receipt, label: 'nav.invoices' },
  { to: '/customer/settings', icon: Settings, label: 'nav.settings' },
];

const BASE = import.meta.env.BASE_URL;

export default function Sidebar({ open, onClose }) {
  const { t } = useTranslation();
  const { isAdmin, isCustomer } = useAuth();

  const links = isCustomer
    ? customerLinks
    : [...employeeLinks, ...(isAdmin ? adminOnlyLinks : [])];

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-teal-50 text-teal-700'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`;

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside className={`fixed top-0 h-full w-64 bg-white border-e border-gray-200 z-50 transition-transform duration-200
        ${open ? 'translate-x-0 rtl:translate-x-0' : '-translate-x-full rtl:translate-x-full'}
        lg:translate-x-0 lg:rtl:translate-x-0 lg:static lg:z-auto`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={`${BASE}logo.png`} alt="" className="w-10 h-10 object-contain" />
            <div>
              <h2 className="text-sm font-bold text-teal-700 leading-tight">{t('app.name')}</h2>
              <p className="text-[10px] text-gray-500">{t('app.tagline')}</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        <nav className="p-3 flex flex-col gap-1 overflow-y-auto h-[calc(100%-73px)]">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={linkClasses} onClick={onClose}>
              <Icon size={20} />
              <span>{t(label)}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
