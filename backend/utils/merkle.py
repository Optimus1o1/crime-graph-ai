"""
CrimeGraph AI — Merkle Tree Utility.

Builds SHA-256-based Merkle trees for batching evidence hashes, vault exports,
and any set of cryptographic digests before anchoring a single root on-chain.

Usage:
    from backend.utils.merkle import build_merkle_tree, get_merkle_proof, verify_merkle_proof

    tree = build_merkle_tree(["aabb...", "ccdd...", "eeff..."])
    proof = get_merkle_proof(tree, "aabb...")
    assert verify_merkle_proof("aabb...", proof, tree.root)
"""

import hashlib
from dataclasses import dataclass, field
from typing import List, Optional


def sha256_hex(data: str) -> str:
    """Compute SHA-256 hex digest of a UTF-8 string."""
    return hashlib.sha256(data.encode("utf-8")).hexdigest()


def _hash_pair(left: str, right: str) -> str:
    """Hash two hex digest strings together (sorted for determinism)."""
    # Sort to ensure the same pair always produces the same parent
    # regardless of order — critical for proof verification.
    pair = "".join(sorted([left, right]))
    return hashlib.sha256(pair.encode("utf-8")).hexdigest()


@dataclass
class MerkleTree:
    """Immutable Merkle tree built from SHA-256 leaf hashes."""
    root: str
    leaves: List[str]
    layers: List[List[str]] = field(default_factory=list)

    @property
    def leaf_count(self) -> int:
        return len(self.leaves)


def build_merkle_tree(leaf_hashes: List[str]) -> MerkleTree:
    """
    Build a binary Merkle tree from a list of SHA-256 hex digest strings.

    - If the list is empty, returns a tree with a zero root.
    - If the list has a single element, the root is that element.
    - Odd-length layers duplicate the last element before pairing.
    - Pairs are sorted before hashing for deterministic trees.

    Args:
        leaf_hashes: List of 64-character SHA-256 hex digest strings.

    Returns:
        MerkleTree with root, leaves, and all intermediate layers.
    """
    if not leaf_hashes:
        zero = "0" * 64
        return MerkleTree(root=zero, leaves=[], layers=[[zero]])

    # Normalize to lowercase
    leaves = [h.lower().strip() for h in leaf_hashes]
    layers: List[List[str]] = [leaves[:]]

    current_layer = leaves[:]
    while len(current_layer) > 1:
        next_layer: List[str] = []
        # Duplicate last element if odd count
        if len(current_layer) % 2 == 1:
            current_layer.append(current_layer[-1])

        for i in range(0, len(current_layer), 2):
            parent = _hash_pair(current_layer[i], current_layer[i + 1])
            next_layer.append(parent)

        layers.append(next_layer)
        current_layer = next_layer

    return MerkleTree(root=current_layer[0], leaves=leaves, layers=layers)


def get_merkle_proof(tree: MerkleTree, leaf_hash: str) -> List[str]:
    """
    Get the Merkle proof (list of sibling hashes) for a given leaf.

    Args:
        tree: A MerkleTree built by build_merkle_tree().
        leaf_hash: The SHA-256 hex digest of the leaf to prove.

    Returns:
        List of sibling hashes from leaf to root (excluding root).

    Raises:
        ValueError: If leaf_hash is not in the tree.
    """
    target = leaf_hash.lower().strip()
    if target not in tree.leaves:
        raise ValueError(f"Leaf {target[:16]}... not found in Merkle tree")

    proof: List[str] = []
    idx = tree.leaves.index(target)

    for layer in tree.layers[:-1]:  # Skip root layer
        # Duplicate last if odd
        working = layer[:]
        if len(working) % 2 == 1:
            working.append(working[-1])

        # Sibling is the other element in the pair
        if idx % 2 == 0:
            sibling_idx = idx + 1
        else:
            sibling_idx = idx - 1

        if sibling_idx < len(working):
            proof.append(working[sibling_idx])

        # Move to parent index
        idx = idx // 2

    return proof


def verify_merkle_proof(leaf_hash: str, proof: List[str], root: str) -> bool:
    """
    Verify a Merkle proof against an expected root.

    Args:
        leaf_hash: SHA-256 hex digest of the leaf.
        proof: List of sibling hashes from get_merkle_proof().
        root: Expected Merkle root.

    Returns:
        True if the proof is valid.
    """
    current = leaf_hash.lower().strip()
    for sibling in proof:
        current = _hash_pair(current, sibling.lower().strip())
    return current == root.lower().strip()
