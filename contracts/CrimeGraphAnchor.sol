// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title CrimeGraphAnchor
 * @notice On-chain trust anchor for the CrimeGraph AI investigative platform.
 *
 * This contract stores cryptographic commitments (SHA-256 hashes, Merkle roots)
 * that prove off-chain evidence, audit history, AI model versions, case vaults,
 * and entity-resolution decisions existed in a particular state at a particular time.
 *
 * NO raw data (FIRs, CDRs, evidence files, PII, model weights) is ever stored on-chain.
 * Only hashes and metadata required for independent verification.
 *
 * Deployed to: Polygon Amoy (testnet) / Polygon PoS (production)
 */
contract CrimeGraphAnchor {

    // ================================================================
    // OWNER
    // ================================================================

    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "CrimeGraphAnchor: caller is not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // ================================================================
    // 1. EVIDENCE BATCH ANCHORING
    // ================================================================

    struct EvidenceAnchor {
        bytes32 merkleRoot;     // Merkle root of all evidence SHA-256 hashes in the batch
        uint256 evidenceCount;  // Number of evidence items in the batch
        uint256 timestamp;      // Block timestamp when anchored
        address submitter;      // Investigator/system wallet that submitted
    }

    /// @notice caseIdHash => EvidenceAnchor (latest anchor per case)
    mapping(bytes32 => EvidenceAnchor) public evidenceAnchors;

    /// @notice Emitted when an evidence batch is anchored
    event EvidenceAnchored(
        bytes32 indexed caseIdHash,
        bytes32 merkleRoot,
        uint256 evidenceCount,
        uint256 timestamp,
        address indexed submitter
    );

    /**
     * @notice Anchor a batch of evidence hashes (as a Merkle root) for a case.
     * @param caseIdHash  SHA-256 hash of the case ID string
     * @param merkleRoot  Merkle root computed from all evidence SHA-256 digests
     * @param evidenceCount Number of evidence items in this batch
     */
    function anchorEvidenceBatch(
        bytes32 caseIdHash,
        bytes32 merkleRoot,
        uint256 evidenceCount
    ) external onlyOwner {
        evidenceAnchors[caseIdHash] = EvidenceAnchor({
            merkleRoot: merkleRoot,
            evidenceCount: evidenceCount,
            timestamp: block.timestamp,
            submitter: msg.sender
        });

        emit EvidenceAnchored(caseIdHash, merkleRoot, evidenceCount, block.timestamp, msg.sender);
    }

    // ================================================================
    // 2. AUDIT CHAIN CHECKPOINTING
    // ================================================================

    struct AuditCheckpoint {
        bytes32 auditHead;      // SHA-256 chain head hash at checkpoint time
        uint256 eventCount;     // Total audit events up to this checkpoint
        uint256 timestamp;
        address submitter;
    }

    mapping(bytes32 => AuditCheckpoint) public auditCheckpoints;

    event AuditCheckpointed(
        bytes32 indexed caseIdHash,
        bytes32 auditHead,
        uint256 eventCount,
        uint256 timestamp,
        address indexed submitter
    );

    /**
     * @notice Checkpoint the audit chain head hash for a case.
     * @param caseIdHash SHA-256 hash of the case ID
     * @param auditHead  Current chain head hash (SHA-256 of the latest audit entry)
     * @param eventCount Total number of audit events in the chain
     */
    function checkpointAudit(
        bytes32 caseIdHash,
        bytes32 auditHead,
        uint256 eventCount
    ) external onlyOwner {
        auditCheckpoints[caseIdHash] = AuditCheckpoint({
            auditHead: auditHead,
            eventCount: eventCount,
            timestamp: block.timestamp,
            submitter: msg.sender
        });

        emit AuditCheckpointed(caseIdHash, auditHead, eventCount, block.timestamp, msg.sender);
    }

    // ================================================================
    // 3. AI MODEL PROVENANCE REGISTRY
    // ================================================================

    struct ModelRecord {
        bytes32 datasetHash;    // SHA-256 of sorted training edge hashes
        bytes32 configHash;     // SHA-256 of hyperparameters + architecture JSON
        bytes32 versionHash;    // SHA-256 of version string
        uint256 timestamp;
        address submitter;
    }

    /// @notice modelHash (SHA-256 of model weights) => ModelRecord
    mapping(bytes32 => ModelRecord) public modelRegistry;

    event ModelRegistered(
        bytes32 indexed modelHash,
        bytes32 datasetHash,
        bytes32 configHash,
        bytes32 versionHash,
        uint256 timestamp,
        address indexed submitter
    );

    /**
     * @notice Register a trained ML model's provenance fingerprints.
     * @param modelHash   SHA-256 of the model weights file
     * @param datasetHash SHA-256 of the training dataset fingerprint
     * @param configHash  SHA-256 of the training configuration
     * @param versionHash SHA-256 of the model version string
     */
    function registerModel(
        bytes32 modelHash,
        bytes32 datasetHash,
        bytes32 configHash,
        bytes32 versionHash
    ) external onlyOwner {
        modelRegistry[modelHash] = ModelRecord({
            datasetHash: datasetHash,
            configHash: configHash,
            versionHash: versionHash,
            timestamp: block.timestamp,
            submitter: msg.sender
        });

        emit ModelRegistered(modelHash, datasetHash, configHash, versionHash, block.timestamp, msg.sender);
    }

    // ================================================================
    // 4. CASE VAULT ANCHORING
    // ================================================================

    struct VaultAnchor {
        bytes32 vaultRoot;      // Merkle root of all case vault component hashes
        uint256 timestamp;
        address submitter;
    }

    mapping(bytes32 => VaultAnchor) public vaultAnchors;

    event VaultAnchored(
        bytes32 indexed caseIdHash,
        bytes32 vaultRoot,
        uint256 timestamp,
        address indexed submitter
    );

    /**
     * @notice Anchor a case vault export's Merkle root.
     * @param caseIdHash SHA-256 hash of the case ID
     * @param vaultRoot  Merkle root of evidence hashes + graph hash + audit hash + model hash
     */
    function anchorVault(
        bytes32 caseIdHash,
        bytes32 vaultRoot
    ) external onlyOwner {
        vaultAnchors[caseIdHash] = VaultAnchor({
            vaultRoot: vaultRoot,
            timestamp: block.timestamp,
            submitter: msg.sender
        });

        emit VaultAnchored(caseIdHash, vaultRoot, block.timestamp, msg.sender);
    }

    // ================================================================
    // 5. ENTITY MERGE REGISTRY
    // ================================================================

    struct MergeRecord {
        bytes32 mergedEntity;   // SHA-256 hash of the merged (removed) entity ID
        bytes32 decisionHash;   // SHA-256(primaryId + mergedId + investigator + timestamp + reasons)
        uint256 timestamp;
        address submitter;
    }

    /// @notice primaryEntityHash => MergeRecord (latest merge into that entity)
    mapping(bytes32 => MergeRecord) public mergeRegistry;

    /// @notice Total merge count for audit purposes
    uint256 public totalMerges;

    event EntityMergeRecorded(
        bytes32 indexed primaryEntity,
        bytes32 mergedEntity,
        bytes32 decisionHash,
        uint256 timestamp,
        address indexed submitter
    );

    /**
     * @notice Record an irreversible entity-resolution merge decision.
     * @param primaryEntity SHA-256 hash of the surviving entity ID
     * @param mergedEntity  SHA-256 hash of the removed/merged entity ID
     * @param decisionHash  SHA-256 of the full decision payload (who, why, when)
     */
    function recordEntityMerge(
        bytes32 primaryEntity,
        bytes32 mergedEntity,
        bytes32 decisionHash
    ) external onlyOwner {
        mergeRegistry[primaryEntity] = MergeRecord({
            mergedEntity: mergedEntity,
            decisionHash: decisionHash,
            timestamp: block.timestamp,
            submitter: msg.sender
        });

        totalMerges += 1;

        emit EntityMergeRecorded(primaryEntity, mergedEntity, decisionHash, block.timestamp, msg.sender);
    }
}
