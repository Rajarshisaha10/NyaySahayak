import React, { useState, useEffect } from 'react';
import { ShieldCheck, Scale, FileText, CheckCircle2, AlertTriangle, Layers, Search } from 'lucide-react';
import { CaseUpload } from './components/CaseUpload';
import { DocumentViewer } from './components/DocumentViewer';
import { CitationBadge } from './components/CitationBadge';
import { CorpusWhitelistView } from './components/CorpusWhitelistView';

interface CitationReport {
  citation_id: string;
  raw_citation: string;
  overall_status: 'VERIFIED' | 'PARTIAL' | 'CONTESTED' | 'UNVERIFIED';
  existence_check: { passed: boolean; details: string };
  identity_check: { passed: boolean; details: string };
  source_check: { passed: boolean; details: string };
  quotation_check: { passed: boolean; details: string };
  proposition_check: { passed: boolean; details: string };
  trace_check: { passed: boolean; details: string };
}

export default function App() {
  const [activeCaseId, setActiveCaseId] = useState<string>('case_demo_001');
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  
  // Verification Tester state
  const [testCitation, setTestCitation] = useState('Kesavananda Bharati v. State of Kerala, (1973) 4 SCC 225');
  const [testQuote, setTestQuote] = useState('Basic structure of the Constitution cannot be amended.');
  const [testSource, setTestSource] = useState('The basic structure of the Constitution of India cannot be altered or damaged by constitutional amendment.');
  const [verifying, setVerifying] = useState(false);
  const [verificationReport, setVerificationReport] = useState<CitationReport | null>(null);

  // Initialize Demo Case
  useEffect(() => {
    fetch(`/api/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 'counsel_demo',
        title: 'State of Kerala v. Constitutional Amendments (Demo)',
        case_number: 'WP(C) 135/1973',
        court_type: 'Supreme Court of India',
        description: 'Constitutional validity demo workspace'
      })
    })
      .then(res => res.json())
      .then(data => setActiveCaseId(data.id))
      .catch(() => {});
  }, []);

  const handleUploadSuccess = (docData: any) => {
    setDocuments(prev => [docData, ...prev]);
    setSelectedDoc(docData);
  };

  const handleRunVerification = async () => {
    setVerifying(true);
    try {
      const res = await fetch('/api/verification/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case_id: activeCaseId,
          citation_text: testCitation,
          quoted_text: testQuote,
          source_passage: testSource,
          document_id: selectedDoc?.id || 'doc_sc_1973',
          page_number: 45
        })
      });
      const data = await res.json();
      setVerificationReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo-group">
          <div className="logo-badge">NYAY</div>
          <div>
            <div className="logo-title">NyaySahayak</div>
            <div className="subtitle">Verified Multi-Agent AI for Courtroom Preparation</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="provenance-tag">
            <Scale size={12} style={{ display: 'inline', marginRight: '4px' }} />
            4-Person Engineering Architecture
          </span>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="main-content">
        {/* Phase Banner */}
        <div className="phase-banner">
          <div>
            <span className="phase-tag">Phase 0 — Weeks 0 to 2 Active</span>
            <h2 style={{ fontSize: '1.1rem', marginTop: '0.2rem' }}>
              Foundation, Legal Corpus Spec & Page-Preserving Ingestion
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Architecture-Driven Trust: Establishing the 6-Check Citation Verification Protocol and page-number traceable document parsing before AI agent deployment.
            </p>
          </div>
          <button className="btn btn-primary" onClick={handleRunVerification} disabled={verifying}>
            <ShieldCheck size={16} /> Run Citation Check
          </button>
        </div>

        {/* Workspace Layout */}
        <div className="two-column-grid">
          {/* Left Column: Upload & Citation Verification Playground */}
          <div style={{ display: 'flex', flexDirect: 'column', gap: '1.5rem' }}>
            <CaseUpload caseId={activeCaseId} onUploadSuccess={handleUploadSuccess} />

            {/* Citation Tester Card */}
            <div className="card">
              <h3 className="card-title">
                <ShieldCheck size={18} style={{ color: 'var(--accent-teal)' }} /> 6-Check Citation Verification Tester
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1rem' }}>
                Test legal citations against the 6 mandatory checks (*Existence, Identity, Source, Quotation, Proposition, Trace*).
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Legal Citation</label>
                  <input
                    type="text"
                    value={testCitation}
                    onChange={(e) => setTestCitation(e.target.value)}
                    style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Quoted Argument Text</label>
                  <input
                    type="text"
                    value={testQuote}
                    onChange={(e) => setTestQuote(e.target.value)}
                    style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Retrieved Source Passage</label>
                  <textarea
                    rows={2}
                    value={testSource}
                    onChange={(e) => setTestSource(e.target.value)}
                    style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                </div>

                <button className="btn btn-primary" onClick={handleRunVerification} disabled={verifying} style={{ marginTop: '0.5rem' }}>
                  {verifying ? 'Running 6 Verification Checks...' : 'Verify Citation'}
                </button>
              </div>

              {/* Verification Report Display */}
              {verificationReport && (
                <div className="verification-panel">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Verification Result:</span>
                    <CitationBadge status={verificationReport.overall_status} />
                  </div>

                  <div className="check-item">
                    <div>
                      <div className="check-title">1. Existence Check</div>
                      <div className="check-details">{verificationReport.existence_check.details}</div>
                    </div>
                    <span style={{ color: verificationReport.existence_check.passed ? 'var(--status-verified)' : 'var(--status-contested)', fontWeight: 600, fontSize: '0.8rem' }}>
                      {verificationReport.existence_check.passed ? 'PASS' : 'FAIL'}
                    </span>
                  </div>

                  <div className="check-item">
                    <div>
                      <div className="check-title">2. Identity Check</div>
                      <div className="check-details">{verificationReport.identity_check.details}</div>
                    </div>
                    <span style={{ color: verificationReport.identity_check.passed ? 'var(--status-verified)' : 'var(--status-contested)', fontWeight: 600, fontSize: '0.8rem' }}>
                      {verificationReport.identity_check.passed ? 'PASS' : 'FAIL'}
                    </span>
                  </div>

                  <div className="check-item">
                    <div>
                      <div className="check-title">3. Source Check</div>
                      <div className="check-details">{verificationReport.source_check.details}</div>
                    </div>
                    <span style={{ color: verificationReport.source_check.passed ? 'var(--status-verified)' : 'var(--status-contested)', fontWeight: 600, fontSize: '0.8rem' }}>
                      {verificationReport.source_check.passed ? 'PASS' : 'FAIL'}
                    </span>
                  </div>

                  <div className="check-item">
                    <div>
                      <div className="check-title">4. Quotation Check</div>
                      <div className="check-details">{verificationReport.quotation_check.details}</div>
                    </div>
                    <span style={{ color: verificationReport.quotation_check.passed ? 'var(--status-verified)' : 'var(--status-contested)', fontWeight: 600, fontSize: '0.8rem' }}>
                      {verificationReport.quotation_check.passed ? 'PASS' : 'FAIL'}
                    </span>
                  </div>

                  <div className="check-item">
                    <div>
                      <div className="check-title">5. Proposition Check</div>
                      <div className="check-details">{verificationReport.proposition_check.details}</div>
                    </div>
                    <span style={{ color: verificationReport.proposition_check.passed ? 'var(--status-verified)' : 'var(--status-contested)', fontWeight: 600, fontSize: '0.8rem' }}>
                      {verificationReport.proposition_check.passed ? 'PASS' : 'FAIL'}
                    </span>
                  </div>

                  <div className="check-item">
                    <div>
                      <div className="check-title">6. Trace Check</div>
                      <div className="check-details">{verificationReport.trace_check.details}</div>
                    </div>
                    <span style={{ color: verificationReport.trace_check.passed ? 'var(--status-verified)' : 'var(--status-contested)', fontWeight: 600, fontSize: '0.8rem' }}>
                      {verificationReport.trace_check.passed ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Page-Preserving Document Viewer */}
          <div>
            <DocumentViewer document={selectedDoc} />
          </div>
        </div>

        {/* Whitelisted Legal Authorities Footer Section */}
        <CorpusWhitelistView />
      </main>
    </div>
  );
}
