"""add bus_type column

Revision ID: 002_add_bus_type
Revises: 001_initial_migration
Create Date: 2026-02-28
"""
from alembic import op
import sqlalchemy as sa

revision = '002_add_bus_type'
down_revision = '001_initial_migration'
branch_labels = None
depends_on = None


def upgrade():
    # Create the enum type first (PostgreSQL)
    bus_type_enum = sa.Enum(
        'SEATER', 'SLEEPER', 'AC_SEATER', 'AC_SLEEPER',
        name='bustype'
    )
    bus_type_enum.create(op.get_bind(), checkfirst=True)

    op.add_column(
        'buses',
        sa.Column(
            'bus_type',
            bus_type_enum,
            nullable=False,
            server_default='SEATER',
        )
    )


def downgrade():
    op.drop_column('buses', 'bus_type')
    op.execute("DROP TYPE IF EXISTS bustype")
