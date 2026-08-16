"""
Unit tests for Page-Preserving Parser and Provenance Tracking.
"""

import pytest
import os
from app.services.parser import PagePreservingParser

def test_parse_txt_file(tmp_path):
    # Create sample text file
    sample_file = tmp_path / "sample_case.txt"
    sample_file.write_text("IN THE SUPREME COURT OF INDIA\nPetitioner: State of Kerala\nRespondent: Kesavananda Bharati\n\nParagraph 1 on Page 1.\n" + ("\nLine text\n" * 60) + "Paragraph on Page 2.")

    result = PagePreservingParser.parse_file(str(sample_file), "doc_test_123")

    assert result.page_count >= 1
    assert len(result.chunks) > 0
    first_chunk = result.chunks[0]
    assert "provenance" in first_chunk
    assert first_chunk["provenance"]["document_id"] == "doc_test_123"
    assert first_chunk["provenance"]["page"] == 1
    assert "IN THE SUPREME COURT" in first_chunk["text_content"]

def test_detect_hindi_language():
    hindi_text = "भारत का उच्चतम न्यायालय - केस विवरण और साक्ष्य"
    english_text = "Supreme Court of India - Case summary and evidence"
    
    assert PagePreservingParser._detect_language(hindi_text) == "hi"
    assert PagePreservingParser._detect_language(english_text) == "en"
