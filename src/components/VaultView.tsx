import React from 'react';
import { LockKeyhole, Shield, LockKeyholeOpen } from 'lucide-react';

interface VaultViewProps {
  isVaultUnlocked: boolean;
  setIsVaultUnlocked: (unlocked: boolean) => void;
  vaultPassword: string;
  setVaultPassword: (pwd: string) => void;
  onUnlockSubmit: (e: React.FormEvent) => void;
}

export default function VaultView({
  isVaultUnlocked,
  setIsVaultUnlocked,
  vaultPassword,
  setVaultPassword,
  onUnlockSubmit
}: VaultViewProps) {
  return (
    <div className="space-y-8">
      <div className="max-w-md mx-auto space-y-6">
        
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <LockKeyhole className="w-6 h-6 text-cyan-400" />
            <span>Military Vault Gate</span>
          </h3>
          <p className="text-sm text-slate-400">Unlock your deeply protected, client-encrypted seed folders.</p>
        </div>

        {!isVaultUnlocked ? (
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto">
              <Shield className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-300">Input security passkey pattern</p>
              <p className="text-[10px] text-slate-500">Passkeys never touch centralized servers. Restored locally.</p>
            </div>

            <form onSubmit={onUnlockSubmit} className="space-y-3 pt-2">
              <input 
                type="password"
                value={vaultPassword}
                onChange={(e) => setVaultPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-center tracking-widest py-3 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-slate-700 font-mono text-sm text-cyan-400"
              />
              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-xs rounded-xl"
              >
                Authenticate Local Key
              </button>
            </form>
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2">
                <LockKeyholeOpen className="w-4.5 h-4.5 text-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-emerald-400 font-mono uppercase tracking-widest">Key Ring Active</span>
              </div>
              <button 
                onClick={() => {
                  setIsVaultUnlocked(false);
                  setVaultPassword('');
                }}
                className="text-[10px] font-bold text-slate-400 hover:text-slate-200"
              >
                Lock Vault
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">Decrypt Key Stores:</p>
              <div className="space-y-3">
                {[
                  { title: 'Work Docs Key Store', slots: '42 records', desc: 'AES-256 GCM Key' },
                  { title: 'Identity Key Store', slots: '3 records', desc: 'RSA-4096 Pair' },
                  { title: 'Memories Key Store', slots: '128 records', desc: 'Chacha20 Key' },
                ].map((store) => (
                  <div key={store.title} className="p-3.5 rounded-xl border border-slate-800/60 bg-slate-950/40 flex items-center justify-between font-mono text-xs">
                    <div>
                      <p className="font-bold text-slate-200">{store.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{store.slots} • {store.desc}</p>
                    </div>
                    <button 
                      onClick={() => alert('Cryptographic keys copied to workspace clipboard.')}
                      className="text-[10px] text-cyan-400 font-bold hover:underline"
                    >
                      Export
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
