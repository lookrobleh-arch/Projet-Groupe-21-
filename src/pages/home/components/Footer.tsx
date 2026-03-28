import { useState } from 'react';
import { Link } from 'react-router-dom';

const FORM_URL = 'https://readdy.ai/api/form/d70i31v9hgr6oot2qvf0';

const footerLinks: Record<string, { label: string; to: string }[]> = {
  PRODUIT: [
    { label: 'Fonctionnalités', to: '/#features' },
    { label: 'Sécurité', to: '/securite' },
    { label: 'À propos', to: '/apropos' },
    { label: 'Contact', to: '/contact' },
  ],
  RESSOURCES: [
    { label: 'Blog', to: '/contact' },
    { label: 'Guides', to: '/contact' },
    { label: 'Documentation', to: '/contact' },
    { label: 'Support', to: '/contact' },
  ],
  LÉGAL: [
    { label: 'Confidentialité', to: '/securite' },
    { label: 'CGU', to: '/apropos' },
    { label: 'Mentions légales', to: '/apropos' },
    { label: 'RGPD', to: '/securite' },
    { label: 'Cookies', to: '/securite' },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const body = new URLSearchParams({ email });
      await fetch(FORM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      setSubmitted(true);
      setEmail('');
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-slate-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand + Newsletter */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <img
                src="https://public.readdy.ai/ai/img_res/4a9ad0c1-5b27-4ad7-a2c5-8ce8bbd51100.png"
                alt="DepenseEasy"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-white font-bold text-xl">DepenseEasy</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm mb-8">
              Votre plateforme intelligente pour maîtriser vos finances personnelles et atteindre vos objectifs.
            </p>

            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">NEWSLETTER</p>
            {submitted ? (
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                <i className="ri-check-circle-line text-lg" />
                Merci pour votre inscription !
              </div>
            ) : (
              <form
                data-readdy-form
                id="newsletter-footer"
                onSubmit={handleSubmit}
                className="flex gap-2"
              >
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.fr"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-xl flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-all flex-shrink-0"
                >
                  {loading ? (
                    <i className="ri-loader-4-line animate-spin" />
                  ) : (
                    <i className="ri-send-plane-fill text-base" />
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="lg:col-span-2">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">{category}</h4>
              <ul className="flex flex-col gap-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-gray-400 text-sm hover:text-cyan-400 transition-colors cursor-pointer">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 DepenseEasy. Tous droits réservés. Fait avec{' '}
            <span className="text-rose-500">♥</span> en France.
          </p>
          <div className="flex items-center gap-3">
            {[
              { icon: 'ri-twitter-x-line', href: '#' },
              { icon: 'ri-linkedin-box-fill', href: '#' },
              { icon: 'ri-instagram-line', href: '#' },
              { icon: 'ri-youtube-fill', href: '#' },
            ].map((s) => (
              <a
                key={s.icon}
                href={s.href}
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <i className={`${s.icon} text-base`} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
