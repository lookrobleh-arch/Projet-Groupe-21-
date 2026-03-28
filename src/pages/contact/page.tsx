import { useState } from 'react';
import LandingNav from '../home/components/LandingNav';
import Footer from '../home/components/Footer';

const FORM_URL = 'https://readdy.ai/api/form/d70i31v9hgr6oot2qvf0';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.message.length > 500) return;
    setLoading(true);
    try {
      const body = new URLSearchParams(form as Record<string, string>);
      await fetch(FORM_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
      setSubmitted(true);
    } catch { /* silent */ }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <LandingNav />
      <div className="pt-24 pb-20">
        {/* Hero */}
        <div className="max-w-4xl mx-auto px-6 text-center mb-16">
          <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">Contact</span>
          <h1 className="text-5xl font-black text-slate-900 mb-4">Parlons ensemble</h1>
          <p className="text-lg text-gray-500">Notre équipe est disponible pour répondre à toutes vos questions.</p>
        </div>

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6">
            {[
              { icon: 'ri-mail-line', title: 'Email', val: 'support@depenseeasy.fr', color: 'bg-indigo-50 text-indigo-600' },
              { icon: 'ri-phone-line', title: 'Téléphone', val: '+33 1 23 45 67 89', color: 'bg-cyan-50 text-cyan-600' },
              { icon: 'ri-time-line', title: 'Horaires', val: 'Lun–Ven : 9h–18h', color: 'bg-emerald-50 text-emerald-600' },
              { icon: 'ri-map-pin-line', title: 'Adresse', val: '12 rue de la Finance, Paris 75001', color: 'bg-amber-50 text-amber-600' },
            ].map(c => (
              <div key={c.title} className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl">
                <div className={`w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0 ${c.color}`}><i className={`${c.icon} text-lg`} /></div>
                <div><p className="font-semibold text-slate-900 text-sm">{c.title}</p><p className="text-gray-500 text-sm mt-0.5">{c.val}</p></div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-64 text-center gap-4">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 text-3xl"><i className="ri-check-line" /></div>
                <p className="text-xl font-bold text-slate-900">Message envoyé !</p>
                <p className="text-gray-500 text-sm">Nous vous répondrons dans les 24h.</p>
              </div>
            ) : (
              <form data-readdy-form id="contact-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nom</label>
                    <input name="name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full mt-1.5 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400" placeholder="Jean Dupont" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</label>
                    <input type="email" name="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full mt-1.5 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400" placeholder="vous@email.fr" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sujet</label>
                  <input name="subject" required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full mt-1.5 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400" placeholder="Votre sujet" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Message</label>
                  <textarea name="message" required maxLength={500} rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full mt-1.5 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 resize-none" placeholder="Votre message..." />
                  <p className="text-right text-xs text-gray-400 mt-1">{form.message.length}/500</p>
                </div>
                <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold rounded-xl text-sm cursor-pointer whitespace-nowrap disabled:opacity-70 flex items-center justify-center gap-2">
                  {loading ? <><i className="ri-loader-4-line animate-spin" />Envoi...</> : <><i className="ri-send-plane-2-line" />Envoyer le message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
