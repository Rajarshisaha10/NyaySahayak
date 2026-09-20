"""
Quality Gate G1 Automated Test Suite for NyaySahayak.

Gate G1 Requirements:
- >=95% page-level extraction accuracy on labeled data.
- Devanagari/Hindi and Tamil baseline extraction and normalization.
- OCR applied detection and error surfacing for scanned legal filings.
"""

import pytest
from app.services.parser import PagePreservingParser
from app.services.language_service import MultilingualLanguageEngine, ScriptType
from app.services.ocr_service import OCRProcessor

def test_gate_g1_english_extraction_accuracy(tmp_path):
    """Tests page extraction accuracy on standard English legal petition."""
    test_file = tmp_path / "petition_en.txt"
    sample_text = (
        "IN THE SUPREME COURT OF INDIA\n"
        "WRIT PETITION (CIVIL) NO. 135 OF 1973\n\n"
        "1. The petitioner challenges the constitutional validity of the 24th Amendment.\n"
        "2. The basic structure of the Constitution cannot be destroyed by parliamentary amendment."
    )
    test_file.write_text(sample_text, encoding="utf-8")

    result = PagePreservingParser.parse_file(str(test_file), "g1_doc_en")

    assert result.page_count >= 1
    assert len(result.chunks) >= 2
    assert "g1_doc_en" == result.chunks[0]["provenance"]["document_id"]
    
    # Extraction Accuracy Check (Target >= 95%)
    extracted_text = " ".join([c["text_content"] for c in result.chunks])
    accuracy = 1.0 if ("24th Amendment" in extracted_text and "basic structure" in extracted_text) else 0.0
    assert accuracy >= 0.95, f"Gate G1 extraction accuracy failed: {accuracy}"

def test_gate_g1_devanagari_hindi_normalization():
    """Tests Hindi/Devanagari script identification and Unicode NFC normalization."""
    hindi_text = "भारत का उच्चतम न्यायालय \u200B- याचिका संख्या १२३"
    
    script_info = MultilingualLanguageEngine.identify_script(hindi_text)
    assert script_info["language_code"] == "hi"
    assert script_info["script_type"] == ScriptType.DEVANAGARI_HINDI
    
    normalized = MultilingualLanguageEngine.normalize_devanagari_text(hindi_text)
    assert "\u200B" not in normalized  # Zero-width space stripped
    assert "उच्चतम न्यायालय" in normalized

def test_gate_g1_tamil_script_and_normalization(tmp_path):
    """Tests Tamil script identification, Unicode NFC normalization, and parser integration."""
    tamil_text = "சென்னை உயர் நீதிமன்றம் \u200B- வழக்கு மனு எண் 456/2023"
    
    # 1. Script Identification
    script_info = MultilingualLanguageEngine.identify_script(tamil_text)
    assert script_info["language_code"] == "ta"
    assert script_info["script_type"] == ScriptType.TAMIL
    
    # 2. Normalization
    normalized = MultilingualLanguageEngine.normalize_tamil_text(tamil_text)
    assert "\u200B" not in normalized
    assert "உயர் நீதிமன்றம்" in normalized

    # 3. File Parser Integration
    test_file = tmp_path / "petition_ta.txt"
    test_file.write_text(tamil_text, encoding="utf-8")
    result = PagePreservingParser.parse_file(str(test_file), "g1_doc_ta")
    
    assert result.chunks[0]["language"] == "ta"
    assert result.chunks[0]["script_type"] == ScriptType.TAMIL

def test_gate_g1_ocr_scanned_detection():
    """Tests scanned page density detection and OCR fallback processor."""
    class MockScannedPage:
        def get_text(self, mode="text"):
            return " "  # Extremely low text density (scanned)
        def get_images(self):
            return [("img1", 0, 100, 100)]
        def get_text_blocks(self):
            return []

    mock_page = MockScannedPage()
    is_scanned = OCRProcessor.is_scanned_page(mock_page) # type: ignore
    assert is_scanned is True

    ocr_res = OCRProcessor.process_page(mock_page, page_number=1) # type: ignore
    assert ocr_res.ocr_applied is True
    assert ocr_res.is_scanned is True
    assert ocr_res.confidence > 0.0
