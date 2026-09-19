// src/lib/blockchain-verify.ts
import { JsonRpcProvider, Contract } from 'ethers';

/**
 * Read-only blockchain verification helpers for CrimeGraph AI.
 * The browser NEVER signs transactions.
 */

export interface VerificationResult {
  verified: boolean;
  txHash?: string;
  blockNumber?: number;
  timestamp?: string;
}

export interface TransactionInfo {
  txHash: string;
  blockNumber: number;
  timestamp: string;
  from: string;
  status: 'confirmed' | 'pending' | 'failed';
}

const RPC_URL = process.env.NEXT_PUBLIC_BLOCKCHAIN_RPC_URL || 'https://rpc-amoy.polygon.technology';
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_BLOCKCHAIN_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
const EXPLORER_URL = process.env.NEXT_PUBLIC_BLOCKCHAIN_EXPLORER_URL || 'https://amoy.polygonscan.com';

// Minimal ABI with only view and event functions needed for read-only verification
const CrimeGraphAnchorABI = [
  "function evidenceAnchors(bytes32) view returns (bytes32 merkleRoot, uint256 count, uint256 timestamp)",
  "function auditCheckpoints(bytes32) view returns (bytes32 auditHead, uint256 eventCount, uint256 timestamp)",
  "function modelRegistry(bytes32) view returns (bytes32 datasetHash, bytes32 configHash, bytes32 versionHash, uint256 timestamp)",
  "event EvidenceAnchored(bytes32 indexed caseIdHash, bytes32 merkleRoot, uint256 count, uint256 timestamp)",
  "event AuditCheckpointed(bytes32 indexed caseIdHash, bytes32 auditHead, uint256 eventCount, uint256 timestamp)",
  "event ModelRegistered(bytes32 indexed modelIdHash, bytes32 datasetHash, bytes32 configHash, bytes32 versionHash, uint256 timestamp)",
  "event VaultAnchored(bytes32 indexed vaultId, bytes32 stateHash, uint256 timestamp)",
  "event EntityMergeRecorded(bytes32 indexed originalId, bytes32 indexed mergedId, bytes32 reasonHash, uint256 timestamp)"
];

let providerInstance: JsonRpcProvider | null = null;
let contractInstance: Contract | null = null;

/**
 * Gets a singleton instance of the ethers JsonRpcProvider.
 */
export function getProvider(): JsonRpcProvider {
  if (!providerInstance) {
    providerInstance = new JsonRpcProvider(RPC_URL);
  }
  return providerInstance;
}

/**
 * Gets a singleton instance of the read-only ethers Contract.
 */
export function getContract(): Contract {
  if (!contractInstance) {
    contractInstance = new Contract(CONTRACT_ADDRESS, CrimeGraphAnchorABI, getProvider());
  }
  return contractInstance;
}

/**
 * Verifies if an evidence anchor is on-chain and matches the provided Merkle root.
 * @param caseIdHash The hash of the case ID
 * @param merkleRoot The expected Merkle root
 */
export async function verifyEvidenceAnchor(caseIdHash: string, merkleRoot: string): Promise<VerificationResult> {
  try {
    const contract = getContract();
    const result = await contract.evidenceAnchors(caseIdHash);
    
    const onChainRoot = result.merkleRoot;
    const timestamp = result.timestamp;
    
    if (onChainRoot === merkleRoot && BigInt(timestamp) > 0n) {
      return {
        verified: true,
        timestamp: timestamp.toString()
      };
    }
    return { verified: false };
  } catch (error) {
    console.error('Failed to verify evidence anchor:', error);
    return { verified: false };
  }
}

/**
 * Verifies if an audit checkpoint is on-chain and matches the provided audit head.
 * @param caseIdHash The hash of the case ID
 * @param auditHead The expected audit head hash
 */
export async function verifyAuditCheckpoint(caseIdHash: string, auditHead: string): Promise<VerificationResult> {
  try {
    const contract = getContract();
    const result = await contract.auditCheckpoints(caseIdHash);
    
    const onChainHead = result.auditHead;
    const timestamp = result.timestamp;
    
    if (onChainHead === auditHead && BigInt(timestamp) > 0n) {
      return {
        verified: true,
        timestamp: timestamp.toString()
      };
    }
    return { verified: false };
  } catch (error) {
    console.error('Failed to verify audit checkpoint:', error);
    return { verified: false };
  }
}

/**
 * Verifies a model's provenance by checking if it exists in the on-chain registry.
 * @param modelHash The hash of the model (acts as the ID key in mapping)
 */
export async function verifyModelProvenance(modelHash: string): Promise<VerificationResult> {
  try {
    const contract = getContract();
    const result = await contract.modelRegistry(modelHash);
    
    const timestamp = result.timestamp;
    
    // As long as it was registered (timestamp > 0)
    if (BigInt(timestamp) > 0n) {
      return {
        verified: true,
        timestamp: timestamp.toString()
      };
    }
    return { verified: false };
  } catch (error) {
    console.error('Failed to verify model provenance:', error);
    return { verified: false };
  }
}

/**
 * Constructs the explorer URL for a given transaction hash.
 * @param txHash The transaction hash
 */
export function getExplorerUrl(txHash: string): string {
  return `${EXPLORER_URL}/tx/${txHash}`;
}

/**
 * Fetches transaction info from the blockchain.
 * @param txHash The transaction hash to inspect
 */
export async function getTransactionInfo(txHash: string): Promise<TransactionInfo | null> {
  try {
    const provider = getProvider();
    const tx = await provider.getTransaction(txHash);
    
    if (!tx) {
      return null;
    }
    
    let status: 'confirmed' | 'pending' | 'failed' = 'pending';
    let timestamp = '';
    
    if (tx.blockNumber) {
      const receipt = await provider.getTransactionReceipt(txHash);
      if (receipt) {
        status = receipt.status === 1 ? 'confirmed' : 'failed';
        const block = await provider.getBlock(tx.blockNumber);
        if (block) {
          timestamp = block.timestamp.toString();
        }
      }
    }
    
    return {
      txHash,
      blockNumber: tx.blockNumber || 0,
      timestamp,
      from: tx.from,
      status
    };
  } catch (error) {
    console.error('Failed to get transaction info:', error);
    return null;
  }
}
