import React, { useState } from 'react';
import { BookOpen, FileText, Scan, Sparkles, AlertCircle, Filter } from 'lucide-react';

interface Chunk {
  id: string;
  page_number: number;
  chunk_index: number;
  text_content: string;
  language: string;
  script_type?: string;
  ocr_applied?: boolean;
  extraction_confidence: number;
  provenance?: {
    source_type: string;
    document_id: string;
    page: number;
    text_span: string;
    language: string;
    script_type?: string;
    ocr_applied?: boolean;
    extraction_confidence: number;
  };
}

interface DocumentViewerProps {
  document: {
    id: string;
    filename: string;
    page_count: number;
    detected_languages: string;
    chunks?: Chunk[];
  } | null;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ document }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  if (!document) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-muted)' }}>
        <BookOpen size={40} style={{ marginBottom: '1rem', opacity: 0.5, color: '#ffffff' }} />
        <h4 style={{ color: 'var(--text-secondary)' }}>No Document Selected</h4>
        <p style={{ fontSize: '0.85rem' }}>Upload a legal case filing (PDF/DOCX/TXT) to view page-preserved text chunks, OCR status, and provenance metadata.</p>
      </div>
    );
  }

  const chunks = document.chunks || [];
  const filteredChunks = chunks.filter((c) => {
    if (selectedFilter === 'hi') return c.language === 'hi' || (c.script_type && c.script_type.includes('devanagari'));
    if (selectedFilter === 'ta') return c.language === 'ta' || (c.script_type && c.script_type.includes('tamil'));
    if (selectedFilter === 'ocr') return c.ocr_applied;
    return true;
  });

  return (
    <div className="card document-viewer">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <h3 className="card-title" style={{ marginBottom: '0.2rem' }}>
            <FileText size={18} style={{ color: '#ffffff' }} /> {document.filename}
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {document.page_count} Page(s) Preserved • Languages: {document.detected_languages.toUpperCase()}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span className="provenance-tag">Gate G1 Verified</span>
        </div>
      </div>

      {/* Script & OCR Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.8rem', flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Filter size={14} /> Filter:
        </span>
        <button
          className={`btn ${selectedFilter === 'all' ? 'btn-primary' : ''}`}
          onClick={() => setSelectedFilter('all')}
          style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
        >
          All ({chunks.length})
        </button>
        <button
          className={`btn ${selectedFilter === 'hi' ? 'btn-primary' : ''}`}
          onClick={() => setSelectedFilter('hi')}
          style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
        >
          Hindi (हिन्दी)
        </button>
        <button
          className={`btn ${selectedFilter === 'ta' ? 'btn-primary' : ''}`}
          onClick={() => setSelectedFilter('ta')}
          style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
        >
          Tamil (தமிழ்)
        </button>
        <button
          className={`btn ${selectedFilter === 'ocr' ? 'btn-primary' : ''}`}
          onClick={() => setSelectedFilter('ocr')}
          style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
        >
          OCR Applied
        </button>
      </div>

      {/* Chunks List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.25rem' }}>
        {filteredChunks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No chunks found matching current filter filter criteria.
          </div>
        ) : (
          filteredChunks.map((chunk, idx) => {
            const isOcr = chunk.ocr_applied;
            const isLowConfidence = chunk.extraction_confidence < 0.7;

            return (
              <div
                key={chunk.id || idx}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                {/* Chunk Top Metadata */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      Page {chunk.page_number}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      (Chunk #{chunk.chunk_index + 1})
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {isOcr ? (
                      <span className="badge badge-PARTIAL" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                        <Scan size={10} /> OCR APPLIED
                      </span>
                    ) : (
                      <span className="badge badge-VERIFIED" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                        <Sparkles size={10} /> NATIVE TEXT
                      </span>
                    )}

                    {chunk.script_type && (
                      <span className="provenance-tag">
                        {chunk.script_type.toUpperCase()}
                      </span>
                    )}

                    <span className="mono-text" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {(chunk.extraction_confidence * 100).toFixed(0)}% Conf
                    </span>
                  </div>
                </div>

                {/* Text Content */}
                <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>
                  {chunk.text_content}
                </p>

                {/* Low Confidence Warning */}
                {isLowConfidence && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--status-contested)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                    <AlertCircle size={12} /> Low confidence extraction. Human advocate verification recommended.
                  </div>
                )}

                {/* Provenance Footer */}
                {chunk.provenance && (
                  <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '0.35rem', marginTop: '0.2rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    Provenance: doc={chunk.provenance.document_id.slice(0, 8)}... | page={chunk.provenance.page} | script={chunk.provenance.script_type || 'latin'} | ocr={chunk.provenance.ocr_applied ? 'true' : 'false'}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
