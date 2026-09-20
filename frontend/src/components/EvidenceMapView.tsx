import React from 'react';
import { ShieldCheck, FileCheck, AlertCircle, Link } from 'lucide-react';

export interface EvidenceItem {
  evidence_id: string;
  title: string;
  evidence_type: string;
  claim_supported: string;
  strength: 'STRONG' | 'MODERATE' | 'WEAK' | 'MISSING' | string;
  notes?: string;
  document_id: string;
  page_number: number;
  text_span: string;
}

interface EvidenceMapViewProps {
  evidenceMap: EvidenceItem[];
}

export const EvidenceMapView: React.FC<EvidenceMapViewProps> = ({ evidenceMap }) => {
  if (!evidenceMap || evidenceMap.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
        <ShieldCheck size={40} style={{ marginBottom: '1rem', opacity: 0.5, color: '#ffffff' }} />
        <h4 style={{ color: 'var(--text-secondary)' }}>No Evidence Items Mapped</h4>
        <p style={{ fontSize: '0.85rem' }}>Upload case material to generate the Evidence Map Graph.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
        <h3 className="card-title" style={{ marginBottom: 0 }}>
          <FileCheck size={18} style={{ color: '#ffffff' }} /> Evidence Map Graph ({evidenceMap.length} Items)
        </h3>
        <span className="provenance-tag">Claim $\rightarrow$ Evidence Links</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {evidenceMap.map((item) => {
          const isStrong = item.strength === 'STRONG';
          const isWeak = item.strength === 'WEAK' || item.strength === 'MISSING';

          return (
            <div key={item.evidence_id} style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem 1.15rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>{item.title}</strong>
                <span className={`badge badge-${isStrong ? 'VERIFIED' : isWeak ? 'CONTESTED' : 'PARTIAL'}`} style={{ fontSize: '0.68rem' }}>
                  {item.strength} STRENGTH
                </span>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Claim Supported:</strong> {item.claim_supported}
              </div>

              {item.notes && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontStyle: 'italic' }}>
                  Note: {item.notes}
                </div>
              )}

              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', borderTop: '1px dashed var(--border-color)', paddingTop: '0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Doc ID: {item.document_id.slice(0, 8)}...</span>
                <span className="provenance-tag">Page {item.page_number}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
