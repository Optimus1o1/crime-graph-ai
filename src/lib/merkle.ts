// src/lib/merkle.ts
/**
 * Merkle tree implementation using Web Crypto SHA-256.
 * Provides functions to build a Merkle tree from data leaves,
 * generate inclusion proofs, and verify proofs.
 */

export interface MerkleTree {
  root: string;
  leaves: string[];
  layers: string[][];
}

/**
 * Computes the SHA-256 hash of a string using Web Crypto API.
 * @param data The input string to hash
 * @returns A promise that resolves to the hex string representation of the hash
 */
export async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Sorts two strings and concatenates them for hashing.
 * Ensures the tree is deterministic regardless of sibling order.
 */
function sortAndConcat(a: string, b: string): string {
  return a < b ? a + b : b + a;
}

/**
 * Builds a deterministic Merkle tree from an array of pre-hashed leaves.
 * If there's an odd number of leaves in a layer, the last one is duplicated.
 * @param leaves Array of SHA-256 hashed leaf strings
 * @returns A Promise resolving to the MerkleTree object
 */
export async function buildMerkleTree(leaves: string[]): Promise<MerkleTree> {
  if (!leaves || leaves.length === 0) {
    throw new Error('Cannot build Merkle tree with empty leaves array');
  }

  const layers: string[][] = [leaves];
  let currentLayer = leaves;

  while (currentLayer.length > 1) {
    const nextLayer: string[] = [];
    
    for (let i = 0; i < currentLayer.length; i += 2) {
      const left = currentLayer[i];
      // Duplicate the last node if odd number of nodes in the layer
      const right = i + 1 < currentLayer.length ? currentLayer[i + 1] : left;
      
      const combined = sortAndConcat(left, right);
      const hash = await sha256(combined);
      nextLayer.push(hash);
    }
    
    layers.push(nextLayer);
    currentLayer = nextLayer;
  }

  return {
    root: currentLayer[0],
    leaves,
    layers,
  };
}

/**
 * Generates a Merkle proof for a specific leaf hash.
 * @param tree The MerkleTree object
 * @param leafHash The hash of the leaf to prove
 * @returns An array of sibling hashes forming the proof path
 */
export function getMerkleProof(tree: MerkleTree, leafHash: string): string[] {
  let index = tree.leaves.indexOf(leafHash);
  if (index === -1) {
    throw new Error('Leaf not found in tree');
  }

  const proof: string[] = [];
  
  for (let i = 0; i < tree.layers.length - 1; i++) {
    const layer = tree.layers[i];
    const isRightNode = index % 2 === 1;
    const pairIndex = isRightNode ? index - 1 : index + 1;
    
    // If the pair index is beyond the layer bounds, it was duplicated during tree construction
    if (pairIndex < layer.length) {
      proof.push(layer[pairIndex]);
    } else {
      proof.push(layer[index]); // The node itself is duplicated as its own sibling
    }
    
    index = Math.floor(index / 2);
  }

  return proof;
}

/**
 * Verifies a Merkle proof for a given leaf against a known root.
 * @param leafHash The hash of the leaf being verified
 * @param proof The array of sibling hashes forming the proof
 * @param root The expected Merkle root
 * @returns A promise resolving to true if the proof is valid, false otherwise
 */
export async function verifyMerkleProof(
  leafHash: string,
  proof: string[],
  root: string
): Promise<boolean> {
  let currentHash = leafHash;

  for (const siblingHash of proof) {
    const combined = sortAndConcat(currentHash, siblingHash);
    currentHash = await sha256(combined);
  }

  return currentHash === root;
}
