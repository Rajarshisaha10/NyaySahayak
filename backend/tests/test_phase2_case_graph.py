"""
Phase 2 Test Suite for NyaySahayak: Case Intelligence & Master Case Graph.

Verifies:
1. FactFinderAgent fact extraction & party role identification.
2. TimelineEngine chronological date sorting & provenance linking.
3. EvidenceMapper exhibit strength rating & legal issue extraction.
4. CaseGraph schema integrity.
"""

import pytest
from app.services.fact_finder import FactFinderAgent
from app.services.timeline_engine import TimelineEngine
from app.services.evidence_mapper import EvidenceMapper
from app.schemas.case_graph import CaseGraph, FactCategory, EvidenceStrength

def test_fact_finder_extraction():
    chunks = [
        {
            "page_number": 1,
            "text_content": "IN THE SUPREME COURT OF INDIA\nState of Kerala v. Kesavananda Bharati\n\n1. The petitioner filed writ petition challenging the 24th Amendment on 24th April 1973.",
            "extraction_confidence": 0.98,
            "provenance": {"document_id": "doc_sc_1973", "page": 1}
        }
    ]

    facts, parties = FactFinderAgent.extract_facts(chunks)

    assert len(facts) >= 1
    assert any(f.category in [FactCategory.PROCEDURAL, FactCategory.SUBSTANTIVE] for f in facts)
    assert len(parties) >= 1
    assert any(p.role == "Petitioner" for p in parties)

def test_timeline_engine_sorting():
    chunks = [
        {
            "page_number": 1,
            "text_content": "The impugned order was passed on 15th March 1972.\n\nThe final judgment was delivered on 24th April 1973.",
            "provenance": {"document_id": "doc_sc_1973", "page": 1}
        }
    ]

    events = TimelineEngine.build_timeline(chunks)

    assert len(events) >= 2
    # Check chronological ordering (1972 comes before 1973)
    assert "1972" in events[0].date_str
    assert "1973" in events[1].date_str

def test_evidence_mapper():
    chunks = [
        {
            "page_number": 2,
            "text_content": "The certified copy of Exhibit A (Affidavit of State Secretary) proves statutory compliance under Section 4.",
            "provenance": {"document_id": "doc_sc_1973", "page": 2}
        }
    ]

    evidence_list, issues_list = EvidenceMapper.map_evidence(chunks)

    assert len(evidence_list) >= 1
    assert evidence_list[0].strength == EvidenceStrength.STRONG
    assert len(issues_list) >= 1

def test_case_graph_schema_assembly():
    graph = CaseGraph(
        case_id="case_test_001",
        case_title="State of Kerala v. Kesavananda Bharati",
        court_type="Supreme Court of India"
    )

    assert graph.version == "1.0"
    assert graph.case_id == "case_test_001"
    assert len(graph.facts) == 0
