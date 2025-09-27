from datetime import datetime
from typing import Optional

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.date import DateTrigger
from fastapi import FastAPI
from sqlalchemy.orm import Session

from .crud import list_upcoming_alerts
from .database import SessionLocal
from .models import Alert

scheduler = AsyncIOScheduler()


def _send_alert(alert: Alert, db: Session) -> None:
    if alert.sent_at is not None:
        return
    alert.sent_at = datetime.utcnow()
    db.add(alert)
    db.commit()
    # Aqui ficaria a integração com FCM/APNS. Por ora registramos no log.
    print(f"[ALERTA] {alert.title}: {alert.message} (enviado em {alert.sent_at.isoformat()} UTC)")


def schedule_alert(alert: Alert) -> None:
    if alert.sent_at is not None:
        return
    if alert.scheduled_for <= datetime.utcnow():
        with SessionLocal() as db:
            _send_alert(alert, db)
        return

    scheduler.add_job(
        func=_execute_alert_job,
        trigger=DateTrigger(run_date=alert.scheduled_for),
        args=[alert.id],
        id=f"alert-{alert.id}",
        replace_existing=True,
        misfire_grace_time=60 * 30,
    )


def _execute_alert_job(alert_id: int) -> None:
    with SessionLocal() as db:
        alert: Optional[Alert] = db.query(Alert).filter(Alert.id == alert_id).first()
        if alert is None:
            return
        _send_alert(alert, db)


def load_existing_alerts() -> None:
    with SessionLocal() as db:
        for alert in list_upcoming_alerts(db):
            schedule_alert(alert)


def init_scheduler(app: FastAPI) -> None:
    if not scheduler.running:
        scheduler.start()
    load_existing_alerts()

    @app.on_event("shutdown")
    def shutdown_scheduler() -> None:  # pragma: no cover
        if scheduler.running:
            scheduler.shutdown()
