import React from 'react';
import { Coins, Sliders, RefreshCw } from 'lucide-react';
import { ValidatorNode } from '../types';

interface StakingViewProps {
  stakeInput: string;
  setStakeInput: (val: string) => void;
  selectedValidator: string;
  setSelectedValidator: (val: string) => void;
  isSubmittingStake: boolean;
  onExecuteStake: (e: React.FormEvent) => void;
  validatorNodes: ValidatorNode[];
  calcStakeValue: number;
  setCalcStakeValue: (val: number) => void;
}

export default function StakingView({
  stakeInput,
  setStakeInput,
  selectedValidator,
  setSelectedValidator,
  isSubmittingStake,
  onExecuteStake,
  validatorNodes,
  calcStakeValue,
  setCalcStakeValue
}: StakingViewProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* PRIMARY STAKING STATION CARD */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/40 border border-slate-800 p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-cyan-400" />
              <span>SEED Staking Node Portal</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Lock SEED to earn passive rewards and protect decentralized storage pools.</p>
          </div>

          <form onSubmit={onExecuteStake} className="space-y-4 bg-slate-950/40 border border-slate-800 p-5 rounded-xl">
            <div className="flex justify-between items-center text-xs">
              <label className="text-slate-400 font-bold">STAKING AMOUNT</label>
              <span className="text-slate-500 font-mono">Wallet: 145,000.00 SEED</span>
            </div>
            
            <div className="relative">
              <input 
                type="text"
                value={stakeInput}
                onChange={(e) => setStakeInput(e.target.value)}
                placeholder="500"
                className="w-full pl-4 pr-16 py-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-sm focus:outline-none focus:border-cyan-500/30 text-white"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400 flex items-center gap-2">
                <button 
                  type="button" 
                  onClick={() => setStakeInput('145000')} 
                  className="text-[10px] text-cyan-400 hover:underline"
                >
                  MAX
                </button>
                <span>SEED</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 font-mono text-[10px] text-center">
              {['100', '1000', '5000', '10000'].map((preset) => (
                <button 
                  key={preset}
                  type="button"
                  onClick={() => setStakeInput(preset)}
                  className="py-2 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white"
                >
                  {parseInt(preset).toLocaleString()}
                </button>
              ))}
            </div>

            {/* Validator Selector dropdown */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-500 uppercase font-mono tracking-wider">Select Active Node Provider</label>
              <select 
                value={selectedValidator}
                onChange={(e) => setSelectedValidator(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono focus:outline-none"
              >
                {validatorNodes.map(node => (
                  <option key={node.id} value={node.id}>
                    {node.name} ({node.uptime}% Uptime • {node.commission}% Fee)
                  </option>
                ))}
              </select>
            </div>

            <button 
              type="submit"
              disabled={isSubmittingStake}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 hover:brightness-110 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10"
            >
              {isSubmittingStake ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Coins className="w-4 h-4" />
              )}
              <span>{isSubmittingStake ? 'Submitting to on-chain validator...' : 'Initiate Secure Staking Contract'}</span>
            </button>
          </form>

          {/* Nodes directory */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-widest">Active Storage Validators</h4>
            <div className="flex flex-col gap-2">
              {validatorNodes.map((node) => (
                <div key={node.id} className="p-3 rounded-xl border border-slate-800 bg-slate-950/20 flex flex-wrap justify-between items-center gap-2 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full ${node.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <div>
                      <p className="font-semibold text-slate-200">{node.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-mono">{node.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 font-mono text-[10px]">
                    <div>
                      <span className="text-slate-500">Uptime:</span>
                      <span className="text-slate-200 font-semibold ml-1">{node.uptime}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Fee:</span>
                      <span className="text-slate-200 font-semibold ml-1">{node.commission}%</span>
                    </div>
                    <div>
                      <span className="text-cyan-400 font-bold">12.4% APY</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* YIELD CALCULATOR MODULE SIDEBAR */}
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Reward Calculator</span>
            </h3>
            <p className="text-xs text-slate-400">Simulate yield outputs dynamically relative to active lock-up weight.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Simulated SEED:</span>
                <span className="font-bold text-slate-200">{calcStakeValue.toLocaleString()} SEED</span>
              </div>
              <input 
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={calcStakeValue}
                onChange={(e) => setCalcStakeValue(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Est. Monthly Earnings:</span>
                <span className="text-slate-200 font-bold">{(calcStakeValue * 0.124 / 12).toFixed(2)} SEED</span>
              </div>
              <div className="flex justify-between border-t border-slate-900 pt-2">
                <span className="text-slate-500">Est. Annual Earnings:</span>
                <span className="text-cyan-400 font-bold">{(calcStakeValue * 0.124).toFixed(2)} SEED</span>
              </div>
              <div className="flex justify-between border-t border-slate-900 pt-2 text-[10px] text-emerald-400">
                <span>Daily Compound Bonus:</span>
                <span>+ {(calcStakeValue * 0.025 / 365).toFixed(4)} SEED</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
