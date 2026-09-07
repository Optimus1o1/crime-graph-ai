-- ============================================================
-- CrimeGraph AI — Supabase Database Architecture Schema
-- Execute in Supabase SQL Editor to provision tables & RLS
-- ============================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Investigators & User Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    agency TEXT DEFAULT 'Central Cyber Crime Police Station',
    badge_id TEXT UNIQUE,
    clearance_tier TEXT DEFAULT 'LEVEL 2 — CONFIDENTIAL',
    role TEXT DEFAULT 'INVESTIGATOR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Investigation Cases
CREATE TABLE IF NOT EXISTS public.cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'ACTIVE_INVESTIGATION',
    jurisdiction TEXT NOT NULL,
    section_law TEXT,
    lead_investigator_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Graph Entities (367+ nodes)
CREATE TABLE IF NOT EXISTS public.graph_entities (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    entity_type TEXT NOT NULL, -- Person, Phone, Account, Vehicle, Case
    community_id INTEGER DEFAULT 0,
    risk_level TEXT DEFAULT 'LOW',
    betweenness_score NUMERIC(6, 4) DEFAULT 0.0000,
    properties JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Graph Relationships (1,201+ edges)
CREATE TABLE IF NOT EXISTS public.graph_relationships (
    id TEXT PRIMARY KEY,
    source TEXT NOT NULL REFERENCES public.graph_entities(id) ON DELETE CASCADE,
    target TEXT NOT NULL REFERENCES public.graph_entities(id) ON DELETE CASCADE,
    relation_type TEXT NOT NULL, -- CALLED, TRANSFER, OWNS, NAMED_IN
    amount NUMERIC(12, 2),
    timestamp TEXT,
    evidence_id TEXT,
    confidence NUMERIC(4, 2) DEFAULT 1.00,
    is_predicted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tamper-Proof Security Audit Trail
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id TEXT NOT NULL,
    action_type TEXT NOT NULL, -- INSPECT_NODE, MERGE_ENTITY, PREDICT_LINKS, VAULT_EXPORT
    target_entity TEXT,
    ip_address TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for sub-millisecond query execution
CREATE INDEX IF NOT EXISTS idx_entities_type ON public.graph_entities(entity_type);
CREATE INDEX IF NOT EXISTS idx_entities_community ON public.graph_entities(community_id);
CREATE INDEX IF NOT EXISTS idx_relationships_source ON public.graph_relationships(source);
CREATE INDEX IF NOT EXISTS idx_relationships_target ON public.graph_relationships(target);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.security_audit_logs(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.graph_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.graph_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Read & Write Policies for Platform Operations
DROP POLICY IF EXISTS "Allow authenticated investigators to read entities" ON public.graph_entities;
DROP POLICY IF EXISTS "Allow authenticated investigators to read relationships" ON public.graph_relationships;
DROP POLICY IF EXISTS "Allow authenticated investigators to read cases" ON public.cases;

CREATE POLICY "Allow all read entities" ON public.graph_entities FOR SELECT USING (true);
CREATE POLICY "Allow all insert entities" ON public.graph_entities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update entities" ON public.graph_entities FOR UPDATE USING (true);

CREATE POLICY "Allow all read relationships" ON public.graph_relationships FOR SELECT USING (true);
CREATE POLICY "Allow all insert relationships" ON public.graph_relationships FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update relationships" ON public.graph_relationships FOR UPDATE USING (true);

CREATE POLICY "Allow all read cases" ON public.cases FOR SELECT USING (true);
CREATE POLICY "Allow all insert cases" ON public.cases FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow all insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update profiles" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Allow all read audit_logs" ON public.security_audit_logs FOR SELECT USING (true);
CREATE POLICY "Allow all insert audit_logs" ON public.security_audit_logs FOR INSERT WITH CHECK (true);

-- ============================================================
-- 7. Initial Demo Dataset Seeding (Execute once)
-- ============================================================

-- Seed Cases
INSERT INTO public.cases (case_number, title, status, jurisdiction, section_law) VALUES
('FIR-1042/2025', 'Operation Falcon Syndicate - Multi-State Hawala', 'ACTIVE_INVESTIGATION', 'Bengaluru Central', 'IPC 420, 120B, 384; IT Act 66D'),
('FIR-2087/2025', 'Cyber Laundering Ring 404 & SIM Box Extortion', 'ACTIVE_INVESTIGATION', 'Mumbai Cyber Cell', 'IT Act 66C, 66D; PMLA Sec 3'),
('FIR-0311/2026', 'Coastal Contraband Logistics Nexus (Western Corridor)', 'UNDER_SURVEILLANCE', 'Delhi EOW & Narcotics Cell', 'NDPS Act 8(c), 20(b), 27A'),
('FIR-0450/2026', 'Darknet Crypto Escrow & Clandestine Settlement', 'IN_COURT_TRIAL', 'Financial Intelligence Unit (FIU)', 'PMLA Sec 3, 4; FEMA Sec 13')
ON CONFLICT (case_number) DO NOTHING;

-- Seed Key Criminal & Financial Entities
INSERT INTO public.graph_entities (id, label, entity_type, community_id, risk_level, betweenness_score, properties) VALUES
('S-201', 'Sayed Al-Hassan Khan', 'Person', 1, 'CRITICAL', 0.8420, '{"role": "Syndicate Kingpin", "rating": "94%", "fingerprints": "MATCH_SEC_8", "location": "Chandni Chowk, DL"}'::jsonb),
('S-109', 'Amit Verma', 'Person', 1, 'CRITICAL', 0.6840, '{"role": "Financial Operator", "rating": "89%"}'::jsonb),
('S-127', 'Viktor Rao', 'Person', 2, 'HIGH', 0.5210, '{"role": "Crypto Conduit", "rating": "62%"}'::jsonb),
('S-044', 'Rahul Kumar (RK)', 'Person', 1, 'HIGH', 0.4900, '{"role": "Mule Handler", "rating": "76%"}'::jsonb),
('S-312', 'Agent James Vance', 'Person', 3, 'LOW', 0.1200, '{"role": "Undercover Broker", "rating": "48%"}'::jsonb),
('CORP_X', 'Falcon International Holdings FZE', 'Company', 2, 'CRITICAL', 0.6500, '{"jurisdiction": "Dubai", "entity_class": "Shell Holding"}'::jsonb),
('CORP_Z', 'CORP_Z Shell Subsidiary Ltd', 'Company', 2, 'HIGH', 0.5100, '{"jurisdiction": "Mauritius", "entity_class": "Front Company"}'::jsonb),
('CELL-827', 'Burner IMEI-84710 (CELL-827)', 'Phone', 1, 'HIGH', 0.4400, '{"status": "ACTIVE", "carrier": "Airtel Delhi", "imsi": "40445-88291"}'::jsonb),
('AC-CORE-101', 'Primary Hawala Pool #101', 'Account', 1, 'CRITICAL', 0.7200, '{"bank": "HDFC Escrow", "account_no": "0029-1928-8812"}'::jsonb),
('AC-MULE-201', 'Transit Mule Account #201', 'Account', 1, 'HIGH', 0.5800, '{"bank": "ICICI Mule", "account_no": "9921-3310-4491"}'::jsonb),
('AC-OFFSHORE-501', 'Offshore Treasury Shell #501', 'Account', 2, 'CRITICAL', 0.8100, '{"bank": "Emirates NBD", "account_no": "AE-88-0029-441"}'::jsonb),
('VEH-DL4C', 'Toyota Fortuner (DL 4C AB 1234)', 'Vehicle', 1, 'HIGH', 0.3500, '{"color": "Dark Grey", "model": "2022", "owner": "Sayed Al-Hassan Khan"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Seed Network Interconnection Relationships
INSERT INTO public.graph_relationships (id, source, target, relation_type, amount, confidence, is_predicted) VALUES
('REL-001', 'S-201', 'AC-CORE-101', 'OWNS', 0, 1.00, false),
('REL-002', 'AC-CORE-101', 'AC-MULE-201', 'TRANSFER', 950000, 1.00, false),
('REL-003', 'S-109', 'AC-OFFSHORE-501', 'TRANSFER', 1200000, 0.98, false),
('REL-004', 'S-201', 'S-127', 'POTENTIAL_COORDINATION', 0, 0.94, true),
('REL-005', 'S-201', 'CELL-827', 'OPERATES', 0, 0.99, false),
('REL-006', 'S-201', 'VEH-DL4C', 'REGISTERED_TO', 0, 0.98, false),
('REL-007', 'S-044', 'S-201', 'CDR_ASSOCIATION', 0, 0.88, false),
('REL-008', 'CORP_X', 'CORP_Z', 'BENEFICIAL_OWNERSHIP', 450000, 0.96, false)
ON CONFLICT (id) DO NOTHING;

