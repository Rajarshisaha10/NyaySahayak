import React, { useState } from 'react';
import { Layers, FileText, Scale, Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';
import { TimelineViewer, TimelineEvent } from './TimelineViewer';
import { EvidenceMapView, EvidenceItem } from './EvidenceMapView';

export interface FactItem {
  fact_id: string;
  category: string;
  description: string;
  date_context?: string;
  parties_involved: string[];
  document_id: string;
  page_number: number;
  text_span: string;
  confidence: number;
}

export interface LegalIssue {
  issue_id: string;
  title: string;
  question_text: string;
  governing_statutes: string[];
}

export interface CaseParty {
  name: string;
  role: string;
}

export interface CaseGraph {
  version: string;
  case_id: string;
  case_title: string;
  court_type: string;
  parties: CaseParty[];
  facts: FactItem[];
  timeline: TimelineEvent[];
  evidence_map: EvidenceItem[];
  legal_issues: LegalIssue[];
  summary?: string;
  created_at?: string;
}

interface CaseGraphDashboardProps {
  caseGraph: CaseGraph | null;
  onGenerateGraph: () => void;
  loading: boolean;
}

export const CaseGraphDashboard: React.FC<CaseGraphDashboardProps> = ({ caseGraph, onGenerateGraph, loading }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'facts' | 'timeline' | 'evidence' | 'issues'>('overview');

      if (!caseGraph) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-muted)' }}>
        <Layers size={44} style={{ marginBottom: '1rem', opacity: 0.5, color: '#ffffff' }} />
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Master Case Graph Not Generated</h3>
        <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem', maxWidth: '500px', margin: '0 auto 1.25rem' }}>
          Phase 2 extracts structured Facts, Chronological Timeline, Evidence Maps, and Grounded Legal Issues into a unified Case Graph context.
        </p>
        <button className="btn btn-primary" onClick={onGenerateGraph} disabled={loading}>
          <Sparkles size={16} /> {loading ? 'Compiling Master Case Graph...' : 'Generate Master Case Graph'}
        </button>
      </div>
    );
  }

  return (
    <div className="card document-viewer">
      {/* Case Graph Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <h3 className="card-title" style={{ marginBottom: '0.2rem' }}>
            <Layers size={18} style={{ color: '#ffffff' }} /> {caseGraph.case_title}
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Court: {caseGraph.court_type} • Version {caseGraph.version} • Created: {caseGraph.created_at ? new Date(caseGraph.created_at).toLocaleTimeString() : 'Just now'}
          </span>
        </div>
        <button className="btn btn-primary" onClick={onGenerateGraph} disabled={loading} style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}>
          <Sparkles size={14} /> Re-Compile Graph
        </button>
      </div>

      {/* Case Graph Tab Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button className={`btn ${activeTab === 'overview' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('overview')} style={{ fontSize: '0.78rem', padding: '0.3rem 0.7rem' }}>
          Overview
        </button>
        <button className={`btn ${activeTab === 'facts' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('facts')} style={{ fontSize: '0.78rem', padding: '0.3rem 0.7rem' }}>
          Facts ({caseGraph.facts.length})
        </button>
        <button className={`btn ${activeTab === 'timeline' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('timeline')} style={{ fontSize: '0.78rem', padding: '0.3rem 0.7rem' }}>
          Timeline ({caseGraph.timeline.length})
        </button>
        <button className={`btn ${activeTab === 'evidence' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('evidence')} style={{ fontSize: '0.78rem', padding: '0.3rem 0.7rem' }}>
          Evidence ({caseGraph.evidence_map.length})
        </button>
        <button className={`btn ${activeTab === 'issues' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('issues')} style={{ fontSize: '0.78rem', padding: '0.3rem 0.7rem' }}>
          Issues ({caseGraph.legal_issues.length})
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ marginTop: '0.5rem', maxHeight: '550px', overflowY: 'auto' }}>
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#ffffff', marginBottom: '0.4rem' }}>Executive Case Graph Summary</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{caseGraph.summary}</p>
            </div>

            {/* Parties */}
            <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Identified Legal Parties & Roles</h4>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {caseGraph.parties.map((p, idx) => (
                  <div key={idx} style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '0.5rem 0.8rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{p.name}</strong> <span style={{ color: 'var(--text-muted)', marginLeft: '0.3rem' }}>({p.role})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'facts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {caseGraph.facts.map((fact) => (
              <div key={fact.fact_id} style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span className="provenance-tag" style={{ textTransform: 'uppercase' }}>{fact.category}</span>
                  <span className="provenance-tag">Page {fact.page_number}</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>{fact.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'timeline' && <TimelineViewer events={caseGraph.timeline} />}

        {activeTab === 'evidence' && <EvidenceMapView evidenceMap={caseGraph.evidence_map} />}

        {activeTab === 'issues' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {caseGraph.legal_issues.map((issue) => (
              <div key={issue.issue_id} style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#ffffff', marginBottom: '0.4rem' }}>{issue.title}</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{issue.question_text}</p>
                {issue.governing_statutes && issue.governing_statutes.length > 0 && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Statutes: {issue.governing_statutes.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
