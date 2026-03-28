import { useState } from 'react';
import { useApp } from '../../../store/AppContext';

interface RegisterFormProps {
  onSuccess: (role: string) => void;
  onSwitchToLogin: () => void;
}

type Strength = 'weak' | 'medium' | 'strong' | null;
function getStrength(pwd: string): Strength {
  if (!pwd) return null;
  const s = [/[A-Z]/.test(pwd), /[a-z]/.test(pwd), /\d/.test(pwd), /[!@#$%^&*]/.test(pwd), pwd.length >= 8].filter(Boolean).length;
  if (s <= 2) return 'weak';
  if (s <= 3) return 'medium';
  return 'strong';
}
const strengthConfig = {
  weak: { label: 'Faible', color: 'bg-red-500', width: 'w-1/3' },
  medium: { label: 'Moyen', color: 'bg-amber-500', width: 'w-2/3' },
  strong: { label: 'Fort', color: 'bg-emerald-500', width: 'w-full' },
};

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const strength = getStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) { setError('Veuillez remplir tous les champs.'); return; }
    if (!agree) { setError('Veuillez accepter les conditions d\'utilisation.'); return; }
    if (strength === 'weak') { setError('Votre mot de passe est trop faible.'); return; }
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) {
      onSuccess('user');
    } else {
      setError(result.error ?? 'Erreur lors de la création du compte.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <i className="ri-error-warning-line text-red-500 flex-shrink-0" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Nom complet</label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400"><i className="ri-user-line text-base" /></div>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jean Dupont" required
            className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm text-slate-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Adresse email</label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400"><i className="ri-mail-line text-base" /></div>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@exemple.fr" required
            className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm text-slate-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Mot de passe</label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400"><i className="ri-lock-line text-base" /></div>
          <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
            className="w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-xl text-sm text-slate-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all" />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-slate-600 transition-colors cursor-pointer">
            <i className={showPassword ? 'ri-eye-off-line text-base' : 'ri-eye-line text-base'} />
          </button>
        </div>
        {strength && (
          <div className="mt-2">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-500">Force</span>
              <span className={`text-xs font-semibold ${strength === 'strong' ? 'text-emerald-600' : strength === 'medium' ? 'text-amber-600' : 'text-red-600'}`}>{strengthConfig[strength].label}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-300 ${strengthConfig[strength].color} ${strengthConfig[strength].width}`} />
            </div>
          </div>
        )}
      </div>

      <label className="flex items-start gap-3 cursor-pointer group">
        <div onClick={() => setAgree(!agree)}
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all cursor-pointer ${agree ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 group-hover:border-indigo-400'}`}>
          {agree && <i className="ri-check-line text-white text-xs" />}
        </div>
        <span className="text-sm text-gray-600 leading-relaxed">
          J&apos;accepte les <a href="#" className="text-indigo-600 hover:underline font-medium">conditions d&apos;utilisation</a> et la <a href="#" className="text-indigo-600 hover:underline font-medium">politique de confidentialité</a>
        </span>
      </label>

      <button type="submit" disabled={loading}
        className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2">
        {loading ? (<><i className="ri-loader-4-line animate-spin" />Création du compte...</>) : (<>Créer mon compte gratuit<i className="ri-arrow-right-line" /></>)}
      </button>
    </form>
  );
}
