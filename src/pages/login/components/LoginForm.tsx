import { useState } from 'react';
import { useApp } from '../../../store/AppContext';

interface LoginFormProps {
  onSuccess: (role: string) => void;
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Veuillez remplir tous les champs.'); return; }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      onSuccess(result.role);
    } else {
      setError(result.error ?? 'Erreur de connexion.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <i className="ri-error-warning-line text-red-500 flex-shrink-0" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Adresse email</label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400">
            <i className="ri-mail-line text-base" />
          </div>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@exemple.fr" required
            className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm text-slate-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-slate-700">Mot de passe</label>
        </div>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400">
            <i className="ri-lock-line text-base" />
          </div>
          <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
            className="w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-xl text-sm text-slate-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all" />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-slate-600 transition-colors cursor-pointer">
            <i className={showPassword ? 'ri-eye-off-line text-base' : 'ri-eye-line text-base'} />
          </button>
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer group">
        <div onClick={() => setRememberMe(!rememberMe)}
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${rememberMe ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 group-hover:border-indigo-400'}`}>
          {rememberMe && <i className="ri-check-line text-white text-xs" />}
        </div>
        <span className="text-sm text-gray-600">Se souvenir de moi</span>
      </label>

      <button type="submit" disabled={loading}
        className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2">
        {loading ? (<><i className="ri-loader-4-line animate-spin" />Connexion...</>) : (<>Se connecter<i className="ri-arrow-right-line" /></>)}
      </button>

      <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 border border-indigo-100 rounded-xl px-4 py-3">
        <p className="text-xs text-indigo-700 font-medium mb-1.5">
          <i className="ri-information-line mr-1" />
          Accès démo disponible
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={() => { setEmail('demo@depenseeasy.fr'); setPassword('Demo1234!'); }}
            className="text-xs bg-white border border-indigo-200 rounded-lg px-3 py-1.5 text-indigo-600 font-medium hover:bg-indigo-50 transition-colors cursor-pointer whitespace-nowrap">
            Utilisateur démo
          </button>
          <button type="button" onClick={() => { setEmail('admin@depenseeasy.fr'); setPassword('Admin1234!'); }}
            className="text-xs bg-white border border-indigo-200 rounded-lg px-3 py-1.5 text-indigo-600 font-medium hover:bg-indigo-50 transition-colors cursor-pointer whitespace-nowrap">
            Admin démo
          </button>
        </div>
      </div>
    </form>
  );
}
