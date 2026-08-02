import React from 'react';
import { 
  UploadCloud, 
  ArrowRight, 
  Database, 
  Shield, 
  Globe, 
  Activity, 
  FileText, 
  MoreVertical,
  LockKeyhole,
  Lock
} from 'lucide-react';
import { motion } from 'motion/react';
import { UploadedBlob } from '../types';
import { formatBytes } from '../utils';
import seedioLogo from '../assets/images/seedio_logo_1783833492145.jpg';

interface OverviewViewProps {
  onShowUploadModal: () => void;
  onNavigate: (view: 'overview' | 'files' | 'shared' | 'vault' | 'staking') => void;
  recentFiles: UploadedBlob[];
  onDownloadFile: (item: UploadedBlob) => void;
  downloadingFileId: string | null;
  onConnectWallet: () => void;
  connected: boolean;
}

export default function OverviewView({
  onShowUploadModal,
  onNavigate,
  recentFiles,
  onDownloadFile,
  downloadingFileId,
  onConnectWallet,
  connected
}: OverviewViewProps) {
  return (
    <div className="space-y-12">
      {/* TWO COLUMN MASTER SPLIT - IMAGE 1 MATCHING */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: HERO + ACCENTS + CAPACITY WIDGET (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* Neon Logo & Text Segment */}
          <div className="space-y-6">
            {/* Glowing Logo Block */}
            <div className="relative w-20 h-20 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-center p-3 shadow-[0_0_25px_rgba(34,211,238,0.2)] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#22d3ee0e_1px,transparent_1px)] bg-[size:8px_8px] pointer-events-none" />
              <img src={seedioLogo} alt="Seedio Logo" className="w-full h-full object-contain rounded-xl" />
              <div className="absolute inset-0 rounded-2xl border border-cyan-400/40 animate-pulse pointer-events-none" />
            </div>

            <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.12]">
              Your Data, <br />
              Cryptographically <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent font-extrabold shadow-sm drop-shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                Permanent.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-lg">
              Decentralized storage that scales with your ambition. Securely shard and distribute your digital assets across a permanent cryptographic network.
            </p>
          </div>

          {/* Action Buttons */}
          {connected && (
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={onShowUploadModal}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm flex items-center gap-2 hover:from-cyan-400 hover:to-blue-500 hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] active:scale-[0.98] transition-all duration-300"
              >
                <UploadCloud className="w-5 h-5" />
                <span>Start Storing</span>
              </button>
              <button 
                onClick={() => onNavigate('files')}
                className="px-6 py-3.5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 text-slate-300 hover:text-white font-bold text-sm flex items-center gap-1.5 transition-all"
              >
                <span>Explore Vault</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          )}

          {/* Two Small Grid Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            
            {/* Storage Capacity Widget */}
            <div className="rounded-2xl bg-slate-900/30 border border-slate-800/80 p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest">Global Storage Capacity</h4>
                  <p className="text-2xl font-extrabold text-white mt-0.5 font-mono">4.2 PB</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: '68%' }} />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500 font-medium">
                  <span>68% ALLOCATED</span>
                  <span className="text-cyan-400 font-semibold">+12.4% this week</span>
                </div>
              </div>
            </div>

            {/* Zero Knowledge Widget */}
            <div className="rounded-2xl bg-slate-900/30 border border-slate-800/80 p-5 flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-200">Zero Knowledge</h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  End-to-end encrypted shards distributed across 4,000+ nodes globally.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: RECENT FILES + CTA (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Recent Files Panel */}
          {connected && (
            <div className="rounded-2xl bg-slate-900/30 border border-slate-800/80 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Recent Files</h3>
                <button 
                  onClick={() => onNavigate('files')}
                  className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 font-mono tracking-wider uppercase"
                >
                  VIEW ALL
                </button>
              </div>

              <div className="space-y-3">
                {recentFiles.slice(0, 3).map((file) => (
                  <div 
                    key={file.blobCommitment}
                    className="p-3.5 rounded-xl border border-slate-800/60 bg-slate-950/20 hover:bg-slate-950/40 flex items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0">
                        <FileText className="w-4.5 h-4.5 text-cyan-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-200 truncate">{file.blobName}</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {formatBytes(file.size)} • {new Date(file.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] uppercase font-mono tracking-wider font-bold px-1.5 py-0.5 rounded border border-cyan-500/20 bg-cyan-500/5 text-cyan-400">
                        {file.type || 'encrypted'}
                      </span>
                      <button 
                        onClick={() => onDownloadFile(file)}
                        className="text-slate-500 hover:text-slate-300 p-1"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Box matching Image 1 */}
          <div className="rounded-2xl bg-black border border-slate-800/80 p-6 space-y-4 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
            <h3 className="text-lg font-bold text-white tracking-tight">Ready to Secure Your Legacy?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Join thousands of builders and organizations securing their data on Shelby. Permanent storage is only a click away.
            </p>
            <div className="flex gap-3 pt-1">
              {!connected && (
                <button 
                  onClick={onConnectWallet}
                  className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold rounded-xl transition-all"
                >
                  Connect Wallet
                </button>
              )}
              <a 
                href="https://docs.shelby.xyz" 
                target="_blank" 
                rel="noreferrer"
                className="px-4 py-2 border border-slate-800 hover:bg-slate-900 text-slate-300 text-xs font-bold rounded-xl flex items-center justify-center transition-all"
              >
                Read the Docs
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* ADDITIONAL CONTENT: ECOSYSTEM ACCENTS */}
      <div className="rounded-2xl bg-slate-900/20 border border-slate-800/60 p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold tracking-tight text-white">
            Built for the next era of data sovereignty.
          </h3>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                <Shield className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">Zero-Knowledge Privacy</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  We never see your files. Encryption happens locally before they even leave your device.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                <Globe className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">10,000+ Distributed Nodes</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Your data is fragmented and stored across a global mesh network, making it censorship-resistant.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic uptime badge container */}
        <div className="flex justify-center md:justify-end">
          <div className="relative w-64 h-64 rounded-2xl bg-gradient-to-tr from-slate-950 to-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center overflow-hidden rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="absolute inset-0 bg-[radial-gradient(#22d3ee08_1.5px,transparent_1.5px)] bg-[size:16px_16px]" />
            <div className="text-center space-y-2 z-10">
              <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto animate-pulse">
                <Activity className="w-7 h-7" />
              </div>
              <p className="text-3xl font-extrabold font-mono text-cyan-400 tracking-tight pt-2">99.9%</p>
              <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold">Network Uptime</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
