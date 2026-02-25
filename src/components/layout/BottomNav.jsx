import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard, Briefcase, ScanBarcode, Users, Receipt, FileText, Settings
} from 'lucide-react';

const employeeTabs = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'nav.dashboard' },
  { to: '/app/jobs', icon: Briefcase, label: 'nav.jobs' },
  { to: '/app/scan', icon: ScanBarcode, label: 'nav.scan' },
  { to: '/app/customers', icon: Users, label: 'nav.customers' },
  { to: '/app/invoices', icon: Receipt, label: 'nav.invoices' },
];

const customerTabs = [
  { to: '/customer/dashboard', icon: LayoutDashboard, label: 'nav.dashboard' },
  { to: '/customer/visits', icon: Briefcase, label: 'nav.visits' },
  { to: '/customer/reports', icon: FileText, label: 'nav.reports' },
  { to: '/customer/invoices', icon: Receipt, label: 'nav.invoices' },
  { to: '/customer/settings', icon: Settings, label: 'nav.settings' },
];

export default function BottomNav() {
  const { t } = useTranslation();
  const { isCustomer } = useAuth();
  const tabs = isCustomer ? customerTabs : employeeTabs;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 flex justify-around items-center h-16 px-1">
      {tabs.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-2 min-w-[56px] rounded-lg text-xs transition-colors ${
              isActive ? 'text-teal-700' : 'text-gray-500'
            }`
          }
        >
          <Icon size={20} />
          <span className="mt-0.5 truncate max-w-[64px]">{t(label)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
