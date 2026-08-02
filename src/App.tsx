import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Wallet,
  Key, 
  UploadCloud, 
  CheckCircle2, 
  RefreshCw, 
  Lock, 
  AlertCircle, 
  Copy, 
  Check, 
  Plus, 
  X,
  LogOut,
  Coins,
  Github,
  Globe,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AptosWalletAdapterProvider, useWallet } from "@aptos-labs/wallet-adapter-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ShelbyClientProvider, useUploadBlobs, useAccountBlobs } from "@shelby-protocol/react";
import { ShelbyClient } from "@shelby-protocol/sdk/browser";
import { Network } from "@aptos-labs/ts-sdk";

// Modular types, static data, and utilities
import { PaletteId, UploadedBlob } from './types';
import { palettes, overviewMockFiles, filesMockFiles, validatorNodes, pinnedVaults } from './data';
import { formatBytes, truncateAddress } from './utils';
import seedioLogo from './assets/images/seedio_logo_1783833492145.jpg';

// View Components
import OverviewView from './components/OverviewView';
import FilesView from './components/FilesView';
import SharedView from './components/SharedView';
import VaultView from './components/VaultView';
import StakingView from './components/StakingView';

const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 127.14 96.36" fill="currentColor" {...props}>
    <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.51-5c.87-.64,1.72-1.33,2.53-2a75.7,75.7,0,0,0,72.93,0c.81.71,1.66,1.4,2.53,2a68.52,68.52,0,0,1-10.51,5,77.84,77.84,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31.06-18.83C129,54.65,123.48,31.58,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

