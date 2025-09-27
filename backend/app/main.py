from datetime import datetime
from typing import List

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from . import crud, schemas
from .auth import create_access_token, get_current_user, get_db, verify_password
from .config import get_settings
from .database import Base, SessionLocal, engine
from .models import Alert, ConfessionSlot, Event, User
from .notifications import init_scheduler, schedule_alert

settings = get_settings()
Base.metadata.create_all(bind=engine)
app = FastAPI(title=settings.app_name)

if settings.cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.on_event("startup")
async def startup_event() -> None:
    init_scheduler(app)
    if settings.admin_email and settings.admin_password:
        with SessionLocal() as db:
            existing = crud.get_user_by_email(db, settings.admin_email)
            if existing is None:
                crud.create_user(
                    db,
                    schemas.UserCreate(email=settings.admin_email, password=settings.admin_password),
                )


@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas")
    access_token = create_access_token({"sub": user.email})
    return schemas.Token(access_token=access_token)


@app.post("/auth/users", response_model=schemas.UserRead)
def create_admin_user(
    user_in: schemas.UserCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if crud.get_user_by_email(db, user_in.email):
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")
    user = crud.create_user(db, user_in)
    return user


@app.get("/public/events", response_model=List[schemas.EventRead])
def list_events(db: Session = Depends(get_db)):
    return db.query(Event).order_by(Event.starts_at.asc()).all()


@app.get("/public/alerts", response_model=List[schemas.AlertRead])
def list_alerts(db: Session = Depends(get_db)):
    return db.query(Alert).order_by(Alert.scheduled_for.asc()).all()


@app.get("/public/confessions", response_model=List[schemas.ConfessionRead])
def list_confessions(db: Session = Depends(get_db)):
    return db.query(ConfessionSlot).order_by(ConfessionSlot.starts_at.asc()).all()


@app.post("/admin/events", response_model=schemas.EventRead)
def create_event(
    event_in: schemas.EventCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    event = crud.create_event(db, event_in)
    for alert in event.alerts:
        schedule_alert(alert)
    return event


@app.put("/admin/events/{event_id}", response_model=schemas.EventRead)
def update_event(
    event_id: int,
    event_in: schemas.EventUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if event is None:
        raise HTTPException(status_code=404, detail="Evento não encontrado")
    event = crud.update_event(db, event, event_in)
    for alert in event.alerts:
        if alert.is_auto:
            schedule_alert(alert)
    return event


@app.delete("/admin/events/{event_id}", status_code=204)
def delete_event(
    event_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if event is None:
        raise HTTPException(status_code=404, detail="Evento não encontrado")
    crud.delete_event(db, event)
    return None


@app.post("/admin/alerts", response_model=schemas.AlertRead)
def create_alert(
    alert_in: schemas.AlertCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    alert = crud.create_alert(db, alert_in, creator=current_user)
    schedule_alert(alert)
    return alert


@app.post("/admin/confessions", response_model=schemas.ConfessionRead)
def create_confession(
    confession_in: schemas.ConfessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    slot = crud.create_confession(db, confession_in)
    return slot


@app.delete("/admin/confessions/{confession_id}", status_code=204)
def delete_confession(
    confession_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    slot = db.query(ConfessionSlot).filter(ConfessionSlot.id == confession_id).first()
    if slot is None:
        raise HTTPException(status_code=404, detail="Horário não encontrado")
    crud.delete_confession(db, slot)
    return None


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok", "timestamp": datetime.utcnow()}
