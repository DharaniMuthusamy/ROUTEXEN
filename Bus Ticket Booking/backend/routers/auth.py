from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from db.session import get_db
from core.security import hash_password, verify_password, create_access_token, get_current_user
from schemas.users import SignupRequest, LoginRequest, TokenResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup", response_model=TokenResponse)
async def signup(data: SignupRequest, db: AsyncSession = Depends(get_db)):
    # Check if email already exists
    existing = await db.execute(
        text("SELECT id FROM users WHERE email = :email"),
        {"email": data.email},
    )
    if existing.mappings().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Hash password and insert user
    pw_hash = hash_password(data.password)
    result = await db.execute(
        text("""
            INSERT INTO users (name, email, password_hash)
            VALUES (:name, :email, :password_hash)
            RETURNING id
        """),
        {"name": data.name, "email": data.email, "password_hash": pw_hash},
    )
    await db.commit()
    user_row = result.mappings().first()
    user_id = str(user_row["id"])

    # Create and return token
    token = create_access_token({"sub": user_id, "email": data.email})
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    # Look up user
    result = await db.execute(
        text("SELECT id, password_hash FROM users WHERE email = :email"),
        {"email": data.email},
    )
    user = result.mappings().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Verify password
    if not verify_password(data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Create and return token
    user_id = str(user["id"])
    token = create_access_token({"sub": user_id, "email": data.email})
    return TokenResponse(access_token=token)


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": str(current_user["id"]),
        "name": current_user["name"],
        "email": current_user["email"],
        "created_at": str(current_user["created_at"]),
    }