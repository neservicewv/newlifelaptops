'use client';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, RefreshCw, ExternalLink, Key, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const [ebayStatus, setEbayStatus]     = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);

  const loadStatus = () => {
    setStatusLoading(true);
    fetch('/api/ebay/status').then(r=>r.json()).then(d=>{setEbayStatus(d);setStatusLoading(false);})
      .catch(()=>setStatusLoading(false));
  };
  useEffect(loadStatus,[]);

  const connectEbay = async () => {
    const r = await fetch('/api/ebay/auth');
    const d = await r.json();
    if (d.url) window.location.href = d.url;
  };

  const disconnect = async () => {
    if (!confirm('Disconnect eBay account?')) return;
    await fetch('/api/ebay/status',{method:'DELETE'});
    loadStatus();
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-black text-[#e6f1ff] font-mono uppercase tracking-wide mb-2">Settings</h1>
      <p className="text-[#8892b0] text-sm mb-8">Configure integrations and preferences</p>

      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[rgba(0,168,255,0.1)] border border-[rgba(0,168,255,0.2)] flex items-center justify-center">
            <Key size={16} className="text-[#00a8ff]"/>
          </div>
          <div>
            <h2 className="text-[#e6f1ff] font-bold">eBay Integration</h2>
            <p className="text-[#8892b0] text-xs">Connect your eBay seller account to sync orders automatically</p>
          </div>
        </div>

        {statusLoading ? (
          <div className="flex items-center gap-2 text-[#8892b0] text-sm py-4">
            <RefreshCw size={14} className="animate-spin"/> Checking connection...
          </div>
        ) : ebayStatus?.connected ? (
          <div>
            <div className="flex items-center gap-2 text-green-400 text-sm mb-3">
              <CheckCircle size={15}/> Connected as <strong>{ebayStatus.username}</strong>
            </div>
            <div className="text-[#8892b0] text-xs mb-4">
              Token expires: {ebayStatus.expiresAt?new Date(ebayStatus.expiresAt).toLocaleString():'Unknown'}
            </div>
            <button onClick={disconnect} className="btn-secondary" style={{color:'#f87171',borderColor:'rgba(239,68,68,0.3)'}}>Disconnect eBay</button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-[#8892b0] text-sm mb-4">
              <XCircle size={15} className="text-red-400"/> Not connected
            </div>
            <div className="p-3 rounded-xl bg-orange-900/20 border border-orange-700/30 mb-4">
              <div className="flex gap-2">
                <AlertTriangle size={14} className="text-orange-400 flex-shrink-0 mt-0.5"/>
                <p className="text-orange-300 text-xs">
                  Set <code className="bg-orange-900/40 px-1 rounded">EBAY_CLIENT_ID</code>,{' '}
                  <code className="bg-orange-900/40 px-1 rounded">EBAY_CLIENT_SECRET</code>, and{' '}
                  <code className="bg-orange-900/40 px-1 rounded">EBAY_REDIRECT_URI</code> in <code className="bg-orange-900/40 px-1 rounded">.env.local</code> before connecting.
                </p>
              </div>
            </div>
            <button onClick={connectEbay} className="btn-primary"><ExternalLink size={14}/> Connect eBay Account</button>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="text-[#e6f1ff] font-bold mb-3">Environment Variables</h2>
        <p className="text-[#8892b0] text-xs mb-3">Required in <code className="bg-white/5 px-1 rounded">.env.local</code>:</p>
        <div className="space-y-2">
          {[
            ['EBAY_CLIENT_ID','Your eBay app Client ID'],
            ['EBAY_CLIENT_SECRET','Your eBay app Client Secret'],
            ['EBAY_REDIRECT_URI','OAuth redirect URI (e.g. http://localhost:3000/api/ebay/callback)'],
            ['EBAY_ENV','"sandbox" or "production" (default: sandbox)'],
          ].map(([k,v])=>(
            <div key={k} className="flex items-start gap-3 py-1.5 border-b border-white/5 last:border-0">
              <code className="text-[#00a8ff] text-xs font-mono bg-[rgba(0,168,255,0.08)] px-2 py-0.5 rounded flex-shrink-0">{k}</code>
              <span className="text-[#8892b0] text-xs">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
