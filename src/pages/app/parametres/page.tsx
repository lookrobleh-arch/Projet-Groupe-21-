import { useState, useEffect } from 'react';
import { useApp } from '../../../store/AppContext';
import { CURRENCY_INFO } from '../../../store/AppContext';

export default function ParametresPage() {
  const { currentUser, updateProfile, updatePassword, userSettings, saveUserSettings } = useApp();
  const [tab, setTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [profile, setProfile] = useState({
    name: currentUser?.name ?? '',
    email: currentUser?.email ?? '',
    phone: userSettings?.phone ?? '',
    language: userSettings?.language ?? 'fr',
    currency: userSettings?.currency ?? 'EUR',
  });
  const [notifications, setNotifications] = useState(userSettings?.notifications ?? {
    budgetAlerts: true, paymentReminders: true, aiInsights: true,
    weeklyReport: true, securityAlerts: true, newsletter: false,
  });
  const [passwords, setPasswords] = useState({ current: '', newPwd: '', confirm: '' });
  const [saved, setSaved] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSaved, setPwdSaved] = useState(false);

  useEffect(() => {
    if (userSettings) {
      setProfile(prev => ({
        ...prev,
        phone: userSettings.phone ?? '',
        language: userSettings.language ?? 'fr',
        currency: userSettings.currency ?? 'EUR',
      }));
      setNotifications(userSettings.notifications);
    }
  }, [userSettings]);

  const handleSaveProfile = () => {
    updateProfile({ name: profile.name, email: profile.email });
    if (userSettings) {
      saveUserSettings({ ...userSettings, phone: profile.phone, language: profile.language, currency: profile.currency });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSaveNotifications = () => {
    if (userSettings) {
      saveUserSettings({ ...userSettings, notifications });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSavePassword = () => {
    setPwdError('');
    if (!passwords.current || !passwords.newPwd || !passwords.confirm) { setPwdError('Tous les champs sont requis.'); return; }
    if (passwords.newPwd !== passwords.confirm) { setPwdError('Les mots de passe ne correspondent pas.'); return; }
    if (passwords.newPwd.length < 6) { setPwdError('Le mot de passe doit faire au moins 6 caractères.'); return; }
    updatePassword(passwords.newPwd);
    setPasswords({ current: '', newPwd: '', confirm: '' });
    setPwdSaved(true);
    setTimeout(() => setPwdSaved(false), 2500);
  };

  const initials = currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
  const selectedCurrencyInfo = CURRENCY_INFO[profile.currency] ?? CURRENCY_INFO.EUR;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900">Paramètres</h2>
        <p className="text-sm text-gray-400">Gérez votre compte et vos préférences</p>
      </div>

      <div className="flex bg-gray-100 rounded-xl p-1 w-full">
        {([
          { key: 'profile', label: 'Profil', icon: 'ri-user-line' },
          { key: 'security', label: 'Sécurité', icon: 'ri-shield-line' },
          { key: 'notifications', label: 'Notifications', icon: 'ri-notification-3-line' },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${tab === t.key ? 'bg-white text-slate-900' : 'text-gray-500 hover:text-gray-700'}`}>
            <div className="w-4 h-4 flex items-center justify-center"><i className={`${t.icon} text-sm`} /></div>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl font-black">{initials}</span>
            </div>
            <div>
              <p className="font-bold text-slate-900">{currentUser?.name ?? 'Utilisateur'}</p>
              <p className="text-sm text-gray-400">{currentUser?.email ?? ''}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nom complet</label>
              <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</label>
              <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Téléphone</label>
              <input type="tel" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} placeholder="+33 6 00 00 00 00" className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Langue</label>
              <select value={profile.language} onChange={e => setProfile({...profile, language: e.target.value})} className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 cursor-pointer bg-white">
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Currency Section */}
          <div className="border-t border-gray-100 pt-4">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-3">Devise monétaire</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(CURRENCY_INFO).map(([code, info]) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setProfile({...profile, currency: code})}
                  className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all text-left ${profile.currency === code ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <span className={`text-lg font-black ${profile.currency === code ? 'text-indigo-600' : 'text-gray-500'}`}>{info.symbol}</span>
                  <div>
                    <p className={`text-xs font-bold ${profile.currency === code ? 'text-indigo-700' : 'text-slate-700'}`}>{code}</p>
                    <p className="text-[10px] text-gray-400 leading-tight">{info.label.split('(')[0].trim()}</p>
                  </div>
                </button>
              ))}
            </div>
            {profile.currency !== 'EUR' && (
              <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-xs text-amber-700">
                <i className="ri-exchange-line mr-1" />
                Taux appliqué : 1 EUR = {selectedCurrencyInfo.rate.toLocaleString('fr', { minimumFractionDigits: 2 })} {selectedCurrencyInfo.symbol} (taux indicatif)
              </div>
            )}
          </div>

          {saved && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 text-xs text-emerald-700 flex items-center gap-2">
              <i className="ri-check-line" />
              Modifications enregistrées avec succès. Les montants seront affichés en <strong>{selectedCurrencyInfo.label}</strong> dans toute la plateforme.
            </div>
          )}

          <button onClick={handleSaveProfile} className={`w-full py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${saved ? 'bg-emerald-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
            {saved ? '✓ Modifications enregistrées' : 'Enregistrer les modifications'}
          </button>
        </div>
      )}

      {tab === 'security' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="font-semibold text-slate-900 mb-4">Changer le mot de passe</p>
            {pwdError && <p className="text-red-500 text-xs mb-3 bg-red-50 px-3 py-2 rounded-lg">{pwdError}</p>}
            {pwdSaved && <p className="text-emerald-600 text-xs mb-3 bg-emerald-50 px-3 py-2 rounded-lg">✓ Mot de passe mis à jour avec succès !</p>}
            <div className="space-y-3">
              {[
                { label: 'Mot de passe actuel', key: 'current' as const },
                { label: 'Nouveau mot de passe', key: 'newPwd' as const },
                { label: 'Confirmer le nouveau mot de passe', key: 'confirm' as const },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{f.label}</label>
                  <input type="password" value={passwords[f.key]} onChange={e => setPasswords({...passwords, [f.key]: e.target.value})} placeholder="••••••••" className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
                </div>
              ))}
            </div>
            <button onClick={handleSavePassword} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg cursor-pointer whitespace-nowrap transition-colors">Mettre à jour</button>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-xl p-5">
            <p className="font-semibold text-red-600 mb-1">Zone de danger</p>
            <p className="text-xs text-gray-500 mb-3">La suppression de votre compte est irréversible. Toutes vos données seront effacées.</p>
            <button className="text-sm font-semibold text-red-500 hover:text-red-600 cursor-pointer whitespace-nowrap">Supprimer mon compte →</button>
          </div>
        </div>
      )}

      {tab === 'notifications' && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="font-semibold text-slate-900 mb-4">Préférences de notifications</p>
          <div className="space-y-4">
            {([
              { key: 'budgetAlerts' as const, label: 'Alertes budgets', desc: 'Notifié quand un budget dépasse 80%' },
              { key: 'paymentReminders' as const, label: 'Rappels prélèvements', desc: 'Abonnements à venir dans les 7 jours' },
              { key: 'aiInsights' as const, label: 'Recommandations IA', desc: 'Conseils personnalisés de l\'assistant IA' },
              { key: 'weeklyReport' as const, label: 'Rapport hebdomadaire', desc: 'Résumé de votre semaine financière' },
              { key: 'securityAlerts' as const, label: 'Alertes sécurité', desc: 'Connexions et modifications du compte' },
              { key: 'newsletter' as const, label: 'Newsletter produit', desc: 'Nouveautés DepenseEasy' },
            ]).map(n => (
              <div key={n.key} className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{n.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.desc}</p>
                </div>
                <button onClick={() => setNotifications(prev => ({...prev, [n.key]: !prev[n.key]}))}
                  className={`w-11 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 relative ${notifications[n.key] ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                  <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all" style={{ left: notifications[n.key] ? '22px' : '2px' }} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={handleSaveNotifications} className={`mt-6 w-full py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${saved ? 'bg-emerald-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
            {saved ? '✓ Enregistré' : 'Sauvegarder les préférences'}
          </button>
        </div>
      )}
    </div>
  );
}
