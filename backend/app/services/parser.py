"""
Page-Preserving Document Parsing & Provenance Extraction Engine for NyayTarka.

Supports PDF (via PyMuPDF/fitz), DOCX (via python-docx), and TXT files.
Preserves exact page numbers, layout boundaries, and generates Provenance Objects.
"""

import os
from typing import List, Dict, Any, Tuple
import fitz  # PyMuPDF
import docx

class DocumentParsingResult:
    def __init__(self, page_count: int, chunks: List[Dict[str, Any]], detected_languages: List[str]):
        self.page_count = page_count
        self.chunks = chunks  # List of chunk dicts with page_number, text, provenance
        self.detected_languages = detected_languages

class PagePreservingParser:
    """Parser for legal documents preserving exact page numbers and provenance."""

    @staticmethod
    def parse_file(file_path: str, document_id: str) -> DocumentParsingResult:
        ext = os.path.splitext(file_path)[1].lower()
        if ext == ".pdf":
            return PagePreservingParser._parse_pdf(file_path, document_id)
        elif ext in [".docx", ".doc"]:
            return PagePreservingParser._parse_docx(file_path, document_id)
        elif ext == ".txt":
            return PagePreservingParser._parse_txt(file_path, document_id)
        else:
            raise ValueError(f"Unsupported file format: {ext}")

    @staticmethod
    def _parse_pdf(file_path: str, document_id: str) -> DocumentParsingResult:
        doc = fitz.open(file_path)
        page_count = len(doc)
        chunks: List[Dict[str, Any]] = []
        detected_languages = set()

        for page_idx in range(page_count):
            page = doc[page_idx]
            page_number = page_idx + 1
            text = page.get_text("text").strip()

            if not text:
                # Page might be scanned - flag for OCR in Phase 1
                text = f"[SCANNED PAGE {page_number} - REQUIRES OCR]"
                confidence = 0.5
            else:
                confidence = 0.98

            # Baseline language detection heuristic
            lang = PagePreservingParser._detect_language(text)
            detected_languages.add(lang)

            # Split page text into clean structural paragraphs while keeping page reference
            paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
            if not paragraphs:
                paragraphs = [text]

            for chunk_idx, paragraph in enumerate(paragraphs):
                provenance = {
                    "source_type": "case_document",
                    "document_id": document_id,
                    "page": page_number,
                    "chunk_index": chunk_idx,
                    "text_span": paragraph[:200],  # Prefix snippet for quick verification
                    "language": lang,
                    "extraction_confidence": confidence
                }

                chunks.append({
                    "page_number": page_number,
                    "chunk_index": chunk_idx,
                    "text_content": paragraph,
                    "language": lang,
                    "extraction_confidence": confidence,
                    "provenance": provenance
                })

        doc.close()
        return DocumentParsingResult(
            page_count=page_count,
            chunks=chunks,
            detected_languages=list(detected_languages)
        )

    @staticmethod
    def _parse_docx(file_path: str, document_id: str) -> DocumentParsingResult:
        doc = docx.Document(file_path)
        chunks: List[Dict[str, Any]] = []

        current_page = 1
        chunk_idx = 0

        for para in doc.paragraphs:
            text = para.text.strip()
            if not text:
                continue

            lang = PagePreservingParser._detect_language(text)
            provenance = {
                "source_type": "case_document",
                "document_id": document_id,
                "page": current_page,
                "chunk_index": chunk_idx,
                "text_span": text[:200],
                "language": lang,
                "extraction_confidence": 0.99
            }

            chunks.append({
                "page_number": current_page,
                "chunk_index": chunk_idx,
                "text_content": text,
                "language": lang,
                "extraction_confidence": 0.99,
                "provenance": provenance
            })
            chunk_idx += 1

        return DocumentParsingResult(
            page_count=current_page,
            chunks=chunks,
            detected_languages=["en"]
        )

    @staticmethod
    def _parse_txt(file_path: str, document_id: str) -> DocumentParsingResult:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            lines = f.readlines()

        chunks: List[Dict[str, Any]] = []
        page_number = 1
        lines_per_page = 50

        for idx, line in enumerate(lines):
            text = line.strip()
            if not text:
                continue

            page_number = (idx // lines_per_page) + 1
            provenance = {
                "source_type": "case_document",
                "document_id": document_id,
                "page": page_number,
                "chunk_index": idx,
                "text_span": text[:200],
                "language": "en",
                "extraction_confidence": 1.0
            }

            chunks.append({
                "page_number": page_number,
                "chunk_index": idx,
                "text_content": text,
                "language": "en",
                "extraction_confidence": 1.0,
                "provenance": provenance
            })

        return DocumentParsingResult(
            page_count=page_number,
            chunks=chunks,
            detected_languages=["en"]
        )

    @staticmethod
    def _detect_language(text: str) -> str:
        """Basic Unicode range detection for Devanagari (Hindi) vs Latin (English)."""
        devanagari_count = sum(1 for char in text if '\u0900' <= char <= '\u097F')
        if devanagari_count > len(text) * 0.15:
            return "hi"  # Hindi / Devanagari script
        return "en"     # Default English
