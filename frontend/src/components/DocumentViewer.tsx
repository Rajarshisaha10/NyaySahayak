import React from 'react';
import { BookOpen, FileText, Globe, CheckCircle2 } from 'lucide-react';

interface Chunk {
  id: str;
  page_number: number;
  chunk_index: number;
  text_content: string;
  language: string;
  extraction_confidence: number;
  provenance?: {
    source_type: string;
    document_id: string;
    page: number;
    text_span: string;
    language: string;
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
  if (!document) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
        <BookOpen size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <h4 style={{ color: 'var(--text-secondary)' }}>No Document Selected</h4>
        <p style={{ fontSize: '0.85rem' }}>Upload a case file to view page-preserved text chunks and provenance metadata.</p>
      </div>
    );
  }

  return (
    <div className="card document-viewer">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <h3 className="card-title" style={{ marginBottom: '0.2rem' }}>
            <FileText size={18} style={{ color: 'var(--accent-teal)' }} /> {document.filename}
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {document.page_count} Page(s) Preserved • Languages: {document.detected_languages}
          </span>
        </div>
        <span className="provenance-tag">Page-Aware Extraction</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem', maxHeight: '550px', overflowY: 'auto' }}>
        {document.chunks && document.chunks.length > 0 ? (
          document.chunks.map((chunk) => (
            <div key={chunk.id || `${chunk.page_number}-${chunk.chunk_index}`} className="page-chunk-card">
              <div className="chunk-header">
                <span>
                  <strong>Page {chunk.page_number}</strong> (Chunk #{chunk.chunk_index + 1})
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="mono-text" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Language: {chunk.language.toUpperCase()}
                  </span>
                  <span className="provenance-tag">
                    Confidence: {(chunk.extraction_confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                {chunk.text_content}
              </p>

              {chunk.provenance && (
                <div style={{ marginTop: '0.6rem', paddingTop: '0.4rem', borderTop: '1px dashed var(--border-color)', fontSize: '0.73rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Provenance Object: doc={chunk.provenance.document_id.slice(0, 8)}... | page={chunk.provenance.page} | span="{chunk.provenance.text_span.slice(0, 45)}..."
                </div>
              )}
            </div>
          ))
        ) : (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Loading extracted page chunks...</p>
        )}
      </div>
    </div>
  );
};
