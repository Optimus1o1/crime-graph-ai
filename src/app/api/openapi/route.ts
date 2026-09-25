import { NextResponse } from 'next/server'

export async function GET() {
  const openApiSpec = {
    openapi: '3.0.3',
    info: {
      title: 'CrimeGraph AI — Investigative Intelligence Platform API',
      version: '2.1.0',
      description: `
**CrimeGraph AI Enterprise API Engine** provides high-throughput criminal network topology analysis, Graph Neural Network (GNN) link forecasting, live ANPR camera telemetry correlation, cryptographic chain-of-custody evidence anchoring, and explainable AI investigative co-piloting.

### Core Capabilities:
- **Graph Topology & Centrality**: Dual shortest-path computation (evidentiary vs. corroborating), Louvain-style community detection, and betweenness centrality ranking to expose syndicate ringleaders and hidden financial mules.
- **Neural & GNN Predictions**: GraphSAGE link prediction, transductive embedding inference, and counterfactual influence scoring.
- **Surveillance & ANPR Telemetry**: Real-time license plate OCR correlation, trajectory interpolation, and metropolitan digital twin road heatmaps.
- **Forensic Evidence & Blockchain**: SHA-256 hash chains, cryptographic Merkle tree audit trails, and court-admissible custody checkpoints.
- **Controlled Copilot Orchestration**: Multi-step natural language reasoning with strict zero-hallucination verification against evidentiary graph nodes.
      `,
      contact: {
        name: 'Central Cyber Crime Police Station (CCPS) & CrimeGraph AI Engineering',
        email: 'ops@crimegraph.gov.in',
        url: 'https://crimegraph.gov.in'
      },
      license: {
        name: 'Proprietary — Law Enforcement Intelligence Restricted',
        url: 'https://crimegraph.gov.in/terms'
      }
    },
    servers: [
      {
        url: '/api',
        description: 'Next.js Unified Edge API Gateway'
      },
      {
        url: 'http://127.0.0.1:8000',
        description: 'CrimeGraph Python Core Engine (FastAPI / NetworkX / PyTorch-Geometric)'
      }
    ],
    tags: [
      { name: 'System & Health', description: 'API health checks, database status, and cluster telemetry' },
      { name: 'Graph Intelligence', description: 'Network topology, betweenness centrality, community clusters, and dual path tracing' },
      { name: 'Neural & GNN Predictions', description: 'Graph Neural Network link prediction, anomalies, and model explainability' },
      { name: 'Cyber Threat Radar', description: 'Real-time threat incidents, telemetry metrics, connectors, and tactical actions' },
      { name: 'Forensic Audit & Blockchain', description: 'SHA-256 hash chains, Merkle verification, and immutable custody proof' },
      { name: 'Surveillance & ANPR', description: 'CCTV feed metadata, ANPR vehicle matches, road sensors, and traffic velocity' },
      { name: 'Entity Resolution', description: 'Fuzzy entity matching, duplicate identity detection, and officer merge workflows' },
      { name: 'Cases & Dossiers', description: 'Case management, suspect dossiers, and evidentiary attachments' },
      { name: 'AI Copilot', description: 'Natural language investigation assistant with tool orchestration' }
    ],
    paths: {
      '/health': {
        get: {
          tags: ['System & Health'],
          summary: 'Platform Health & Diagnostic Telemetry',
          description: 'Returns real-time status of the graph database, loaded nodes, edge counts, active cases, and evidence items.',
          responses: {
            '200': {
              description: 'System healthy and operational',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'healthy' },
                      service: { type: 'string', example: 'CrimeGraph AI Enterprise' },
                      nodes: { type: 'integer', example: 112 },
                      edges: { type: 'integer', example: 340 },
                      cases: { type: 'integer', example: 47 },
                      evidence_items: { type: 'integer', example: 184 }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/graph': {
        get: {
          tags: ['Graph Intelligence'],
          summary: 'Retrieve Network Graph Topology',
          description: 'Fetches all nodes and edges in the criminal knowledge graph, optionally scoped to a specific investigation case.',
          parameters: [
            {
              name: 'case_id',
              in: 'query',
              required: false,
              description: 'Optional case identifier to filter graph elements (e.g. `CASE-2026-0847`)',
              schema: { type: 'string' }
            }
          ],
          responses: {
            '200': {
              description: 'Graph nodes, edges, and high-level topology statistics',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      nodes: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', example: 'P001' },
                            label: { type: 'string', example: 'Sayed Khan' },
                            type: { type: 'string', example: 'suspect' },
                            comm: { type: 'string', example: 'Syndicate Core' },
                            risk: { type: 'string', example: 'HIGH' },
                            degree: { type: 'integer', example: 18 },
                            betweenness: { type: 'number', example: 0.384 }
                          }
                        }
                      },
                      edges: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', example: 'E042' },
                            source: { type: 'string', example: 'P001' },
                            target: { type: 'string', example: 'P014' },
                            kind: { type: 'string', example: 'financial_transfer' },
                            label: { type: 'string', example: 'Hawala Transfer ₹2.4M' }
                          }
                        }
                      },
                      stats: {
                        type: 'object',
                        properties: {
                          total_nodes: { type: 'integer', example: 112 },
                          total_edges: { type: 'integer', example: 340 },
                          communities: { type: 'integer', example: 5 }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/path': {
        get: {
          tags: ['Graph Intelligence'],
          summary: 'Trace Dual Evidentiary & Corroborating Paths',
          description: 'Calculates the primary evidentiary shortest path between two nodes, along with an independent corroborating path avoiding the primary bridge.',
          parameters: [
            {
              name: 'from',
              in: 'query',
              required: true,
              description: 'Source node identifier (e.g. `P001`)',
              schema: { type: 'string' }
            },
            {
              name: 'to',
              in: 'query',
              required: true,
              description: 'Target node identifier (e.g. `V003` or `P018`)',
              schema: { type: 'string' }
            }
          ],
          responses: {
            '200': {
              description: 'Shortest path and corroborating independent path',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      shortest: { type: 'array', items: { type: 'object' } },
                      corroborating: { type: 'array', items: { type: 'object' } },
                      distinct: { type: 'boolean', example: true }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/centrality': {
        get: {
          tags: ['Graph Intelligence'],
          summary: 'Compute Betweenness & Degree Centrality',
          description: 'Ranks all nodes by network betweenness centrality to isolate syndicate masterminds and low-visibility coordinators.',
          responses: {
            '200': {
              description: 'Ranked list of entities with centrality metrics and suspicion score',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        label: { type: 'string' },
                        degree: { type: 'integer' },
                        betweenness: { type: 'number' },
                        betweenness_rank: { type: 'integer' },
                        coordinator_score: { type: 'number' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/predictions': {
        get: {
          tags: ['Neural & GNN Predictions'],
          summary: 'GNN Link Predictions & Hidden Associations',
          description: 'Retrieves topological link prediction scores generated by the GraphSAGE neural network model.',
          responses: {
            '200': {
              description: 'Predicted high-probability edges with evidence and shared neighbors',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        source: { type: 'string' },
                        target: { type: 'string' },
                        source_label: { type: 'string' },
                        target_label: { type: 'string' },
                        probability: { type: 'number', example: 0.942 },
                        common_neighbors: { type: 'array', items: { type: 'string' } },
                        evidence: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/anomalies': {
        get: {
          tags: ['Neural & GNN Predictions'],
          summary: 'Detect Behavioral & Structuring Anomalies',
          description: 'Evaluates network nodes against heuristic and machine-learning anomaly detectors (e.g. mule account structuring, burner phone clustering).',
          responses: {
            '200': {
              description: 'Identified anomalies and risk flags',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        node: { type: 'string' },
                        type: { type: 'string', example: 'mule_structuring' },
                        score: { type: 'number', example: 0.88 },
                        reason: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/investigations/radar': {
        get: {
          tags: ['Cyber Threat Radar'],
          summary: 'Live Tactical Radar Threat Incidents',
          description: 'Fetches active high-priority radar telemetry incidents across geographical and financial sectors.',
          parameters: [
            {
              name: 'range',
              in: 'query',
              required: false,
              description: 'Temporal window for radar events (e.g. `1h`, `24h`, `1m`)',
              schema: { type: 'string', default: '1m' }
            }
          ],
          responses: {
            '200': {
              description: 'Radar incidents array',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        severity: { type: 'string', example: 'CRITICAL' },
                        category: { type: 'string' },
                        timestamp: { type: 'string' },
                        location: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/investigations/metrics': {
        get: {
          tags: ['Cyber Threat Radar'],
          summary: 'Operational Dashboard Metrics',
          description: 'Returns real-time KPIs including active cases, monitored entities, resolved anomalies, and system uptime.',
          responses: {
            '200': {
              description: 'Key performance indicators'
            }
          }
        }
      },
      '/audit': {
        get: {
          tags: ['Forensic Audit & Blockchain'],
          summary: 'Retrieve Immutable SHA-256 Audit Log',
          description: 'Returns chronological chain-of-custody audit log where each event is cryptographically linked to the previous event hash.',
          responses: {
            '200': {
              description: 'Chain of custody audit ledger',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        timestamp: { type: 'string' },
                        action: { type: 'string' },
                        hash: { type: 'string', example: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
                        user: { type: 'string', example: 'ANALYST_KAHN' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/evidence/anchor': {
        post: {
          tags: ['Forensic Audit & Blockchain'],
          summary: 'Cryptographically Anchor Digital Evidence',
          description: 'Anchors a forensic evidence artifact into the cryptographic Merkle tree and generates an immutable custody receipt.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['evidence_id', 'case_id', 'file_hash', 'officer_badge'],
                  properties: {
                    evidence_id: { type: 'string', example: 'EVID-2026-991' },
                    case_id: { type: 'string', example: 'CASE-2026-0847' },
                    file_hash: { type: 'string', example: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4' },
                    officer_badge: { type: 'string', example: 'CCPS-8841-DL' }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Anchor confirmation with block hash and verification receipt'
            }
          }
        }
      },
      '/cameras': {
        get: {
          tags: ['Surveillance & ANPR'],
          summary: 'List Deployed CCTV & ANPR Cameras',
          description: 'Returns all metropolitan surveillance cameras, their operational status, coordinates, and live detection statistics.',
          responses: {
            '200': {
              description: 'List of optical and thermal camera feeds'
            }
          }
        }
      },
      '/entity-resolution/candidates': {
        get: {
          tags: ['Entity Resolution'],
          summary: 'Get Suspected Duplicate Entity Candidates',
          description: 'Executes fuzzy entity resolution algorithm across phone numbers, alias names, and bank accounts to find potential identity aliases.',
          responses: {
            '200': {
              description: 'Candidate match pairs with confidence score'
            }
          }
        }
      },
      '/entity-resolution/merge': {
        post: {
          tags: ['Entity Resolution'],
          summary: 'Officer Confirmed Entity Merge',
          description: 'Submits an officer-verified entity resolution action to merge duplicate criminal profiles into a unified master dossier.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['primary_id', 'secondary_id', 'reason', 'officer_badge'],
                  properties: {
                    primary_id: { type: 'string', example: 'P001' },
                    secondary_id: { type: 'string', example: 'P099' },
                    reason: { type: 'string', example: 'Identical Aadhaar & IMEI match confirmed via telecom subpoena' },
                    officer_badge: { type: 'string', example: 'CCPS-8841-DL' }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Merge operation outcome and new unified identity record'
            }
          }
        }
      },
      '/ai/copilot': {
        post: {
          tags: ['AI Copilot'],
          summary: 'Query Controlled AI Investigation Copilot',
          description: 'Sends investigative prompts to the zero-hallucination AI copilot with strict graph tool execution and court-admissible reasoning chains.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['query'],
                  properties: {
                    query: { type: 'string', example: 'Who is the coordinator connecting the hawala mule accounts to the Dubai syndicate?' },
                    case_id: { type: 'string', example: 'CASE-2026-0847' },
                    include_graph_context: { type: 'boolean', default: true }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: '7-part structured response with findings, evidentiary basis, and recommended actions'
            }
          }
        }
      }
    }
  }

  return NextResponse.json(openApiSpec, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}
