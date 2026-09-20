"""
Multilingual Script Identification and Text Normalization Engine for NyaySahayak.

Supports:
- Script detection (Latin/English, Devanagari/Hindi/Marathi, Tamil, Bengali, Telugu, Gujarati).
- Devanagari Unicode NFC normalization.
- Tamil Unicode NFC normalization (handling Pulli/Virama \u0BCD, Tamil vowels, legal terms).
- Script confidence scoring ensuring Tamil and Indic regional-script filings are safely ingested.
"""

import unicodedata
import re
from typing import Dict, Any, List, Tuple

class ScriptType:
    LATIN_ENGLISH = "latin_english"
    DEVANAGARI_HINDI = "devanagari_hindi"
    TAMIL = "tamil"
    BENGALI = "bengali"
    TELUGU = "telugu"
    GUJARATI = "gujarati"
    MIXED_BILINGUAL = "mixed_bilingual"
    UNKNOWN = "unknown"

class MultilingualLanguageEngine:
    """Service for script identification and text normalization in Indian legal documents."""

    # Unicode Character Ranges for Indian Regional Scripts
    SCRIPT_RANGES: List[Tuple[str, int, int]] = [
        (ScriptType.DEVANAGARI_HINDI, 0x0900, 0x097F),  # Devanagari (Hindi / Marathi)
        (ScriptType.TAMIL, 0x0B80, 0x0BFF),             # Tamil
        (ScriptType.BENGALI, 0x0980, 0x09FF),           # Bengali / Assamese
        (ScriptType.GUJARATI, 0x0A80, 0x0AFF),          # Gujarati
        (ScriptType.TELUGU, 0x0C00, 0x0C7F),            # Telugu
    ]

    @staticmethod
    def identify_script(text: str) -> Dict[str, Any]:
        """Identifies primary script, language code, and script distribution confidence."""
        if not text or not text.strip():
            return {
                "script_type": ScriptType.UNKNOWN,
                "language_code": "en",
                "confidence": 0.0,
                "is_bilingual": False
            }

        total_chars = len(text)
        script_counts: Dict[str, int] = {
            ScriptType.LATIN_ENGLISH: 0,
            ScriptType.DEVANAGARI_HINDI: 0,
            ScriptType.TAMIL: 0,
            ScriptType.BENGALI: 0,
            ScriptType.GUJARATI: 0,
            ScriptType.TELUGU: 0,
        }

        for char in text:
            cp = ord(char)
            if (0x0041 <= cp <= 0x005A) or (0x0061 <= cp <= 0x007A):
                script_counts[ScriptType.LATIN_ENGLISH] += 1
                continue

            for script_name, start_range, end_range in MultilingualLanguageEngine.SCRIPT_RANGES:
                if start_range <= cp <= end_range:
                    script_counts[script_name] += 1
                    break

        latin_count = script_counts[ScriptType.LATIN_ENGLISH]
        devanagari_count = script_counts[ScriptType.DEVANAGARI_HINDI]
        tamil_count = script_counts[ScriptType.TAMIL]
        indic_total = sum(script_counts[s] for s in script_counts if s != ScriptType.LATIN_ENGLISH)

        if total_chars == 0:
            return {"script_type": ScriptType.LATIN_ENGLISH, "language_code": "en", "confidence": 1.0, "is_bilingual": False}

        devanagari_ratio = devanagari_count / total_chars
        tamil_ratio = tamil_count / total_chars
        latin_ratio = latin_count / total_chars

        if tamil_ratio > 0.10:
            is_bilingual = latin_ratio > 0.15
            primary_script = ScriptType.MIXED_BILINGUAL if is_bilingual else ScriptType.TAMIL
            lang_code = "ta"
            confidence = min(0.99, (tamil_ratio + latin_ratio))
        elif devanagari_ratio > 0.15:
            is_bilingual = latin_ratio > 0.15
            primary_script = ScriptType.MIXED_BILINGUAL if is_bilingual else ScriptType.DEVANAGARI_HINDI
            lang_code = "hi"
            confidence = min(0.99, (devanagari_ratio + latin_ratio))
        elif indic_total > 0:
            dominant_indic = max(script_counts, key=script_counts.get)
            primary_script = dominant_indic
            lang_code = "ta" if dominant_indic == ScriptType.TAMIL else primary_script.split("_")[0][:2]
            confidence = min(0.99, indic_total / total_chars)
            is_bilingual = latin_ratio > 0.15
        else:
            primary_script = ScriptType.LATIN_ENGLISH
            lang_code = "en"
            confidence = 1.0
            is_bilingual = False

        return {
            "script_type": primary_script,
            "language_code": lang_code,
            "confidence": round(confidence, 2),
            "is_bilingual": is_bilingual,
            "script_distribution": script_counts
        }

    @staticmethod
    def normalize_devanagari_text(text: str) -> str:
        """Unicode NFC normalization for Devanagari (Hindi/Marathi) text."""
        if not text:
            return ""
        normalized = unicodedata.normalize("NFC", text)
        normalized = re.sub(r'[\u200B-\u200D\uFEFF]', '', normalized)
        normalized = re.sub(r'[ \t]+', ' ', normalized)
        normalized = re.sub(r'\n{3,}', '\n\n', normalized)
        return normalized.strip()

    @staticmethod
    def normalize_tamil_text(text: str) -> str:
        """
        Unicode NFC normalization for Tamil legal text.
        Preserves Pulli (virama \u0BCD), Grantha characters (Ş, Ş, etc.), and legal terminology.
        """
        if not text:
            return ""
        normalized = unicodedata.normalize("NFC", text)
        normalized = re.sub(r'[\u200B-\u200D\uFEFF]', '', normalized)
        normalized = re.sub(r'[ \t]+', ' ', normalized)
        normalized = re.sub(r'\n{3,}', '\n\n', normalized)
        return normalized.strip()
