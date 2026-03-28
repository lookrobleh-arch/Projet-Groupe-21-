import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

const LOGO_URL = 'https://public.readdy.ai/ai/img_res/4a9ad0c1-5b27-4ad7-a2c5-8ce8bbd51100.png';

const HERO_IMAGE = 'https://readdy.ai/api/search-image?query=abstract%20luxury%20dark%20fintech%20background%20glowing%20cyan%20indigo%20geometric%20shapes%20network%20nodes%20digital%20data%20flow%20patterns%20deep%20navy%20gradient%20bokeh%20light%20particles%20minimal%20modern%20professional&width=800&height=1000&seq=login-clean-bg-v3&orientation=portrait';

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { tab?: string } | null;
    if (state?.tab === 'register') {
      setTab('register');
    }
  }, [location.state]);

  const handleSuccess = (role: string) => {
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/app/dashboard');
    }
  };

  const handleAdminSuccess = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Clean Image Only */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="DepenseEasy Finance Platform"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Very subtle overlay to slightly darken edges */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/20" />
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white px-6 py-10 lg:px-16 xl:px-24 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 self-start w-full max-w-md">
          <Link to="/" className="flex items-center gap-3 cursor-pointer group">
            <img src={LOGO_URL} alt="DepenseEasy" className="w-10 h-10 rounded-full object-cover" />
            <span className="font-bold text-xl text-slate-900 group-hover:text-indigo-600 transition-colors">DepenseEasy</span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              {tab === 'login' ? 'Bon retour !' : 'Créer un compte'}
            </h2>
            <p className="text-gray-500 text-sm">
              {tab === 'login'
                ? 'Connectez-vous pour accéder à votre espace financier.'
                : 'Rejoignez 15 000+ utilisateurs qui maîtrisent leurs finances.'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            {[
              { key: 'login', label: 'Connexion' },
              { key: 'register', label: 'Inscription' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as 'login' | 'register')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  tab === t.key
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Form */}
          {tab === 'login' ? (
            <LoginForm onSuccess={handleSuccess} onAdminSuccess={handleAdminSuccess} onSwitchToRegister={() => setTab('register')} />
          ) : (
            <RegisterForm onSuccess={handleSuccess} onSwitchToLogin={() => setTab('login')} />
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs font-medium">ou continuer avec</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social logins */}
          <SocialButtons onSuccess={handleSuccess} />

          {/* Back to landing */}
          <p className="text-center text-gray-400 text-xs mt-8">
            <Link to="/" className="hover:text-indigo-600 transition-colors underline underline-offset-2 cursor-pointer">
              ← Retour à l&apos;accueil
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function SocialButtons({ onSuccess }: { onSuccess: () => void }) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleSocial = (provider: string) => {
    setLoadingProvider(provider);
    setTimeout(() => {
      setLoadingProvider(null);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        { icon: 'ri-google-fill', label: 'Google', provider: 'google', hoverBorder: 'hover:border-red-400', hoverText: 'hover:text-red-600' },
        { icon: 'ri-github-fill', label: 'GitHub', provider: 'github', hoverBorder: 'hover:border-slate-700', hoverText: 'hover:text-slate-900' },
      ].map((s) => (
        <button
          key={s.label}
          onClick={() => handleSocial(s.provider)}
          disabled={loadingProvider !== null}
          className={`flex items-center justify-center gap-2.5 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 ${s.hoverBorder} ${s.hoverText} hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap disabled:opacity-60`}
        >
          <div className="w-5 h-5 flex items-center justify-center">
            {loadingProvider === s.provider ? (
              <i className="ri-loader-4-line animate-spin text-base" />
            ) : (
              <i className={`${s.icon} text-base`} />
            )}
          </div>
          {loadingProvider === s.provider ? 'Connexion...' : s.label}
        </button>
      ))}
    </div>
  );
}
