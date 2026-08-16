"""
Document Upload and Page-Aware Text Retrieval APIs for NyayTarka.
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import shutil
import uuid
from app.db.database import get_db
from app.db.models import Document, DocumentChunk, Case
from app.services.parser import PagePreservingParser

router = APIRouter(prefix="/api/documents", tags=["documents"])

UPLOAD_DIR = os.path.abspath("./uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

class DocumentChunkResponse(BaseModel):
    id: str
    page_number: int
    chunk_index: int
    text_content: str
    language: str
    extraction_confidence: float
    provenance: Optional[Dict[str, Any]] = None

class DocumentResponse(BaseModel):
    id: str
    case_id: str
    filename: str
    file_type: str
    file_size: int
    page_count: int
    detected_languages: str
    created_at: str
    chunks: Optional[List[DocumentChunkResponse]] = None

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    case_id: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case workspace not found.")

    doc_id = str(uuid.uuid4())
    case_upload_dir = os.path.join(UPLOAD_DIR, f"case_{case_id}")
    os.makedirs(case_upload_dir, exist_ok=True)

    saved_path = os.path.join(case_upload_dir, f"{doc_id}_{file.filename}")
    with open(saved_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size = os.path.getsize(saved_path)
    file_ext = os.path.splitext(file.filename)[1].lower().replace(".", "")

    # Parse file preserving pages & provenance
    try:
        parsed = PagePreservingParser.parse_file(saved_path, doc_id)
    except Exception as e:
        os.remove(saved_path)
        raise HTTPException(status_code=400, detail=f"Failed to parse document: {str(e)}")

    new_doc = Document(
        id=doc_id,
        case_id=case_id,
        filename=file.filename,
        file_path=saved_path,
        file_type=file_ext,
        file_size=file_size,
        page_count=parsed.page_count,
        ocr_applied=False,
        detected_languages=",".join(parsed.detected_languages)
    )
    db.add(new_doc)
    db.commit()

    chunk_responses = []
    for chunk in parsed.chunks:
        new_chunk = DocumentChunk(
            document_id=doc_id,
            page_number=chunk["page_number"],
            chunk_index=chunk["chunk_index"],
            text_content=chunk["text_content"],
            language=chunk["language"],
            extraction_confidence=chunk["extraction_confidence"],
            provenance_json=chunk["provenance"]
        )
        db.add(new_chunk)
        db.commit()
        db.refresh(new_chunk)

        chunk_responses.append(DocumentChunkResponse(
            id=new_chunk.id,
            page_number=new_chunk.page_number,
            chunk_index=new_chunk.chunk_index,
            text_content=new_chunk.text_content,
            language=new_chunk.language,
            extraction_confidence=new_chunk.extraction_confidence,
            provenance=new_chunk.provenance_json
        ))

    db.refresh(new_doc)
    return DocumentResponse(
        id=new_doc.id,
        case_id=new_doc.case_id,
        filename=new_doc.filename,
        file_type=new_doc.file_type,
        file_size=new_doc.file_size,
        page_count=new_doc.page_count,
        detected_languages=new_doc.detected_languages,
        created_at=new_doc.created_at.isoformat(),
        chunks=chunk_responses
    )

@router.get("/case/{case_id}", response_model=List[DocumentResponse])
def list_case_documents(case_id: str, db: Session = Depends(get_db)):
    docs = db.query(Document).filter(Document.case_id == case_id).all()
    return [
        DocumentResponse(
            id=d.id,
            case_id=d.case_id,
            filename=d.filename,
            file_type=d.file_type,
            file_size=d.file_size,
            page_count=d.page_count,
            detected_languages=d.detected_languages,
            created_at=d.created_at.isoformat()
        ) for d in docs
    ]

@router.get("/{doc_id}/pages", response_model=List[DocumentChunkResponse])
def get_document_pages(doc_id: str, db: Session = Depends(get_db)):
    chunks = db.query(DocumentChunk).filter(DocumentChunk.document_id == doc_id).order_by(DocumentChunk.page_number, DocumentChunk.chunk_index).all()
    return [
        DocumentChunkResponse(
            id=c.id,
            page_number=c.page_number,
            chunk_index=c.chunk_index,
            text_content=c.text_content,
            language=c.language,
            extraction_confidence=c.extraction_confidence,
            provenance=c.provenance_json
        ) for c in chunks
    ]
