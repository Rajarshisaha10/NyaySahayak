"""
Case Workspace API endpoints for NyayTarka.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.db.database import get_db
from app.db.models import Case, Document, User

router = APIRouter(prefix="/api/cases", tags=["cases"])

class CaseCreate(BaseModel):
    user_id: str
    title: str
    case_number: Optional[str] = None
    court_type: str = "Supreme Court of India"
    description: Optional[str] = None

class CaseResponse(BaseModel):
    id: str
    user_id: str
    title: str
    case_number: Optional[str] = None
    court_type: str
    description: Optional[str] = None
    status: str
    created_at: str
    document_count: int = 0

@router.post("", response_model=CaseResponse)
def create_case(case_data: CaseCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == case_data.user_id).first()
    if not user:
        # For rapid dev, create guest user if missing
        user = User(id=case_data.user_id, email=f"{case_data.user_id}@nyaytarka.local", hashed_password="guest", full_name="Counsel")
        db.add(user)
        db.commit()

    new_case = Case(
        user_id=case_data.user_id,
        title=case_data.title,
        case_number=case_data.case_number,
        court_type=case_data.court_type,
        description=case_data.description
    )
    db.add(new_case)
    db.commit()
    db.refresh(new_case)

    return CaseResponse(
        id=new_case.id,
        user_id=new_case.user_id,
        title=new_case.title,
        case_number=new_case.case_number,
        court_type=new_case.court_type,
        description=new_case.description,
        status=new_case.status,
        created_at=new_case.created_at.isoformat(),
        document_count=0
    )

@router.get("/user/{user_id}", response_model=List[CaseResponse])
def list_user_cases(user_id: str, db: Session = Depends(get_db)):
    cases = db.query(Case).filter(Case.user_id == user_id).all()
    results = []
    for c in cases:
        doc_count = db.query(Document).filter(Document.case_id == c.id).count()
        results.append(CaseResponse(
            id=c.id,
            user_id=c.user_id,
            title=c.title,
            case_number=c.case_number,
            court_type=c.court_type,
            description=c.description,
            status=c.status,
            created_at=c.created_at.isoformat(),
            document_count=doc_count
        ))
    return results