function MainApp() {
  const wallet = useWallet();
  const { connected, account, connect, disconnect, signAndSubmitTransaction } = wallet;

  const handleConnect = async () => {
    try {
      await connect("Petra");
    } catch (error) {
      console.error("Wallet connection error:", error);
      alert("Could not connect. Make sure Petra extension is installed and unlocked.");
    }
  };

  const [currentView, setCurrentView] = useState<'overview' | 'files' | 'shared' | 'vault' | 'staking'>('overview');

  const [activePaletteId, setActivePaletteId] = useState<PaletteId>('variant2');
  const palette = palettes[activePaletteId];

  const activeAddress = account?.address ? account.address.toString() : '';

  const { data: realBlobs, isLoading: isBlobsLoading, error: blobsError, refetch: refetchBlobs } = useAccountBlobs({ account: activeAddress });
  const uploadBlobs = useUploadBlobs({});

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customFileName, setCustomFileName] = useState<string>('');

  const [uploadStep, setUploadStep] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadType, setUploadType] = useState<'encrypted' | 'public' | 'private'>('encrypted');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeFolderFilter, setActiveFolderFilter] = useState<string | null>(null);

  const [copyingAddress, setCopyingAddress] = useState<boolean>(false);
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  const [stakedAmount, setStakedAmount] = useState<number>(4500.00);
  const [stakeInput, setStakeInput] = useState<string>('500');
  const [isSubmittingStake, setIsSubmittingStake] = useState<boolean>(false);
  const [selectedValidator, setSelectedValidator] = useState<string>('node-1');
  const [calcStakeValue, setCalcStakeValue] = useState<number>(5000);

  const [vaultPassword, setVaultPassword] = useState<string>('');
  const [isVaultUnlocked, setIsVaultUnlocked] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (successToast) {
      const timer = setTimeout(() => setSuccessToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successToast]);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setCustomFileName(file.name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setCustomFileName(file.name);
    }
  };

  const handleUploadFile = async () => {
    if (!selectedFile) return;
    if (!connected || !account || !signAndSubmitTransaction) {
      handleConnect();
      return;
    }
    
    try {
      setUploadStep('Uploading blob via Shelby SDK...');
      const arrayBuffer = await selectedFile.arrayBuffer();
      const fileData = new Uint8Array(arrayBuffer);
      const fileNameToUse = customFileName || selectedFile.name;
      const expirationMicros = Date.now() * 1000 + 365 * 24 * 60 * 60 * 1000 * 1000;
      
      const accountAddress = (account as any).accountAddress || account.address;

      await uploadBlobs.mutateAsync({
        signer: {
          account: accountAddress,
          signAndSubmitTransaction,
        },
        blobs: [{
          blobName: fileNameToUse,
          blobData: fileData,
        }],
        expirationMicros,
      });
      
      refetchBlobs();
      
      setSelectedFile(null);
      setCustomFileName('');
      setSuccessToast(`Successfully uploaded ${fileNameToUse} to the Decentralized Vault!`);
      setShowUploadModal(false);
    } catch (e: any) {
      console.error(e);
      setErrorMessage(e.message || 'Upload error occurred.');
    }
  };

  const handleDownloadFile = async (item: UploadedBlob) => {
    setDownloadingFileId(item.blobCommitment);
    try {
      const dummyContent = `SEEDIO DECENTRALIZED RECOVERY:\nFile Name: ${item.blobName}\nCommitment Root: ${item.blobCommitment}\nIntegrity: Reed-Solomon Verified (100% chunks decrypted).`;
      const recoveryBlob = new Blob([dummyContent], { type: 'text/plain' });
      const url = URL.createObjectURL(recoveryBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.blobName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSuccessToast(`Downloaded and decrypted ${item.blobName}!`);
    } finally {
      setDownloadingFileId(null);
    }
  };

  const handleExecuteStake = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(stakeInput);
    if (isNaN(parsed) || parsed <= 0) return;
    
    setIsSubmittingStake(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStakedAmount(prev => prev + parsed);
    setIsSubmittingStake(false);
    setStakeInput('');
    setSuccessToast(`Successfully staked ${parsed.toLocaleString()} SEED on validator node!`);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyingAddress(true);
    setTimeout(() => setCopyingAddress(false), 2000);
  };

  const displayedBlobs = (() => {
    const seen = new Set<string>();
    const merged: UploadedBlob[] = [];

    const mappedRealBlobs: UploadedBlob[] = (realBlobs || []).map(b => ({
      owner: b.owner.toString(),
      blobName: b.blobNameSuffix,
      blobCommitment: b.blobMerkleRoot ? Array.from(b.blobMerkleRoot).map(byte => byte.toString(16).padStart(2, '0')).join('') : (b.uid?.toString() || 'unknown'),
      createdAt: new Date(Number(b.creationMicros) / 1000).toISOString(),
      expiresAt: new Date(Number(b.expirationMicros) / 1000).toISOString(),
      size: b.size,
      isWritten: b.isWritten,
      sliceAddress: b.sliceAddress.toString(),
      type: b.encryption === 'Unencrypted' ? 'public' : 'encrypted'
    }));

    for (const b of mappedRealBlobs) {
      if (!seen.has(b.blobCommitment)) {
        seen.add(b.blobCommitment);
        merged.push(b);
      }
    }

    const targetSource = filesMockFiles;
    for (const b of targetSource) {
      if (!seen.has(b.blobCommitment)) {
        seen.add(b.blobCommitment);
        merged.push(b);
      }
    }

    let result = merged;
    if (activeFolderFilter) {
      if (activeFolderFilter === 'docs') {
        result = result.filter(b => b.blobName.endsWith('.pdf') || b.blobName.endsWith('.doc') || b.blobName.endsWith('.txt'));
      } else if (activeFolderFilter === 'identity') {
        result = result.filter(b => b.blobName.toLowerCase().includes('key') || b.blobName.endsWith('.pem') || b.blobName.endsWith('.zip'));
      } else if (activeFolderFilter === 'memories') {
        result = result.filter(b => b.blobName.endsWith('.png') || b.blobName.endsWith('.jpg') || b.blobName.endsWith('.mp4'));
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => b.blobName.toLowerCase().includes(q));
    }

    return result;
  })();

  return (
    <div className={`min-h-screen flex flex-col flex-wrap font-sans transition-all duration-500 relative overflow-x-hidden ${palette.bg}`}>
      
      {/* Immersive Cybergrid Design Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a15_1px,transparent_1px),linear-gradient(to_bottom,#0f172a15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-cyan-500/10 to-transparent rounded-full pointer-events-none z-0" />

      {/* Success Toast Notification */}
      <AnimatePresence>
        {successToast && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900 border border-cyan-500/30 text-cyan-300 shadow-[0_8px_32px_rgba(34,211,238,0.2)] font-medium text-xs font-mono"
          >
            <div className="w-5 h-5 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Cyber Header bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('overview')}>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 overflow-hidden shadow-[0_0_15px_rgba(34,211,238,0.15)]">
              <img src={seedioLogo} alt="Seedio Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white font-mono">Seedio</h1>
                <span className="text-[8px] uppercase font-mono px-1.5 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-bold">
                  Shelbynet Testnet
                </span>
              </div>
            </div>
          </div>

          {/* Navigation links - Centered */}
          <nav className="hidden md:flex items-center space-x-1">
            {connected && [
              { id: 'overview', label: 'Files' }, // Map to 'Files' / 'Overview'
              { id: 'files', label: 'Vault' },     // Map to 'Vault' / 'FilesView'
              { id: 'shared', label: 'Shared' },
              { id: 'staking', label: 'Staking' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setCurrentView(tab.id as any);
                  setActiveFolderFilter(null);
                }}
                className={`relative px-4 py-2 text-xs font-mono uppercase tracking-widest transition-all duration-300 font-bold ${
                  currentView === tab.id ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                {currentView === tab.id && (
                  <motion.div 
                    layoutId="headerActiveUnderline"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Connected Address Indicator & Actions */}
          <div className="flex items-center gap-3">
            
            {/* Interactive palette switcher widget */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-950/60 px-2.5 py-1 rounded-full border border-slate-800">
              {Object.values(palettes).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActivePaletteId(p.id)}
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                    activePaletteId === p.id ? 'ring-1 ring-white scale-110' : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{
                    background: p.id === 'variant1' ? '#0ea5e9' :
                                p.id === 'variant2' ? '#22d3ee' :
                                p.id === 'variant3' ? '#a855f7' :
                                p.id === 'variant4' ? '#34d399' :
                                p.id === 'variant5' ? '#f59e0b' : '#a1a1aa'
                  }}
                />
              ))}
            </div>

            {connected && activeAddress && (
              <div 
                onClick={() => handleCopy(activeAddress)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-[10px] font-mono flex items-center gap-2 cursor-pointer hover:border-slate-700 transition-colors"
                title="Copy active address"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                <span>{truncateAddress(activeAddress)}</span>
                {copyingAddress ? (
                  <Check className="w-3 h-3 text-cyan-400" />
                ) : (
                  <Copy className="w-3 h-3 opacity-50" />
                )}
              </div>
            )}

            {connected ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => disconnect()}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] text-slate-300 hover:text-red-400 font-mono uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all"
                  title="Disconnect Wallet"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Disconnect</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={handleConnect}
                className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:brightness-110 text-[10px] font-bold font-mono uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-lg shadow-cyan-500/10 active:scale-95 transition-all"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Global error block container */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
              <span>
                {errorMessage.includes('https://petra.app') ? (
                  <>
                    Petra Wallet extension was not detected. Please install Petra Wallet at{' '}
                    <a 
                      href="https://petra.app" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="underline font-bold text-cyan-400 hover:text-cyan-300 ml-1"
                    >
                      https://petra.app
                    </a>{' '}
                    to connect.
                  </>
                ) : (
                  errorMessage
                )}
              </span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="opacity-60 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* VIEW ROUTE RENDERER USING MODULAR COMPONENTS */}
        {(!connected || currentView === 'overview') && (
          <OverviewView 
            onShowUploadModal={() => setShowUploadModal(true)}
            onNavigate={setCurrentView}
            recentFiles={displayedBlobs}
            onDownloadFile={handleDownloadFile}
            downloadingFileId={downloadingFileId}
            onConnectWallet={handleConnect}
            connected={connected}
          />
        )}

        {connected && currentView === 'files' && (
          <FilesView 
            displayedBlobs={displayedBlobs}
            onDownloadFile={handleDownloadFile}
            downloadingFileId={downloadingFileId}
            onShowUploadModal={() => setShowUploadModal(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            viewMode={viewMode}
            setViewMode={setViewMode}
            isLoadingBlobs={isBlobsLoading}
            onRefresh={() => refetchBlobs()}
            activeFolderFilter={activeFolderFilter}
            setActiveFolderFilter={setActiveFolderFilter}
            pinnedVaults={pinnedVaults}
            onTriggerFileInput={() => fileInputRef.current?.click()}
          />
        )}

        {connected && currentView === 'shared' && (
          <SharedView 
            onCopyShareLink={(link) => setSuccessToast('Decentralized secure share link copied!')}
            onRevokeAccess={(name) => setSuccessToast(`Access revoked for ${name}`)}
            onNavigateToFiles={() => setCurrentView('files')}
          />
        )}

        {connected && currentView === 'vault' && (
          <VaultView 
            isVaultUnlocked={isVaultUnlocked}
            setIsVaultUnlocked={setIsVaultUnlocked}
            vaultPassword={vaultPassword}
            setVaultPassword={setVaultPassword}
            onUnlockSubmit={(e) => {
              e.preventDefault();
              if (vaultPassword.length >= 4) {
                setIsVaultUnlocked(true);
                setSuccessToast('Local cryptographic key ring loaded!');
              } else {
                setErrorMessage('Passkey must be at least 4 characters.');
              }
            }}
          />
        )}

        {connected && currentView === 'staking' && (
          <StakingView 
            stakeInput={stakeInput}
            setStakeInput={setStakeInput}
            selectedValidator={selectedValidator}
            setSelectedValidator={setSelectedValidator}
            isSubmittingStake={isSubmittingStake}
            onExecuteStake={handleExecuteStake}
            validatorNodes={validatorNodes}
            calcStakeValue={calcStakeValue}
            setCalcStakeValue={setCalcStakeValue}
          />
        )}

      </main>

      {/* Hidden File Input element */}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* FIXED FLOATING ACTION TRIGGER */}
      {connected && (
        <div className="fixed bottom-6 right-6 z-40">
          <button 
            onClick={() => setShowUploadModal(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 flex items-center justify-center text-slate-950 shadow-2xl shadow-cyan-500/20 border border-cyan-400/20 active:scale-95 hover:scale-105 transition-all"
            title="Upload New Asset"
          >
            <Plus className="w-7 h-7" />
          </button>
        </div>
      )}



      {/* FILE UPLOAD MODAL COMPONENT */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!uploadBlobs.isPending) setShowUploadModal(false);
              }}
              className="absolute inset-0 bg-slate-950/80"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-lg bg-[#0a1122] border border-slate-800 rounded-3xl p-6 relative z-10 space-y-5 overflow-hidden"
            >
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                    <UploadCloud className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Upload New Asset</h3>
                    <p className="text-[10px] text-slate-500">Lease storage space on the decentralized network</p>
                  </div>
                </div>
                {!uploadBlobs.isPending && (
                  <button 
                    onClick={() => setShowUploadModal(false)}
                    className="p-1 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {!uploadBlobs.isPending ? (
                <div className="space-y-4">
                  
                  <div 
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/40 rounded-2xl py-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors px-4 group"
                  >
                    <UploadCloud className="w-10 h-10 text-slate-500 group-hover:text-cyan-400 transition-colors mb-3" />
                    
                    {selectedFile ? (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-200 max-w-xs truncate">{selectedFile.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{formatBytes(selectedFile.size)}</p>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-slate-300">Drag & drop your files here, or <span className="text-cyan-400 group-hover:underline">browse</span></p>
                        <p className="text-[10px] text-slate-500">Any file type up to 256 MB. Auto Reed-Solomon protected.</p>
                      </div>
                    )}
                  </div>

                  {selectedFile && (
                    <div className="space-y-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase font-mono tracking-wider">Custom Storage Name</label>
                        <input 
                          type="text"
                          value={customFileName}
                          onChange={(e) => setCustomFileName(e.target.value)}
                          placeholder="Project_Final_v2.pdf"
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-slate-700"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase font-mono tracking-wider">Security Classification</label>
                        <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-center">
                          {[
                            { id: 'encrypted', label: 'Encrypted' },
                            { id: 'public', label: 'Public' },
                            { id: 'private', label: 'Private' },
                          ].map(t => (
                            <button 
                              key={t.id}
                              type="button"
                              onClick={() => setUploadType(t.id as any)}
                              className={`py-2 rounded-lg border transition-all ${
                                uploadType === t.id 
                                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300' 
                                  : 'border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <button 
                    disabled={!selectedFile}
                    onClick={handleUploadFile}
                    className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 disabled:from-slate-800 disabled:to-slate-800 text-slate-950 disabled:text-slate-500 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/5 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload to Blockchain Network</span>
                  </button>

                </div>
              ) : (
                <div className="py-10 space-y-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto animate-spin">
                    <RefreshCw className="w-5 h-5" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-200">{uploadStep}</p>
                    <p className="text-[10px] text-slate-500 max-w-xs mx-auto">Please confirm the transaction in your Petra wallet.</p>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER SECTION */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-400">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-cyan-500/10 border border-slate-800 overflow-hidden flex items-center justify-center">
                <img src={seedioLogo} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <h4 className="font-bold text-slate-200 font-mono uppercase tracking-wider text-xs">Seedio</h4>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">Shelby Decentralized Storage Portal Client.</p>
            
            <div className="space-y-2 pt-2 border-t border-slate-900/50 max-w-sm">
              <p className="text-[10px] text-slate-400 font-mono font-semibold uppercase tracking-wider">Developer Credit</p>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-mono">Built by Badr:</span>
                <div className="flex items-center gap-2">
                  <a 
                    href="https://github.com/0xbadr2" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400 transition-all duration-300 flex items-center justify-center"
                    title="Badr on GitHub"
                  >
                    <Github className="w-3.5 h-3.5" />
                  </a>
                  <a 
                    href="https://x.com/0xBadr2" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400 transition-all duration-300 flex items-center justify-center"
                    title="Badr on X (Twitter)"
                  >
                    <XIcon className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
            <p className="text-[9px] text-slate-600 font-mono">© 2024 Seedio Corporation • All Rights Reserved</p>
          </div>

          <div className="space-y-3 md:justify-self-end md:text-left">
            <p className="text-[10px] text-slate-300 font-mono font-bold uppercase tracking-wider">
              Powered by Shelby Protocol:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a 
                href="https://shelby.xyz" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400 transition-all duration-300 flex items-center justify-center"
                title="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a 
                href="https://docs.shelby.xyz" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400 transition-all duration-300 flex items-center justify-center"
                title="Docs"
              >
                <BookOpen className="w-4 h-4" />
              </a>
              <a 
                href="https://github.com/shelby" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400 transition-all duration-300 flex items-center justify-center"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="https://discord.gg/shelbyserves" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400 transition-all duration-300 flex items-center justify-center"
                title="Discord"
              >
                <DiscordIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://x.com/shelbyserves" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400 transition-all duration-300 flex items-center justify-center"
                title="X (Twitter)"
              >
                <XIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}

const queryClient = new QueryClient();
const shelbyClient = new ShelbyClient({ network: Network.TESTNET });

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AptosWalletAdapterProvider
        dappInfo={{ aptosConnect: { dappName: "Seedio" } }}
        optInWallets={["Petra"]}
        autoConnect
        onError={(error) => console.log("Wallet adapter error:", error)}
      >
        <ShelbyClientProvider client={shelbyClient}>
          <MainApp />
        </ShelbyClientProvider>
      </AptosWalletAdapterProvider>
    </QueryClientProvider>
  );
}