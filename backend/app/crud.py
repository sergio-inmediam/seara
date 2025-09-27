from datetime import datetime, timedelta
from typing import Iterable, Optional

from sqlalchemy.orm import Session

from . import schemas
from .auth import get_password_hash
from .models import Alert, ConfessionSlot, Event, User


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user_in: schemas.UserCreate) -> User:
    db_user = User(email=user_in.email, password_hash=get_password_hash(user_in.password))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_event(db: Session, event_in: schemas.EventCreate) -> Event:
    event = Event(**event_in.dict())
    db.add(event)
    db.commit()
    db.refresh(event)
    ensure_auto_alert_for_event(db, event)
    db.refresh(event)
    return event


def update_event(db: Session, event: Event, event_in: schemas.EventUpdate) -> Event:
    data = event_in.dict(exclude_unset=True)
    for key, value in data.items():
        setattr(event, key, value)
    db.add(event)
    db.commit()
    db.refresh(event)
    ensure_auto_alert_for_event(db, event)
    db.refresh(event)
    return event


def delete_event(db: Session, event: Event) -> None:
    db.delete(event)
    db.commit()


def ensure_auto_alert_for_event(db: Session, event: Event) -> Optional[Alert]:
    auto_alert: Optional[Alert] = (
        db.query(Alert)
        .filter(Alert.event_id == event.id, Alert.is_auto.is_(True))
        .first()
    )
    scheduled_for = event.starts_at - timedelta(minutes=10)
    if scheduled_for <= datetime.utcnow():
        if auto_alert is not None:
            db.delete(auto_alert)
            db.commit()
        return None

    if auto_alert is None:
        auto_alert = Alert(
            title=f"Lembrete: {event.title}",
            message=f"O evento '{event.title}' começará em breve.",
            scheduled_for=scheduled_for,
            is_auto=True,
            event_id=event.id,
        )
        db.add(auto_alert)
    else:
        auto_alert.title = f"Lembrete: {event.title}"
        auto_alert.message = f"O evento '{event.title}' começará em breve."
        auto_alert.scheduled_for = scheduled_for
    db.commit()
    db.refresh(auto_alert)
    return auto_alert


def create_alert(db: Session, alert_in: schemas.AlertCreate, *, creator: Optional[User] = None) -> Alert:
    alert = Alert(**alert_in.dict(), creator_id=creator.id if creator else None)
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert


def mark_alert_sent(db: Session, alert: Alert) -> Alert:
    alert.sent_at = datetime.utcnow()
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert


def create_confession(db: Session, confession_in: schemas.ConfessionCreate) -> ConfessionSlot:
    slot = ConfessionSlot(**confession_in.dict())
    db.add(slot)
    db.commit()
    db.refresh(slot)
    return slot


def delete_confession(db: Session, slot: ConfessionSlot) -> None:
    db.delete(slot)
    db.commit()


def list_upcoming_alerts(db: Session) -> Iterable[Alert]:
    return db.query(Alert).order_by(Alert.scheduled_for.asc()).all()
