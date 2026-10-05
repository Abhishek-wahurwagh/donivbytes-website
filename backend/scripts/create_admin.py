"""
Create the first admin user.

Usage (environment variables):
    ADMIN_NAME="Alice" ADMIN_EMAIL="alice@example.com" ADMIN_PASSWORD="secret" python scripts/create_admin.py

Usage (command-line arguments):
    python scripts/create_admin.py --name "Alice" --email "alice@example.com" --password "secret"

Run from the backend/ directory so that .env is loaded automatically.
"""

import argparse
import os
import sys

# Allow running from backend/ directory
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.db.database import SessionLocal
from app.services.auth_service import create_admin_user, get_user_by_email


def main() -> None:
    parser = argparse.ArgumentParser(description="Create an admin user")
    parser.add_argument("--name", default=os.getenv("ADMIN_NAME"))
    parser.add_argument("--email", default=os.getenv("ADMIN_EMAIL"))
    parser.add_argument("--password", default=os.getenv("ADMIN_PASSWORD"))
    args = parser.parse_args()

    if not args.name or not args.email or not args.password:
        print(
            "ERROR: --name, --email, and --password are required "
            "(or set ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD env vars).",
            file=sys.stderr,
        )
        sys.exit(1)

    if len(args.password) < 8:
        print("ERROR: Password must be at least 8 characters.", file=sys.stderr)
        sys.exit(1)

    db = SessionLocal()
    try:
        existing = get_user_by_email(db, args.email)
        if existing:
            print(f"ERROR: A user with email '{args.email}' already exists.", file=sys.stderr)
            sys.exit(1)

        user = create_admin_user(db, name=args.name, email=args.email, password=args.password)
        print(f"Admin created successfully: id={user.id} email={user.email}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
