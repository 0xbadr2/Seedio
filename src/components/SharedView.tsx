import React from 'react';
import { FileText, Plus } from 'lucide-react';

interface SharedViewProps {
  onCopyShareLink: (link: string) => void;
  onRevokeAccess: (name: string) => void;
  onNavigateToFiles: () => void;
}

export default function SharedView({
  onCopyShareLink,
  onRevokeAccess,
  onNavigateToFiles
}: SharedViewProps) {
  return (
    <div className="space-y-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-white">Active Share Channels</h3>
          <p className="text-sm text-slate-400">
            Manage file availability, decentralized access links, and encryption key delegation.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'whitepaper_v3.pdf', size: '12.4 MB', state: 'Active', downloads: 14, date: 'Oct 24, 2023' },
              { name: 'seedio_presentation.key', size: '12.8 MB', state: 'Active', downloads: 8, date: 'Oct 20, 2023' },
            ].map((sharedItem) => (
              <div key={sharedItem.name} className="p-4 rounded-xl border border-slate-800 bg-slate-950/20 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-100">{sharedItem.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{sharedItem.size} • {sharedItem.date}</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-mono px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 uppercase font-bold">
                    {sharedItem.state}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-900">
                  <span>Consensus Downloads:</span>
                  <span className="text-slate-100 font-bold">{sharedItem.downloads} hits</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button 
                    onClick={() => onCopyShareLink(`https://seedio.xyz/shard/${sharedItem.name}`)}
                    className="py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg font-bold text-slate-300"
                  >
                    Copy link
                  </button>
                  <button 
                    onClick={() => onRevokeAccess(sharedItem.name)}
                    className="py-1.5 bg-rose-950/10 hover:bg-rose-950/20 border border-rose-900/30 rounded-lg font-bold text-rose-400"
                  >
                    Revoke access
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 text-center space-y-2">
            <p className="text-xs font-bold text-slate-300">Generate a Public Shared Channel</p>
            <p className="text-[11px] text-slate-500 max-w-md mx-auto">
              Select a private asset from your vault to publish. A temporary access ticket is signed on-chain and shared via peer-to-peer gateways.
            </p>
            <button 
              onClick={onNavigateToFiles}
              className="mt-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 text-[11px] font-bold rounded-lg hover:brightness-110"
            >
              Select File
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
