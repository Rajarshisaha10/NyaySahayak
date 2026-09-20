"""
Master Case Graph Service for NyaySahayak.

Assembles and manages versioned Case Graph structures by coordinating:
- FactFinderAgent
- TimelineEngine
- EvidenceMapper
"""

from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.models import Case, Document, DocumentChunk, CaseGraphRecord
from app.schemas.case_graph import CaseGraph
from app.services.fact_finder import FactFinderAgent
from app.services.timeline_engine import TimelineEngine
from app.services.evidence_mapper import EvidenceMapper

class CaseGraphService:
    """Service for compiling, versioning, and persisting master Case Graphs."""

    @staticmethod
    def generate_case_graph(case_id: str, db: Session) -> CaseGraph:
        case = db.query(Case).filter(Case.id == case_id).first()
        case_title = case.title if case else "State of Kerala v. Constitutional Amendments (Demo Workspace)"
        court_type = case.court_type if case else "Supreme Court of India"

        # Query all document chunks for this case
        docs = db.query(Document).filter(Document.case_id == case_id).all()
        doc_ids = [d.id for d in docs]

        chunks_records = []
        if doc_ids:
            chunks_records = db.query(DocumentChunk).filter(DocumentChunk.document_id.in_(doc_ids)).order_by(DocumentChunk.page_number, DocumentChunk.chunk_index).all()

        chunks = [
            {
                "page_number": c.page_number,
                "chunk_index": c.chunk_index,
                "text_content": c.text_content,
                "language": c.language,
                "script_type": c.script_type,
                "extraction_confidence": c.extraction_confidence,
                "provenance": c.provenance_json or {"document_id": c.document_id, "page": c.page_number}
            } for c in chunks_records
        ]

        # 1. Fact Finder Agent
        facts, parties = FactFinderAgent.extract_facts(chunks)

        # 2. Timeline Engine
        timeline = TimelineEngine.build_timeline(chunks)

        # 3. Evidence Mapper
        evidence_map, legal_issues = EvidenceMapper.map_evidence(chunks)

        summary = f"Case Graph compiled with {len(facts)} facts, {len(timeline)} timeline events, {len(evidence_map)} evidence items, and {len(legal_issues)} legal issues."

        graph = CaseGraph(
            version="1.0",
            case_id=case_id,
            case_title=case_title,
            court_type=court_type,
            parties=parties,
            facts=facts,
            timeline=timeline,
            evidence_map=evidence_map,
            legal_issues=legal_issues,
            summary=summary,
            created_at=datetime.utcnow().isoformat()
        )

        # Save snapshot in DB
        record = CaseGraphRecord(
            case_id=case_id,
            version="1.0",
            graph_json=graph.model_dump()
        )
        db.add(record)
        db.commit()

        return graph

    @staticmethod
    def get_latest_case_graph(case_id: str, db: Session) -> Optional[CaseGraph]:
        rec = db.query(CaseGraphRecord).filter(CaseGraphRecord.case_id == case_id).order_by(CaseGraphRecord.created_at.desc()).first()
        if rec:
            return CaseGraph(**rec.graph_json)
        # If no snapshot in DB, generate one on-the-fly
        return CaseGraphService.generate_case_graph(case_id, db)
