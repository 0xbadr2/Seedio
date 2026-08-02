import React, { useRef } from 'react';
import { 
  UploadCloud, 
  Search, 
  List, 
  LayoutGrid, 
  RefreshCw, 
  FileText, 
  Download, 
  Plus, 
  Folder, 
  LockKeyhole, 
  Image, 
  MoreVertical,
  Globe
} from 'lucide-react';
import { UploadedBlob, PinnedVault } from '../types';
import { formatBytes, formatRelativeTime } from '../utils';

interface FilesViewProps {
  displayedBlobs: UploadedBlob[];
  onDownloadFile: (item: UploadedBlob) => void;
  downloadingFileId: string | null;
  onShowUploadModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: 'list' | 'grid';
  setViewMode: (mode: 'list' | 'grid') => void;
  isLoadingBlobs: boolean;
  onRefresh: () => void;
  activeFolderFilter: string | null;
  setActiveFolderFilter: (filter: string | null) => void;
  pinnedVaults: PinnedVault[];
  onTriggerFileInput: () => void;
}

export default function FilesView({
  displayedBlobs,
  onDownloadFile,
  downloadingFileId,
  onShowUploadModal,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  isLoadingBlobs,
  onRefresh,
  activeFolderFilter,
  setActiveFolderFilter,
  pinnedVaults,
  onTriggerFileInput
}: FilesViewProps) {
  
  // High fidelity default file rows from Image 2
  const fallbackDesignFiles = [
    {
      blobName: 'Legal_Documents',
      type: 'folder',
      size: 1.4 * 1024 * 1024 * 1024,
      shards: '12 Nodes',
      createdAt: new Date().toISOString()
    },
    {
      blobName: 'project_roadmap_v2.pdf',
      type: 'pdf',
      size: 4.2 * 1024 * 1024,
      shards: '6 Nodes',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      blobName: 'branding_guidelines.png',
      type: 'png',
      size: 12.8 * 1024 * 1024,
      shards: '8 Nodes',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      blobName: 'contracts_snapshot.tar.gz',
      type: 'archive',
      size: 245 * 1024 * 1024,
      shards: '32 Nodes',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    }
  ];

  return (
    <div className="space-y-10">
      
      {/* PAGE HEADER & METRICS GRID */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-2">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">My Vault</h2>
          <p className="text-sm text-slate-400">
            Manage your encrypted data shards across the decentralized storage network. Secure, private, and permanent.
          </p>
        </div>
        
        {/* UPPER RIGHT METRIC PILLS - IMAGE 2 COMPLIANT */}
        <div className="flex items-center gap-6 font-mono bg-slate-900/30 border border-slate-800/80 px-6 py-4 rounded-2xl">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">USED SPACE</p>
            <p className="text-2xl font-extrabold text-cyan-400 mt-0.5">42.8 GB</p>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">TOTAL NODES</p>
            <p className="text-2xl font-extrabold text-cyan-400 mt-0.5">1,204</p>
          </div>
        </div>
      </div>

      {/* CORE DUAL-COLUMN LAYOUT - IMAGE 2 SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: UPLOAD BOX & ACTIVE TRANSFERS (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* UPLOAD FILE BOX */}
          <div 
            onClick={onTriggerFileInput}
            className="border-2 border-dashed border-cyan-500/20 hover:border-cyan-400/40 bg-slate-900/10 hover:bg-slate-900/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6 animate-pulse" />
            </div>
            <p className="text-xs font-bold text-slate-300">Drag & drop or click to browse</p>
            <p className="text-[10px] text-slate-500 mt-1 uppercase font-mono tracking-wider">MAX 500MB PER SHARD</p>
          </div>

          {/* ACTIVE TRANSFERS MODULE - IMAGE 2 ALIGNED */}
          <div className="rounded-2xl bg-slate-900/30 border border-slate-800/80 p-5 space-y-4">
            <h3 className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">ACTIVE TRANSFERS</h3>
            
            <div className="space-y-4 font-mono">
              {/* Row 1 */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300 truncate max-w-[180px]">backup_seed_2024.zip</span>
                  <span className="text-cyan-400 font-bold">85%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden p-px border border-slate-900">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              {/* Row 2 */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300 truncate max-w-[180px]">design_assets.fig</span>
                  <span className="text-cyan-400 font-bold">24%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden p-px border border-slate-900">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: '24%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* PINNED VAULTS DIRECTORY */}
          <div className="rounded-2xl bg-slate-900/30 border border-slate-800 p-5 space-y-4">
            <h3 className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">PINNED VAULTS</h3>
            
            <div className="grid grid-cols-2 gap-3">
              {pinnedVaults.map((vault) => (
                <div 
                  key={vault.id}
                  onClick={() => setActiveFolderFilter(vault.type === activeFolderFilter ? null : vault.type)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    activeFolderFilter === vault.type 
                      ? 'bg-cyan-500/5 border-cyan-500/40 text-cyan-300' 
                      : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-950/80 text-slate-300'
                  }`}
                >
                  <div className="mb-2 text-cyan-400">
                    {vault.type === 'docs' && <Folder className="w-5 h-5" />}
                    {vault.type === 'identity' && <LockKeyhole className="w-5 h-5" />}
                    {vault.type === 'memories' && <Image className="w-5 h-5" />}
                  </div>
                  <p className="text-xs font-bold truncate">{vault.name}</p>
                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">{vault.filesCount} FILES</p>
                </div>
              ))}
              <div 
                onClick={onShowUploadModal}
                className="border border-dashed border-slate-800/80 rounded-xl flex items-center justify-center p-5 text-slate-600 hover:border-slate-600 hover:text-slate-300 cursor-pointer transition-colors"
              >
                <Plus className="w-5 h-5" />
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SEARCH, FILE TABLE & CONTROLS (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="rounded-2xl bg-slate-900/30 border border-slate-800/80 p-6 space-y-6">
            
            {/* Search + Layout Controls */}
            <div className="flex items-center gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search files..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/30"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>

              <button 
                onClick={onRefresh}
                className="p-2 bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-xl transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingBlobs ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* List View Rendering */}
            {viewMode === 'list' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold">
                      <th className="pb-3 font-semibold">NAME</th>
                      <th className="pb-3 font-semibold">TYPE</th>
                      <th className="pb-3 font-semibold">SIZE</th>
                      <th className="pb-3 font-semibold">SHARDS</th>
                      <th className="pb-3 font-semibold text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-xs">
                    {/* Render Real User Blobs */}
                    {displayedBlobs.map((file) => (
                      <tr key={file.blobCommitment} className="group hover:bg-slate-950/10 transition-colors">
                        <td className="py-3.5 pr-2 font-bold text-slate-200 truncate max-w-[200px]">
                          <div className="flex items-center gap-2.5">
                            <FileText className="w-4 h-4 text-cyan-400" />
                            <span>{file.blobName}</span>
                          </div>
                        </td>
                        <td className="py-3.5">
                          <span className={`text-[8px] px-2 py-0.5 rounded border ${
                            file.type === 'private' ? 'bg-rose-500/5 border-rose-500/20 text-rose-400' :
                            file.type === 'public' ? 'bg-sky-500/5 border-sky-500/20 text-sky-400' :
                            'bg-cyan-500/5 border-cyan-500/20 text-cyan-400'
                          } font-mono font-bold uppercase`}>
                            {file.type || 'encrypted'}
                          </span>
                        </td>
                        <td className="py-3.5 font-mono text-slate-400">{formatBytes(file.size)}</td>
                        <td className="py-3.5 font-mono text-slate-400">16 Nodes</td>
                        <td className="py-3.5 text-right">
                          <button 
                            disabled={downloadingFileId === file.blobCommitment}
                            onClick={() => onDownloadFile(file)}
                            className="p-1 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 bg-slate-950 rounded-lg"
                          >
                            {downloadingFileId === file.blobCommitment ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}

                    {/* Prepend high-fidelity mock files from Image 2 */}
                    {fallbackDesignFiles.map((row) => (
                      <tr key={row.blobName} className="group hover:bg-slate-950/10 transition-colors">
                        <td className="py-3.5 pr-2 font-bold text-slate-200">
                          <div className="flex items-center gap-2.5">
                            {row.type === 'folder' ? (
                              <Folder className="w-4 h-4 text-purple-400" />
                            ) : (
                              <FileText className="w-4 h-4 text-cyan-400" />
                            )}
                            <span>{row.blobName}</span>
                          </div>
                        </td>
                        <td className="py-3.5">
                          <span className={`text-[8px] px-2 py-0.5 rounded border ${
                            row.type === 'folder' ? 'bg-purple-500/5 border-purple-500/20 text-purple-400' :
                            row.type === 'pdf' ? 'bg-rose-500/5 border-rose-500/20 text-rose-400' :
                            row.type === 'png' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' :
                            'bg-amber-500/5 border-amber-500/20 text-amber-400'
                          } font-mono font-bold uppercase`}>
                            {row.type}
                          </span>
                        </td>
                        <td className="py-3.5 font-mono text-slate-400">{formatBytes(row.size)}</td>
                        <td className="py-3.5 font-mono text-slate-400">{row.shards}</td>
                        <td className="py-3.5 text-right">
                          <button className="p-1 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 bg-slate-950 rounded-lg">
                            {row.type === 'folder' ? (
                              <MoreVertical className="w-3.5 h-3.5" />
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Grid View Rendering */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayedBlobs.map((file) => (
                  <div key={file.blobCommitment} className="p-4 rounded-xl border border-slate-800 bg-slate-950/20 flex flex-col justify-between h-40">
                    <div className="flex justify-between items-start">
                      <FileText className="w-8 h-8 text-cyan-400" />
                      <span className="text-[8px] font-mono px-2 py-0.5 rounded border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 uppercase font-bold">
                        {file.type || 'encrypted'}
                      </span>
                    </div>
                    <div className="min-w-0 pt-2">
                      <p className="text-xs font-bold text-slate-200 truncate">{file.blobName}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{formatBytes(file.size)}</p>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-800/40 pt-2.5 mt-2">
                      <span className="text-[10px] text-slate-500 font-mono">{formatRelativeTime(file.createdAt)}</span>
                      <button 
                        onClick={() => onDownloadFile(file)}
                        className="text-[10px] font-bold text-cyan-400 hover:underline"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
                
                {fallbackDesignFiles.map((file) => (
                  <div key={file.blobName} className="p-4 rounded-xl border border-slate-800 bg-slate-950/20 flex flex-col justify-between h-40">
                    <div className="flex justify-between items-start">
                      {file.type === 'folder' ? (
                        <Folder className="w-8 h-8 text-purple-400" />
                      ) : (
                        <FileText className="w-8 h-8 text-cyan-400" />
                      )}
                      <span className="text-[8px] font-mono px-2 py-0.5 rounded border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 uppercase font-bold">
                        {file.type}
                      </span>
                    </div>
                    <div className="min-w-0 pt-2">
                      <p className="text-xs font-bold text-slate-200 truncate">{file.blobName}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{formatBytes(file.size)}</p>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-800/40 pt-2.5 mt-2">
                      <span className="text-[10px] text-slate-500 font-mono">{file.shards}</span>
                      <button className="text-[10px] font-bold text-cyan-400 hover:underline">
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* View all files link */}
            <div className="text-center pt-2">
              <button 
                onClick={() => {
                  setActiveFolderFilter(null);
                  setSearchQuery('');
                }}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 font-mono uppercase tracking-wider"
              >
                View all files in vault
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* FULL WIDTH GLOBAL STORAGE NETWORK BLOCK - COMPLIANT WITH IMAGE 2 */}
      <div className="rounded-2xl bg-slate-900/30 border border-slate-800/80 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400 animate-[spin_10s_linear_infinite]" />
              <span>Global Storage Network</span>
            </h3>
            <p className="text-xs text-slate-400">
              Your files are redundantly sharded across a global network of encrypted nodes. Real-time distribution visualization showing active node health.
            </p>
          </div>
          
          {/* Legend indicator */}
          <div className="flex items-center gap-4 text-[10px] font-mono tracking-wider font-bold">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              <span className="text-slate-300">ACTIVE NODES</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-slate-600" />
              <span className="text-slate-500">OFFLINE</span>
            </div>
          </div>
        </div>

        {/* Global interactive SVG world mesh network */}
        <div className="rounded-2xl bg-[#030712] border border-slate-800/80 p-4 overflow-hidden relative shadow-inner">
          <svg viewBox="0 0 800 350" className="w-full h-auto text-slate-800">
            <style>{`
              @keyframes dash {
                to {
                  stroke-dashoffset: -100;
                }
              }
              .animate-dash {
                animation: dash 20s linear infinite;
              }
            `}</style>

            {/* Abstract World Grid Background Dots */}
            <pattern id="dot-grid" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#1e293b" />
            </pattern>
            <rect width="800" height="350" fill="url(#dot-grid)" />

            {/* Connecting Mesh lines */}
            <path d="M150,120 Q300,60 450,150" fill="none" stroke="rgba(34, 211, 238, 0.25)" strokeWidth="1.5" strokeDasharray="5,5" className="animate-dash" />
            <path d="M450,150 Q600,80 700,200" fill="none" stroke="rgba(34, 211, 238, 0.25)" strokeWidth="1.5" strokeDasharray="5,5" className="animate-dash" />
            <path d="M150,120 Q280,240 450,150" fill="none" stroke="rgba(34, 211, 238, 0.25)" strokeWidth="1.5" strokeDasharray="5,5" className="animate-dash" />
            <path d="M300,280 Q500,280 700,200" fill="none" stroke="rgba(34, 211, 238, 0.2)" strokeWidth="1" strokeDasharray="4,4" />
            <path d="M150,120 Q220,200 300,280" fill="none" stroke="rgba(34, 211, 238, 0.2)" strokeWidth="1" strokeDasharray="4,4" />
            <path d="M450,150 Q580,220 700,200" fill="none" stroke="rgba(34, 211, 238, 0.25)" strokeWidth="1.5" strokeDasharray="5,5" className="animate-dash" />
            
            {/* San Francisco */}
            <g transform="translate(150, 120)">
              <circle r="12" fill="rgba(34, 211, 238, 0.15)" className="animate-ping" />
              <circle r="5" fill="#22d3ee" className="shadow-[0_0_10px_#22d3ee]" />
              <text x="12" y="4" fill="rgba(255,255,255,0.7)" className="text-[9px] font-mono select-none pointer-events-none font-bold">SF-1 (99.9%)</text>
            </g>
            {/* London */}
            <g transform="translate(380, 100)">
              <circle r="12" fill="rgba(34, 211, 238, 0.15)" className="animate-ping [animation-delay:1s]" />
              <circle r="5" fill="#22d3ee" className="shadow-[0_0_10px_#22d3ee]" />
              <text x="12" y="4" fill="rgba(255,255,255,0.7)" className="text-[9px] font-mono select-none pointer-events-none font-bold">LDN-2 (99.8%)</text>
            </g>
            {/* Paris */}
            <g transform="translate(450, 150)">
              <circle r="12" fill="rgba(34, 211, 238, 0.15)" className="animate-ping [animation-delay:2s]" />
              <circle r="5" fill="#22d3ee" className="shadow-[0_0_10px_#22d3ee]" />
              <text x="12" y="4" fill="rgba(255,255,255,0.7)" className="text-[9px] font-mono select-none pointer-events-none font-bold">PAR-3 (99.9%)</text>
            </g>
            {/* Tokyo */}
            <g transform="translate(700, 200)">
              <circle r="12" fill="rgba(34, 211, 238, 0.15)" className="animate-ping [animation-delay:0.5s]" />
              <circle r="5" fill="#22d3ee" className="shadow-[0_0_10px_#22d3ee]" />
              <text x="-80" y="4" fill="rgba(255,255,255,0.7)" className="text-[9px] font-mono select-none pointer-events-none font-bold">TKY-4 (99.9%)</text>
            </g>
            {/* Singapore */}
            <g transform="translate(620, 260)">
              <circle r="12" fill="rgba(34, 211, 238, 0.15)" className="animate-ping [animation-delay:1.5s]" />
              <circle r="5" fill="#22d3ee" className="shadow-[0_0_10px_#22d3ee]" />
              <text x="-85" y="4" fill="rgba(255,255,255,0.7)" className="text-[9px] font-mono select-none pointer-events-none font-bold">SGP-5 (99.9%)</text>
            </g>
            {/* Sao Paulo */}
            <g transform="translate(300, 280)">
              <circle r="5" fill="#475569" />
              <text x="12" y="4" fill="rgba(255,255,255,0.4)" className="text-[9px] font-mono select-none pointer-events-none font-bold">SAO-6 (Offline)</text>
            </g>
          </svg>
        </div>
      </div>

    </div>
  );
}
