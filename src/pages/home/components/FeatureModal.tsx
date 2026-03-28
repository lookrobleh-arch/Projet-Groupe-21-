interface FeatureModalProps {
  feature: {
    icon: string;
    gradient: string;
    iconBg: string;
    title: string;
    badge: string;
    badgeColor: string;
    description: string;
    keyFigure: string;
    keyFigureLabel: string;
    intro: string;
    points: { icon: string; color: string; title: string; detail: string }[];
  };
  onClose: () => void;
}

export default function FeatureModal({ feature, onClose }: FeatureModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 py-8 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <div className="flex items-center gap-5">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.iconBg} flex items-center justify-center`}>
              <i className={`${feature.icon} text-white text-3xl`} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900">{feature.title}</h2>
              <span className={`inline-block mt-2 bg-gradient-to-r ${feature.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                {feature.badge}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
          >
            <i className="ri-close-line text-xl text-gray-600" />
          </button>
        </div>

        {/* Key Figure Banner */}
        <div className={`bg-gradient-to-r ${feature.gradient} py-12 px-8 text-center`}>
          <p className="text-7xl font-black text-white mb-3">{feature.keyFigure}</p>
          <p className="text-white/80 text-base uppercase tracking-widest font-semibold mb-6">{feature.keyFigureLabel}</p>
          <p className="text-white/90 text-lg max-w-2xl mx-auto leading-relaxed">{feature.intro}</p>
        </div>

        {/* Points forts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
          {feature.points.map((p) => (
            <div key={p.title} className="flex gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center flex-shrink-0`}>
                <i className={`${p.icon} text-white text-xl`} />
              </div>
              <div>
                <p className="font-bold text-slate-900 mb-1">{p.title}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{p.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 p-8 border-t border-gray-100">
          <a
            href="/login"
            className={`flex-1 py-4 bg-gradient-to-r ${feature.gradient} text-white text-center font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer`}
          >
            Commencer maintenant
          </a>
          <button
            onClick={onClose}
            className="px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
