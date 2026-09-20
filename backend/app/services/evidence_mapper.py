"""
Evidence Mapping Engine for NyaySahayak.

Responsible for:
1. Identifying documentary evidence, affidavits, witness statements, and statutory exhibits.
2. Linking evidence items to legal claims supported.
3. Rating evidence strength (STRONG, MODERATE, WEAK, MISSING).
4. Extracting grounded legal issues and evidentiary gap warnings.
"""

import re
import uuid
from typing import List, Dict, Any, Tuple
from app.schemas.case_graph import EvidenceItem, EvidenceType, EvidenceStrength, LegalIssue

class EvidenceMapper:
    """Engine for mapping evidence items to legal claims and identifying legal issues."""

    @staticmethod
    def map_evidence(chunks: List[Dict[str, Any]]) -> Tuple[List[EvidenceItem], List[LegalIssue]]:
        evidence_list: List[EvidenceItem] = []
        issues_list: List[LegalIssue] = []

        for chunk in chunks:
            text = chunk.get("text_content", "").strip()
            if not text:
                continue

            doc_id = chunk.get("provenance", {}).get("document_id", "doc_unknown")
            page_num = chunk.get("page_number", 1)

            # Detect Evidence items
            if any(w in text.lower() for w in ["exhibit", "affidavit", "annexure", "witness", "gazette", "statute", "bare act"]):
                ev_type = EvidenceMapper._determine_evidence_type(text)
                strength = EvidenceMapper._determine_strength(text)

                item = EvidenceItem(
                    evidence_id=f"ev_{uuid.uuid4().hex[:8]}",
                    title=EvidenceMapper._extract_evidence_title(text),
                    evidence_type=ev_type,
                    claim_supported=text[:180],
                    strength=strength,
                    notes="Directly referenced in petition filing" if strength == EvidenceStrength.STRONG else "Requires corroborating documentation",
                    document_id=doc_id,
                    page_number=page_num,
                    text_span=text[:200]
                )
                evidence_list.append(item)

            # Detect Legal Issues / Questions
            if any(w in text.lower() for w in ["question of law", "issue", "whether", "validity of", "ultra vires"]):
                issue = LegalIssue(
                    issue_id=f"iss_{uuid.uuid4().hex[:8]}",
                    title=text[:80].strip(),
                    question_text=text[:250].strip(),
                    relevant_fact_ids=[],
                    relevant_evidence_ids=[e.evidence_id for e in evidence_list[:2]],
                    governing_statutes=EvidenceMapper._extract_statutes(text)
                )
                issues_list.append(issue)

        # Fallback Issue if none extracted
        if not issues_list:
            issues_list.append(LegalIssue(
                issue_id="iss_core_01",
                title="Constitutional & Statutory Validity Issue",
                question_text="Whether the impugned legislative action violates constitutional provisions or basic structure principles?",
                governing_statutes=["Constitution of India"]
            ))

        return evidence_list, issues_list

    @staticmethod
    def _determine_evidence_type(text: str) -> EvidenceType:
        lower = text.lower()
        if "affidavit" in lower:
            return EvidenceType.AFFIDAVIT
        elif "witness" in lower or "deposed" in lower:
            return EvidenceType.WITNESS_STATEMENT
        elif "act" in lower or "section" in lower or "article" in lower:
            return EvidenceType.STATUTORY_ACT
        elif "exhibit" in lower or "annexure" in lower:
            return EvidenceType.EXHIBIT
        else:
            return EvidenceType.DOCUMENTARY

    @staticmethod
    def _determine_strength(text: str) -> EvidenceStrength:
        lower = text.lower()
        if any(w in lower for w in ["certified copy", "official gazette", "unanimous", "undisputed"]):
            return EvidenceStrength.STRONG
        elif any(w in lower for w in ["oral", "uncorroborated", "unclear"]):
            return EvidenceStrength.WEAK
        else:
            return EvidenceStrength.MODERATE

    @staticmethod
    def _extract_evidence_title(text: str) -> str:
        lines = [l.strip() for l in text.split("\n") if l.strip()]
        return lines[0][:60] if lines else "Documentary Evidence Item"

    @staticmethod
    def _extract_statutes(text: str) -> List[str]:
        matches = re.findall(r'\b(?:Article|Section)\s+\d+(?:[A-Z])?\b|\bConstitution of India\b|\b[A-Z][a-zA-Z\s]+Act,\s+\d{4}\b', text)
        return list(set(matches)) or ["Constitution of India"]
