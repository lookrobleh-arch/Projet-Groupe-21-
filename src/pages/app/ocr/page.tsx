import { useState, useRef, useMemo } from 'react';
import { useApp } from '../../../store/AppContext';

type ScanResult = { label: string; amount: string; date: string; merchant: string; category: string; items: { name: string; price: string }[] };

function simulateScan(fileName: string): ScanResult {
  const name = fileName.toLowerCase();
  if (name.includes('carrefour') || name.includes('lidl') || name.includes('leclerc')) {
    return { label: 'Courses supermarché', amount: (40 + Math.random() * 80).toFixed(2), date: new Date().toISOString().slice(0, 10), merchant: 'CARREFOUR MARKET', category: 'Alimentation', items: [{ name: 'Lait x3', price: '3.45' }, { name: 'Fromage', price: '4.20' }, { name: 'Légumes', price: '8.90' }, { name: 'Viande', price: '7.80' }] };
  }
  if (name.includes('restaurant') || name.includes('brasserie')) {
    return { label: 'Restaurant', amount: (25 + Math.random() * 40).toFixed(2), date: new Date().toISOString().slice(0, 10), merchant: 'LE BISTROT', category: 'Restaurants', items: [{ name: 'Entrée', price: '8.50' }, { name: 'Plat', price: '16.90' }, { name: 'Dessert', price: '7.00' }] };
  }
  const lower = fileName.replace(/\.[^.]+$/, '').toLowerCase();
  const cat = lower.includes('pharma') ? 'Santé' : lower.includes('fnac') ? 'Culture' : lower.includes('amazon') ? 'Shopping' : 'Autres';
  return { label: lower.charAt(0).toUpperCase() + lower.slice(1), amount: (15 + Math.random() * 100).toFixed(2), date: new Date().toISOString().slice(0, 10), merchant: lower.toUpperCase().slice(0, 12), category: cat, items: [{ name: 'Article 1', price: (5 + Math.random() * 20).toFixed(2) }, { name: 'Article 2', price: (3 + Math.random() * 15).toFixed(2) }] };
}

