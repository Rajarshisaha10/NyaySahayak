import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface CaseUploadProps {
  caseId: string;
  onUploadSuccess: (documentData: any) => void;
}

export const CaseUpload: React.FC<CaseUploadProps> = ({ caseId, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('case_id', caseId);
    formData.append('file', file);

    try {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = 'Upload failed';
        try {
          const data = await response.json();
          errorMsg = data.detail || errorMsg;
        } catch {
          const text = await response.text();
          errorMsg = text || errorMsg;
        }
        throw new Error(errorMsg);
      }

      const docData = await response.json();
      onUploadSuccess(docData);
    } catch (err: any) {
      setError(err.message || 'Error uploading document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="card-title">
        <Upload size={18} style={{ color: '#ffffff' }} /> Upload Legal Case Material
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
        Upload PDF, DOCX, or TXT petition copies, evidence documents, or statutory filings. Page numbers and provenance metadata will be automatically extracted.
      </p>

      <label className={`dropzone ${uploading ? 'active' : ''}`}>
        <input
          type="file"
          accept=".pdf,.docx,.doc,.txt"
          onChange={handleFileChange}
          disabled={uploading}
          style={{ display: 'none' }}
        />
        <FileText size={32} style={{ color: '#ffffff', marginBottom: '0.5rem' }} />
        <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>
          {uploading ? 'Processing & Extracting Page Spans...' : 'Click or Drag & Drop File'}
        </div>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Supports PDF (Page-Preserving), DOCX, TXT
        </span>
      </label>

      {error && (
        <div style={{ color: 'var(--status-contested)', marginTop: '0.75rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}
    </div>
  );
};
