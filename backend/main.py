from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from datetime import date, timedelta
import os
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

app = FastAPI(title="BoringDeskSelector API", version="1.0.0")

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase: Client = create_client(
    os.getenv("SUPABASE_URL", ""),
    os.getenv("SUPABASE_KEY", ""),
)


class ReservationCreate(BaseModel):
    desk_id: str
    date: date
    name: str


class ReservationUpdate(BaseModel):
    name: str


class WfhCreate(BaseModel):
    date: date
    name: str


@app.get("/")
def root():
    return {
        "system": "BoringDeskSelector",
        "version": "1.0.0",
        "status": "ONLINE",
        "message": "All systems operational",
    }


@app.get("/desks")
def get_desks():
    result = supabase.table("desks").select("*").order("area").order("pod").order("position_row").order("position_col").execute()
    return result.data


@app.get("/reservations")
def get_reservations(date: Optional[str] = None):
    query = supabase.table("reservations").select("*")
    if date:
        query = query.eq("date", date)
    result = query.execute()
    return result.data


@app.post("/reservations", status_code=201)
def create_reservation(reservation: ReservationCreate):
    today = date.today()
    max_date = today + timedelta(days=7)

    if reservation.date < today:
        raise HTTPException(
            status_code=400,
            detail="ERR: Cannot reserve desks in the past"
        )
    if reservation.date > max_date:
        raise HTTPException(
            status_code=400,
            detail=f"ERR: Max booking window is 7 days ahead ({max_date})"
        )

    # Verify desk exists and is reservable
    desk_result = supabase.table("desks").select("*").eq("id", reservation.desk_id).execute()
    if not desk_result.data:
        raise HTTPException(status_code=404, detail="ERR: Desk not found")
    desk = desk_result.data[0]
    if not desk.get("is_reservable"):
        raise HTTPException(status_code=400, detail="ERR: Desk is not reservable")

    # Check for existing reservation
    existing = (
        supabase.table("reservations")
        .select("*")
        .eq("desk_id", reservation.desk_id)
        .eq("date", str(reservation.date))
        .execute()
    )
    if existing.data:
        raise HTTPException(status_code=409, detail="ERR: Desk already claimed for this date")

    result = supabase.table("reservations").insert({
        "desk_id": reservation.desk_id,
        "date": str(reservation.date),
        "name": reservation.name.strip(),
    }).execute()

    return result.data[0]


@app.put("/reservations/{reservation_id}")
def update_reservation(reservation_id: str, update: ReservationUpdate):
    if not update.name.strip():
        raise HTTPException(status_code=400, detail="ERR: Name cannot be empty")

    result = (
        supabase.table("reservations")
        .update({"name": update.name.strip()})
        .eq("id", reservation_id)
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="ERR: Reservation not found")

    return result.data[0]


@app.delete("/reservations/{reservation_id}")
def delete_reservation(reservation_id: str):
    supabase.table("reservations").delete().eq("id", reservation_id).execute()
    return {"status": "OK", "message": "Reservation cleared"}


# --- WFH endpoints ---

@app.get("/wfh")
def get_wfh(date: Optional[str] = None):
    query = supabase.table("wfh_entries").select("*").order("created_at")
    if date:
        query = query.eq("date", date)
    result = query.execute()
    return result.data


@app.post("/wfh", status_code=201)
def create_wfh(entry: WfhCreate):
    if not entry.name.strip():
        raise HTTPException(status_code=400, detail="ERR: Name cannot be empty")

    existing = (
        supabase.table("wfh_entries")
        .select("*")
        .eq("date", str(entry.date))
        .eq("name", entry.name.strip())
        .execute()
    )
    if existing.data:
        raise HTTPException(status_code=409, detail="ERR: Already marked as WFH for this date")

    result = supabase.table("wfh_entries").insert({
        "date": str(entry.date),
        "name": entry.name.strip(),
    }).execute()

    return result.data[0]


@app.delete("/wfh/{entry_id}")
def delete_wfh(entry_id: str):
    supabase.table("wfh_entries").delete().eq("id", entry_id).execute()
    return {"status": "OK", "message": "WFH entry removed"}


# --- OOO endpoints ---

@app.get("/ooo")
def get_ooo(date: Optional[str] = None):
    query = supabase.table("ooo_entries").select("*").order("created_at")
    if date:
        query = query.eq("date", date)
    result = query.execute()
    return result.data


@app.post("/ooo", status_code=201)
def create_ooo(entry: WfhCreate):
    if not entry.name.strip():
        raise HTTPException(status_code=400, detail="ERR: Name cannot be empty")

    existing = (
        supabase.table("ooo_entries")
        .select("*")
        .eq("date", str(entry.date))
        .eq("name", entry.name.strip())
        .execute()
    )
    if existing.data:
        raise HTTPException(status_code=409, detail="ERR: Already marked as OOO for this date")

    result = supabase.table("ooo_entries").insert({
        "date": str(entry.date),
        "name": entry.name.strip(),
    }).execute()

    return result.data[0]


@app.delete("/ooo/{entry_id}")
def delete_ooo(entry_id: str):
    supabase.table("ooo_entries").delete().eq("id", entry_id).execute()
    return {"status": "OK", "message": "OOO entry removed"}
