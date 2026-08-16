import React, { useEffect, useState } from 'react';
import { Database, ShieldCheck, ExternalLink } from 'lucide-react';

interface CorpusSource {
  id: string;
  name: string;
  authority_type: string;
  jurisdiction: string;
  court_name?: string;
  start_year: number;
  official_url: string;
  update_cadence: string;
  is_whitelisted: boolean;
}

export const CorpusWhitelistView: React.FC = () => {
  const [sources, setSources] = useState<CorpusSource[]>([]);

  useEffect(() => {
    fetch('/api/verification/corpus/whitelist')
      .then((res) => res.json())
      .then((data) => setSources(data))
      .catch((err) => console.error('Failed to load whitelist:', err));
  }, []);

  return (
    <div className="card" style={{ marginTop: '1.5rem' }}>
      <h3 className="card-title">
        <Database size={18} style={{ color: 'var(--accent-teal)' }} /> Whitelisted Legal Authority Sources
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
        Architecture-Driven Trust: NyaySahayak restricts legal verification exclusively to official, whitelisted authority repositories.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
        {sources.map((source) => (
          <div
            key={source.id}
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <strong style={{ fontSize: '0.88rem' }}>{source.name}</strong>
              <ShieldCheck size={16} style={{ color: 'var(--status-verified)' }} />
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              <span>Jurisdiction: {source.jurisdiction} ({source.start_year}–Present)</span>
              <span>Cadence: {source.update_cadence}</span>
              <a
                href={source.official_url}
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--accent-teal)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem' }}
              >
                Official Repository <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
