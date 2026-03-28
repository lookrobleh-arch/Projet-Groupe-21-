export default function AdminSante() {
  const services = [
    { name: 'API Gateway', status: 'up', uptime: '99.9%', latency: '42ms', icon: 'ri-server-line' },
    { name: 'Auth Service', status: 'up', uptime: '99.8%', latency: '18ms', icon: 'ri-shield-check-line' },
    { name: 'Base de données', status: 'up', uptime: '99.9%', latency: '8ms', icon: 'ri-database-2-line' },
    { name: 'Stockage fichiers', status: 'up', uptime: '99.7%', latency: '120ms', icon: 'ri-folder-cloud-line' },
    { name: 'Service IA', status: 'up', uptime: '99.5%', latency: '250ms', icon: 'ri-robot-2-line' },
    { name: 'OCR Engine', status: 'up', uptime: '98.9%', latency: '380ms', icon: 'ri-scan-2-line' },
    { name: 'Notifications', status: 'up', uptime: '99.6%', latency: '55ms', icon: 'ri-notification-3-line' },
  ];

  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-black text-slate-900">Santé Plateforme</h2><p className="text-sm text-gray-400">État des services en temps réel</p></div>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
        <p className="font-semibold text-emerald-800 text-sm">Tous les services opérationnels</p>
        <span className="text-xs text-emerald-600 ml-auto">{new Date().toLocaleString('fr-FR')}</span>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {services.map(s => (
          <div key={s.name} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 flex-shrink-0"><i className={`${s.icon} text-lg`} /></div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-slate-900 text-sm">{s.name}</p>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full">ACTIF</span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center"><p className="font-bold text-slate-900">{s.uptime}</p><p className="text-xs text-gray-400">Uptime</p></div>
              <div className="text-center"><p className="font-bold text-slate-900">{s.latency}</p><p className="text-xs text-gray-400">Latence</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
