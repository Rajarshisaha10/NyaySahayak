import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldAlert, HelpCircle } from 'lucide-react';

interface CitationBadgeProps {
  status: 'VERIFIED' | 'PARTIAL' | 'CONTESTED' | 'UNVERIFIED' | string;
  onClick?: () => void;
}

export const CitationBadge: React.FC<CitationBadgeProps> = ({ status, onClick }) => {
  const renderIcon = () => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle2 size={14} />;
      case 'PARTIAL':
        return <AlertTriangle size={14} />;
      case 'CONTESTED':
        return <ShieldAlert size={14} />;
      default:
        return <HelpCircle size={14} />;
    }
  };

  return (
    <span
      className={`badge badge-${status}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      title={`Citation Status: ${status}`}
    >
      {renderIcon()}
      {status}
    </span>
  );
};
