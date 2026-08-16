"""
Unit tests for 6-Check Citation Verification Engine.
"""

import pytest
from app.services.verification_engine import CitationVerificationEngine
from app.schemas.verification import VerificationStatus

def test_verify_valid_citation():
    report = CitationVerificationEngine.verify_citation(
        citation_text="Kesavananda Bharati v. State of Kerala, (1973) 4 SCC 225",
        proposition_claim="Basic structure of the Constitution cannot be amended.",
        quoted_text="Basic structure of the Constitution",
        source_passage="The basic structure of the Constitution of India cannot be altered or damaged by constitutional amendment.",
        document_id="doc_sc_1973",
        page_number=45
    )

    assert report.overall_status == VerificationStatus.VERIFIED
    assert report.existence_check.passed is True
    assert report.identity_check.passed is True
    assert report.source_check.passed is True
    assert report.quotation_check.passed is True
    assert report.proposition_check.passed is True
    assert report.trace_check.passed is True

def test_verify_unverified_missing_source():
    report = CitationVerificationEngine.verify_citation(
        citation_text="Uncertain Case Name Without Citation",
        document_id=None,
        page_number=None
    )

    assert report.overall_status in [VerificationStatus.UNVERIFIED, VerificationStatus.CONTESTED]
    assert report.trace_check.passed is False
