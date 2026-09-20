"""
Dynamic Case Timeline Engine for NyaySahayak.

Responsible for:
1. Extracting chronological dates and associated legal events from case record.
2. Detecting exact, approximate, and conflicting dates.
3. Sorting timeline events chronologically.
4. Linking every timeline entry back to exact document page provenance.
"""

import re
import uuid
from typing import List, Dict, Any, Tuple
from app.schemas.case_graph import TimelineEvent

class TimelineEngine:
    """Engine for building page-linked chronological case timelines."""

    # Regex patterns for matching legal dates
    DATE_PATTERNS = [
        r'\b\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b',  # e.g., 24th April 1973
        r'\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}\b',                 # e.g., April 24, 1973
        r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b',                                                                # e.g., 24/04/1973
        r'\b(?:19|20)\d{2}\b'                                                                                 # e.g., 1973
    ]

    @staticmethod
    def build_timeline(chunks: List[Dict[str, Any]]) -> List[TimelineEvent]:
        events: List[TimelineEvent] = []

        for chunk in chunks:
            text = chunk.get("text_content", "").strip()
            if not text:
                continue

            doc_id = chunk.get("provenance", {}).get("document_id", "doc_unknown")
            page_num = chunk.get("page_number", 1)

            paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
            for para in paragraphs:
                date_str, raw_date = TimelineEngine._find_first_date(para)
                if not date_str:
                    continue

                is_approx = any(w in para.lower() for w in ["approx", "around", "about", "circa", "on or about"])
                is_conflict = any(w in para.lower() for w in ["disputed date", "conflict", "alleged date", "whereas respondent states"])

                event = TimelineEvent(
                    event_id=f"evt_{uuid.uuid4().hex[:8]}",
                    date_str=date_str,
                    raw_date=raw_date,
                    event_summary=para[:250],
                    is_approximate=is_approx,
                    is_conflicting=is_conflict,
                    conflict_notes="Conflicting dates stated across filings" if is_conflict else None,
                    document_id=doc_id,
                    page_number=page_num,
                    text_span=para[:200]
                )
                events.append(event)

        # Sort timeline entries chronologically by extracted date string
        events.sort(key=lambda e: TimelineEngine._extract_sort_year(e.date_str))
        return events

    @staticmethod
    def _find_first_date(text: str) -> Tuple[str, str]:
        for pattern in TimelineEngine.DATE_PATTERNS:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                found = match.group(0)
                return found, found
        return "", ""

    @staticmethod
    def _extract_sort_year(date_str: str) -> int:
        year_match = re.search(r'\b(19\d{2}|20\d{2})\b', date_str)
        return int(year_match.group(1)) if year_match else 9999
