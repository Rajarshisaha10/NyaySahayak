"""
Fact Finder Agent for NyaySahayak.

Responsible for:
1. Extracting structured facts from document chunks.
2. Identifying parties and their legal roles (Petitioner, Respondent, State).
3. Flagging disputed facts and factual contradictions across filings.
4. Retaining page-level provenance coordinates for every fact.
"""

import re
import uuid
from typing import List, Dict, Any, Tuple
from app.schemas.case_graph import FactItem, FactCategory, CaseParty

class FactFinderAgent:
    """Agent for extracting structured facts, parties, and contradictions from case records."""

    @staticmethod
    def extract_facts(chunks: List[Dict[str, Any]]) -> Tuple[List[FactItem], List[CaseParty]]:
        facts: List[FactItem] = []
        parties_dict: Dict[str, str] = {}  # name -> role

        for chunk in chunks:
            text = chunk.get("text_content", "").strip()
            if not text:
                continue

            doc_id = chunk.get("provenance", {}).get("document_id", "doc_unknown")
            page_num = chunk.get("page_number", 1)

            # Extract Parties (heuristics for legal title blocks)
            FactFinderAgent._extract_parties_from_text(text, parties_dict)

            # Categorize paragraphs into structured facts
            lines = [l.strip() for l in text.split("\n") if l.strip()]
            for line in lines:
                if len(line) < 20:
                    continue

                category = FactFinderAgent._categorize_fact(line)
                
                # Check for parties involved in this line
                parties_in_line = [p for p in parties_dict if p.lower() in line.lower()]

                fact_item = FactItem(
                    fact_id=f"fact_{uuid.uuid4().hex[:8]}",
                    category=category,
                    description=line,
                    date_context=FactFinderAgent._extract_date_snippet(line),
                    parties_involved=parties_in_line,
                    document_id=doc_id,
                    page_number=page_num,
                    text_span=line[:200],
                    confidence=chunk.get("extraction_confidence", 0.95)
                )
                facts.append(fact_item)

        # Build CaseParty list
        parties_list: List[CaseParty] = [
            CaseParty(name=name, role=role) for name, role in parties_dict.items()
        ]

        if not parties_list:
            parties_list = [
                CaseParty(name="Petitioner / State", role="Petitioner"),
                CaseParty(name="Respondent Counsel", role="Respondent")
            ]

        return facts, parties_list

    @staticmethod
    def _categorize_fact(text: str) -> FactCategory:
        lower = text.lower()
        if any(w in lower for w in ["contradict", "conflict", "denies", "dispute", "contrary"]):
            return FactCategory.CONTRADICTION
        elif any(w in lower for w in ["alleged", "claimed", "contends", "asserts"]):
            return FactCategory.DISPUTED
        elif any(w in lower for w in ["filed", "petition", "notice", "impugned order", "appeal", "writ"]):
            return FactCategory.PROCEDURAL
        elif any(w in lower for w in ["amendment", "article", "section", "act", "constitution", "held"]):
            return FactCategory.SUBSTANTIVE
        else:
            return FactCategory.BACKGROUND

    @staticmethod
    def _extract_parties_from_text(text: str, parties_dict: Dict[str, str]) -> None:
        """Extracts petitioner, respondent, or state names from title lines."""
        if " v. " in text or " vs. " in text or " VERSUS " in text:
            parts = re.split(r'\s+(?:v\.|vs\.|VERSUS)\s+', text, maxsplit=1, flags=re.IGNORECASE)
            if len(parts) == 2:
                petitioner = parts[0].strip().split("\n")[-1].replace("IN THE SUPREME COURT OF INDIA", "").strip()
                respondent = parts[1].strip().split("\n")[0].strip()
                if len(petitioner) < 60:
                    parties_dict[petitioner] = "Petitioner"
                if len(respondent) < 60:
                    parties_dict[respondent] = "Respondent"

    @staticmethod
    def _extract_date_snippet(text: str) -> str:
        date_match = re.search(r'\b(?:\d{1,2}[-/\s])?(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[-/\s]?\d{2,4}\b|\b(19\d{2}|20\d{2})\b', text, re.IGNORECASE)
        return date_match.group(0) if date_match else None
