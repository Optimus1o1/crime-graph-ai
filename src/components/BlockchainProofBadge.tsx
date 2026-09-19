'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Link2, 
  ExternalLink, 
  Loader2, 
  CheckCircle2, 
  XCircle,
  Copy,
  Check
} from 'lucide-react';

interface BlockchainProofBadgeProps {
  sha256?: string;
  merkleRoot?: string;
  txHash?: string;
  blockNumber?: number;
  chainId?: number;
  anchoredAt?: string;
  status: 'PENDING' | 'HASHED' | 'ANCHORING' | 'CONFIRMED' | 'VERIFIED' | 'FAILED';
  compact?: boolean;
  onVerify?: () => void;
}

export default function BlockchainProofBadge({
  sha256,
  merkleRoot,
  txHash,
  blockNumber,
  chainId,
  anchoredAt,
  status,
  compact = false,
  onVerify
}: BlockchainProofBadgeProps) {
  const [copiedSha, setCopiedSha] = useState(false);
  const [copiedTx, setCopiedTx] = useState(false);
  
  const EXPLORER_URL = process.env.NEXT_PUBLIC_BLOCKCHAIN_EXPLORER_URL || 'https://amoy.polygonscan.com';
  
  const handleCopy = (text: string, type: 'sha' | 'tx') => {
    navigator.clipboard.writeText(text);
    if (type === 'sha') {
      setCopiedSha(true);
      setTimeout(() => setCopiedSha(false), 2000);
    } else {
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    }
  };
  
  const truncate = (str?: string) => {
    if (!str) return 'N/A';
    if (str.length <= 16) return str;
    return `${str.slice(0, 8)}...${str.slice(-8)}`;
  };
  
  const statusConfig = {
    PENDING: {
      icon: <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse mt-0.5" />,
      text: 'Awaiting Anchor',
      border: 'border-cyan-900/40',
      textClass: 'text-amber-500/90'
    },
    HASHED: {
      icon: <Link2 className="w-4 h-4 text-cyan-500" />,
      text: 'SHA-256 Computed',
      border: 'border-cyan-900/40',
      textClass: 'text-cyan-500/90'
    },
    ANCHORING: {
      icon: <Loader2 className="w-4 h-4 text-cyan-500 animate-spin" />,
      text: 'Submitting to Chain...',
      border: 'border-cyan-900/40',
      textClass: 'text-cyan-500/90'
    },
    CONFIRMED: {
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      text: `Anchored${blockNumber ? ` (Block ${blockNumber})` : ''}`,
      border: 'border-emerald-500/50',
      textClass: 'text-emerald-500'
    },
    VERIFIED: {
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />,
      text: '✓ BLOCKCHAIN VERIFIED',
      border: 'border-emerald-500/50 shadow-[0_0_15px_rgba(52,211,153,0.15)]',
      textClass: 'text-emerald-400 font-bold tracking-wider'
    },
    FAILED: {
      icon: <ShieldAlert className="w-4 h-4 text-red-500" />,
      text: 'Anchor Failed',
      border: 'border-red-500/50',
      textClass: 'text-red-500'
    }
  };
  
  const currentStatus = statusConfig[status];
  
  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#020509] border ${currentStatus.border} font-mono text-xs`}>
        {currentStatus.icon}
        <span className={currentStatus.textClass}>{currentStatus.text}</span>
      </div>
    );
  }
  
  return (
    <div className={`flex flex-col gap-3 p-4 rounded-lg bg-[#04070D] border ${currentStatus.border} font-mono text-xs w-full max-w-md`}>
      {/* Header Status */}
      <div className="flex items-center justify-between pb-2 border-b border-cyan-900/30">
        <div className="flex items-center gap-2">
          {currentStatus.icon}
          <span className={currentStatus.textClass}>{currentStatus.text}</span>
        </div>
        
        {onVerify && status === 'CONFIRMED' && (
          <button 
            onClick={onVerify}
            className="px-2 py-1 rounded bg-cyan-950/40 text-cyan-400 hover:bg-cyan-900/60 border border-cyan-800/50 transition-colors flex items-center gap-1"
          >
            <Shield className="w-3 h-3" />
            Verify
          </button>
        )}
      </div>
      
      {/* Details Grid */}
      <div className="grid grid-cols-[100px_1fr] gap-y-2 gap-x-4">
        {sha256 && (
          <>
            <div className="text-cyan-700/70 uppercase">SHA-256</div>
            <div className="flex items-center justify-between text-cyan-100/90 group">
              <span className="truncate" title={sha256}>{truncate(sha256)}</span>
              <button 
                onClick={() => handleCopy(sha256, 'sha')}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-cyan-400"
              >
                {copiedSha ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </>
        )}
        
        {merkleRoot && (
          <>
            <div className="text-cyan-700/70 uppercase">Merkle Root</div>
            <div className="text-cyan-100/90 truncate" title={merkleRoot}>{truncate(merkleRoot)}</div>
          </>
        )}
        
        {txHash && (
          <>
            <div className="text-cyan-700/70 uppercase">Tx Hash</div>
            <div className="flex items-center justify-between text-cyan-100/90 group">
              <div className="flex items-center gap-1.5">
                <span className="truncate" title={txHash}>{truncate(txHash)}</span>
                <a 
                  href={`${EXPLORER_URL}/tx/${txHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-500 hover:text-cyan-400"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <button 
                onClick={() => handleCopy(txHash, 'tx')}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-cyan-400"
              >
                {copiedTx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </>
        )}
        
        {blockNumber && (
          <>
            <div className="text-cyan-700/70 uppercase">Block</div>
            <div className="text-cyan-100/90">{blockNumber.toLocaleString()}</div>
          </>
        )}
        
        {anchoredAt && (
          <>
            <div className="text-cyan-700/70 uppercase">Anchored At</div>
            <div className="text-cyan-100/90">{new Date(anchoredAt).toLocaleString()}</div>
          </>
        )}
      </div>
    </div>
  );
}
