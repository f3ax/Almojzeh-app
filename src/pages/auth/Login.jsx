import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Globe } from 'lucide-react';

const BASE = import.meta.env.BASE_URL;

export default function Login() {
  const { t, i18n } = useTranslation();
  const { user, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) {
    return <Navigate to={user.role === 'customer' ? '/customer/dashboard' : '/app/dashboard'} replace />;
  }

  const toggleLang = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    localStorage.setItem('almojzeh_lang', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = login(username, password);
    if (!result) setError(t('login.error'));
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gradient-to-b from-teal-900 via-teal-800 to-slate-900 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <img
            src={`${BASE}logo.png`}
            alt="المعجزة لمكافحة الحشرات"
            className="w-28 h-28 mx-auto mb-4 object-contain drop-shadow-lg"
          />
          <h1 className="text-2xl font-bold text-white">{t('app.name')}</h1>
          <p className="text-teal-200 text-sm mt-1">{t('login.welcome')}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur rounded-2xl shadow-xl border border-white/20 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('login.username')}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('login.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-teal-700 text-white py-3 rounded-xl text-base font-medium hover:bg-teal-800 transition-colors shadow-sm">
            {t('login.submit')}
          </button>
        </form>

        <div className="text-center mt-4">
          <button onClick={toggleLang} className="text-sm text-teal-200 hover:text-white inline-flex items-center gap-1 transition-colors">
            <Globe size={14} />
            {i18n.language === 'ar' ? 'English' : 'العربية'}
          </button>
        </div>
      </div>
    </div>
  );
}
