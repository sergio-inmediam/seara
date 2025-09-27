from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    sub: Optional[str] = None


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(min_length=6)


class UserRead(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        orm_mode = True


class EventBase(BaseModel):
    title: str
    speaker: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    starts_at: datetime
    ends_at: Optional[datetime] = None
    day_label: Optional[str] = None


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    title: Optional[str] = None
    speaker: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    starts_at: Optional[datetime] = None
    ends_at: Optional[datetime] = None
    day_label: Optional[str] = None


class EventRead(EventBase):
    id: int

    class Config:
        orm_mode = True


class AlertBase(BaseModel):
    title: str
    message: str
    scheduled_for: datetime


class AlertCreate(AlertBase):
    event_id: Optional[int] = None


class AlertRead(AlertBase):
    id: int
    sent_at: Optional[datetime] = None
    is_auto: bool
    event_id: Optional[int]

    class Config:
        orm_mode = True


class ConfessionBase(BaseModel):
    location: Optional[str] = None
    starts_at: datetime
    ends_at: datetime
    priest: Optional[str] = None
    notes: Optional[str] = None


class ConfessionCreate(ConfessionBase):
    pass


class ConfessionRead(ConfessionBase):
    id: int

    class Config:
        orm_mode = True