export default function OcrPage() {
  const { addTransaction, accounts, transactions, expenseCategories, categorizeTransaction } = useApp();
  const [phase, setPhase] = useState<'idle' | 'processing' | 'result'>('idle');
  const [dragOver, setDragOver] = useState(false);
  const [editResult, setEditResult] = useState<ScanResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id ?? '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allCats = useMemo(() => [...expenseCategories.map(c => c.name), 'Autres'], [expenseCategories]);

  const processFile = (file: File) => {
    setFileName(file.name);
    setSaved(false);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    } else setPreviewUrl(null);
    setPhase('processing');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => { if (p >= 100) { clearInterval(interval); return 100; } return p + (p < 60 ? 8 : p < 85 ? 4 : 2); });
    }, 120);
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      const scanned = simulateScan(file.name);
      const suggestedCat = categorizeTransaction(scanned.label + ' ' + scanned.merchant);
      const finalCat = allCats.includes(suggestedCat) ? suggestedCat : scanned.category;
      setEditResult({ ...scanned, category: finalCat });
      setPhase('result');
    }, 2800);
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) processFile(f); };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) processFile(f); };
  const reset = () => { setPhase('idle'); setEditResult(null); setPreviewUrl(null); setFileName(''); setSaved(false); setProgress(0); if (fileInputRef.current) fileInputRef.current.value = ''; };

  const updateItem = (i: number, field: 'name' | 'price', val: string) => {
    if (!editResult) return;
    const items = [...editResult.items];
    items[i] = { ...items[i], [field]: val };
    setEditResult({ ...editResult, items });
  };

  const handleValidate = () => {
    if (!editResult || !selectedAccountId) return;
    const amt = parseFloat(editResult.amount);
    if (isNaN(amt) || amt <= 0) return;
    addTransaction({ accountId: selectedAccountId, type: 'expense', amount: amt, category: editResult.category, label: editResult.label, date: editResult.date, status: 'validated', source: 'ocr' });
    setSaved(true);
  };

  const recentOcrTx = useMemo(() => transactions.filter(t => t.source === 'ocr').slice(0, 5), [transactions]);
  const totalScanned = recentOcrTx.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900">Scan de Reçu</h2>
        <p className="text-sm text-gray-400">Scannez n&apos;importe quel ticket — transaction créée automatiquement</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Scans enregistrés', value: `${totalScanned}`, icon: 'ri-scan-2-line', color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Précision OCR', value: '97.3%', icon: 'ri-checkbox-circle-line', color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Total scanné', value: `${recentOcrTx.reduce((s, t) => s + t.amount, 0).toFixed(2)}€`, icon: 'ri-money-euro-circle-line', color: 'bg-cyan-50 text-cyan-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={`w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0 ${s.color}`}><i className={`${s.icon} text-base`} /></div>
            <div><p className="text-base font-black text-slate-900">{s.value}</p><p className="text-xs text-gray-400">{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          {phase === 'idle' && (
            <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
              className={`bg-white rounded-xl border-2 border-dashed p-12 flex flex-col items-center gap-4 transition-colors cursor-pointer ${dragOver ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
              onClick={() => fileInputRef.current?.click()}>
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500"><i className="ri-scan-2-line text-3xl" /></div>
              <div className="text-center">
                <p className="font-bold text-slate-900 mb-1">Glissez votre reçu ici</p>
                <p className="text-sm text-gray-400">ou cliquez pour sélectionner</p>
                <p className="text-xs text-gray-300 mt-1">JPG, PNG, PDF — Max 20MB</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*,application/pdf" onChange={handleFileInput} className="hidden" />
              <div className="flex items-center gap-6 mt-2 text-xs text-gray-400">
                {['Reçus', 'Factures', 'Tickets', 'Relevés'].map(t => <span key={t} className="flex items-center gap-1"><i className="ri-check-line text-emerald-400" />{t}</span>)}
              </div>
            </div>
          )}

          {phase === 'processing' && (
            <div className="bg-white rounded-xl border border-gray-100 p-10 flex flex-col items-center gap-6">
              {previewUrl && <div className="w-full max-h-48 rounded-xl overflow-hidden"><img src={previewUrl} alt="Reçu" className="w-full h-full object-contain" /></div>}
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-indigo-50 relative">
                <i className="ri-scan-2-line text-3xl text-indigo-500" />
                <div className="absolute inset-0 rounded-2xl border-2 border-indigo-400 animate-ping opacity-30" />
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-900 mb-1 text-sm">{fileName}</p>
                <p className="text-gray-400 text-xs">{progress < 40 ? 'Prétraitement...' : progress < 75 ? 'Analyse OCR...' : 'Catégorisation IA...'}</p>
              </div>
              <div className="w-full max-w-xs">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5"><span>Progression</span><span>{Math.round(progress)}%</span></div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          )}

          {phase === 'result' && editResult && (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-emerald-50">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 flex-shrink-0"><i className="ri-checkbox-circle-line text-lg" /></div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 text-sm">{saved ? 'Transaction créée et enregistrée !' : 'Extraction réussie — vérifiez les données'}</p>
                  <p className="text-xs text-gray-500">{saved ? `Déduit de votre compte automatiquement` : 'Corrigez si nécessaire avant de valider'}</p>
                </div>
                <button onClick={reset} className="text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer font-medium whitespace-nowrap">Nouveau scan</button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {([{ label: 'Description', key: 'label' as const }, { label: 'Montant (€)', key: 'amount' as const, type: 'number' }, { label: 'Date', key: 'date' as const, type: 'date' }, { label: 'Marchand', key: 'merchant' as const }]).map(f => (
                    <div key={f.key}>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{f.label}</label>
                      <input type={f.type || 'text'} value={editResult[f.key]} onChange={e => setEditResult({...editResult, [f.key]: e.target.value})} className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Catégorie</label>
                    <select value={editResult.category} onChange={e => setEditResult({...editResult, category: e.target.value})} className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 bg-white">
                      {allCats.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <p className="text-[10px] text-indigo-500 mt-1"><i className="ri-robot-2-line mr-0.5" />Catégorisé automatiquement</p>
                  </div>
                  {accounts.length > 0 && (
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Compte à débiter</label>
                      <select value={selectedAccountId} onChange={e => setSelectedAccountId(e.target.value)} className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 bg-white">
                        {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Articles détectés</p>
                  <div className="space-y-2">
                    {editResult.items.map((item, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input value={item.name} onChange={e => updateItem(i, 'name', e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-400" />
                        <div className="relative flex-shrink-0 w-24">
                          <input value={item.price} onChange={e => updateItem(i, 'price', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-400 pr-6" />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">€</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={reset} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer whitespace-nowrap">Annuler</button>
                  <button onClick={handleValidate} disabled={saved} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-emerald-500 text-white rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors">
                    {saved ? <><i className="ri-check-line mr-1" />Transaction créée</> : 'Valider et créer transaction'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-bold text-slate-900">Scans récents</p>
              <p className="text-xs text-gray-400">{totalScanned} transaction{totalScanned > 1 ? 's' : ''} via OCR</p>
            </div>
            {recentOcrTx.length === 0 ? (
              <div className="py-10 text-center">
                <div className="w-10 h-10 flex items-center justify-center mx-auto text-gray-200"><i className="ri-receipt-line text-3xl" /></div>
                <p className="text-xs text-gray-300 mt-2">Aucun scan enregistré</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentOcrTx.map(t => (
                  <div key={t.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 flex-shrink-0"><i className="ri-receipt-line text-sm" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{t.label}</p>
                      <p className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} · {t.category}</p>
                    </div>
                    <span className="text-sm font-bold text-red-500 whitespace-nowrap">-{t.amount.toFixed(2)}€</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-xl border border-indigo-100 p-4 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 flex-shrink-0"><i className="ri-robot-2-line text-sm" /></div>
              <p className="text-sm font-semibold text-indigo-900">Catégorisation automatique</p>
            </div>
            <p className="text-xs text-indigo-700 leading-relaxed">Le système analyse votre reçu, suggère une catégorie et crée automatiquement la transaction sur le compte sélectionné.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
