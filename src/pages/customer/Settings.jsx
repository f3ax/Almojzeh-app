import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/shared/Card';
import { User } from 'lucide-react';

export default function CustomerSettings() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const toggleLang = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    localStorage.setItem('almojzeh_lang', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">{t('settings.title')}</h2>

      <Card title={t('settings.profile')}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
            <User size={24} />
          </div>
          <div>
            <p className="font-semibold text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email || user?.phone}</p>
          </div>
        </div>
      </Card>

      <Card title={t('settings.language')}>
        <div className="flex gap-3">
          <button onClick={() => { if (i18n.language !== 'ar') toggleLang(); }}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${i18n.language === 'ar' ? 'bg-teal-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {t('settings.arabic')}
          </button>
          <button onClick={() => { if (i18n.language !== 'en') toggleLang(); }}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${i18n.language === 'en' ? 'bg-teal-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {t('settings.english')}
          </button>
        </div>
      </Card>
    </div>
  );
}
