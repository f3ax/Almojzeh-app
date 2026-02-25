import { useTranslation } from 'react-i18next';
import { Menu, Globe, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Header({ onMenuToggle }) {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();

  const toggleLang = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    localStorage.setItem('almojzeh_lang', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Menu">
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-bold text-teal-700 hidden sm:block">{t('app.name')}</h1>
        <h1 className="text-lg font-bold text-teal-700 sm:hidden">المعجزة</h1>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 hidden sm:block">{user?.name}</span>
        <button onClick={toggleLang} className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1 text-sm" title={t('settings.language')}>
          <Globe size={18} />
          <span className="hidden sm:inline">{i18n.language === 'ar' ? 'EN' : 'عربي'}</span>
        </button>
        <button onClick={logout} className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title={t('nav.logout')}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
