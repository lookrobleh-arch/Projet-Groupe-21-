import { useState, useEffect, useCallback } from 'react';

interface DemoModalProps {
  onClose: () => void;
}

const slides = [
  {
    img: 'https://readdy.ai/api/search-image?query=modern%20dark%20financial%20dashboard%20interface%20with%20charts%20graphs%20expense%20tracking%20analytics%20indigo%20cyan%20colors%20on%20dark%20navy%20background%20clean%20minimal%20UI%20design%20with%20data%20visualizations%20and%20KPI%20cards&width=1280&height=720&seq=demo1&orientation=landscape',
    tag: 'Dashboard',
    tagColor: 'from-indigo-500 to-cyan-500',
    title: 'Tableau de Bord Intelligent',
    subtitle: 'Visualisez vos finances en un coup d\'œil avec des graphiques interactifs',
  },
  {
    img: 'https://readdy.ai/api/search-image?query=AI%20artificial%20intelligence%20financial%20assistant%20chat%20interface%20on%20dark%20background%20with%20smart%20recommendations%20and%20insights%20modern%20UI%20with%20glowing%20indigo%20purple%20gradient%20elements&width=1280&height=720&seq=demo2&orientation=landscape',
    tag: 'Assistant IA',
    tagColor: 'from-violet-500 to-purple-600',
    title: 'Assistant IA Financier',
    subtitle: 'Des conseils personnalisés basés sur vos habitudes de dépense',
  },
  {
    img: 'https://readdy.ai/api/search-image?query=OCR%20receipt%20scanning%20technology%20interface%20dark%20background%20with%20camera%20overlay%20text%20recognition%20on%20paper%20receipt%20clean%20modern%20mobile%20app%20design%20with%20cyan%20blue%20scanning%20animation%20effect&width=1280&height=720&seq=demo3&orientation=landscape',
    tag: 'OCR Scan',
    tagColor: 'from-cyan-500 to-sky-600',
    title: 'Scan OCR Ultra-Rapide',
    subtitle: 'Capturez et catégorisez vos dépenses en moins de 2 minutes',
  },
  {
    img: 'https://readdy.ai/api/search-image?query=budget%20management%20interface%20dark%20themed%20with%20colorful%20progress%20bars%20category%20breakdown%20pie%20charts%20spending%20limits%20tracker%20modern%20fintech%20app%20design%20indigo%20emerald%20colors&width=1280&height=720&seq=demo4&orientation=landscape',
    tag: 'Budgets',
    tagColor: 'from-emerald-500 to-teal-600',
    title: 'Budgets Dynamiques',
    subtitle: 'Gérez vos budgets par catégorie avec des alertes intelligentes',
  },
  {
    img: 'https://readdy.ai/api/search-image?query=financial%20forecasting%20cashflow%20prediction%20charts%20dark%20interface%20with%20future%20trend%20lines%20predictive%20analytics%20timeline%20projection%20modern%20fintech%20dark%20navy%20background%20with%20glowing%20lines&width=1280&height=720&seq=demo5&orientation=landscape',
    tag: 'Prévisions',
    tagColor: 'from-amber-500 to-orange-600',
    title: 'Prévisions Cashflow',
    subtitle: 'Anticipez vos besoins financiers pour les 3 prochains mois',
  },
  {
    img: 'https://readdy.ai/api/search-image?query=financial%20health%20score%20dashboard%20dark%20background%20with%20circular%20gauge%20score%20indicator%20green%20amber%20colors%20detailed%20breakdown%20categories%20modern%20fintech%20UI%20with%20clean%20typography%20and%20data%20cards&width=1280&height=720&seq=demo6&orientation=landscape',
    tag: 'Score Santé',
    tagColor: 'from-rose-500 to-pink-600',
    title: 'Score Santé Financière',
    subtitle: 'Mesurez et améliorez votre santé financière globale chaque mois',
  },
];

export default function DemoModal({ onClose }: DemoModalProps) {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [progress, setProgress] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
    setProgress(0);
  }, []);

  const prev = () => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { next(); return 0; }
        return p + (100 / (3500 / 50));
      });
    }, 50);
    return () => clearInterval(interval);
  }, [autoplay, next]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-8 pb-4 px-4 overflow-y-auto">
      <div className="w-full max-w-5xl bg-gray-950 rounded-3xl border border-gray-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <img src="https://public.readdy.ai/ai/img_res/4a9ad0c1-5b27-4ad7-a2c5-8ce8bbd51100.png" alt="Logo" className="w-8 h-8 rounded-full" />
            <span className="text-white font-bold text-xl">Démo Interactive</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoplay(!autoplay)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-white cursor-pointer transition-colors"
            >
              <i className={autoplay ? 'ri-pause-line' : 'ri-play-line'} />
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-white cursor-pointer transition-colors"
            >
              <i className="ri-close-line text-xl" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="px-8 pt-6">
          <div className="relative aspect-video rounded-2xl overflow-hidden">
            <img
              src={slides[current].img}
              alt={slides[current].title}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

            {/* Tag */}
            <div className="absolute top-4 left-4">
              <span className={`bg-gradient-to-r ${slides[current].tagColor} text-white text-xs font-semibold px-4 py-2 rounded-full`}>
                {slides[current].tag}
              </span>
            </div>

            {/* Caption */}
            <div className="absolute bottom-6 left-6 right-20">
              <h3 className="text-white text-2xl font-bold mb-2">{slides[current].title}</h3>
              <p className="text-white/70 text-sm">{slides[current].subtitle}</p>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white cursor-pointer transition-all"
            >
              <i className="ri-arrow-left-s-line text-2xl" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white cursor-pointer transition-all"
            >
              <i className="ri-arrow-right-s-line text-2xl" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mx-8 mt-4 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-none rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Thumbnails */}
        <div className="flex gap-3 px-8 py-5 overflow-x-auto">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setProgress(0); }}
              className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                i === current ? 'border-cyan-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="px-8 pb-8">
          <a
            href="/login"
            className="block w-full py-4 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-center font-bold text-lg rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
          >
            Commencer à s&apos;inscrire — C&apos;est gratuit
          </a>
        </div>
      </div>
    </div>
  );
}
