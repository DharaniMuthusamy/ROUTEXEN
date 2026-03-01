"""Initial migration

Revision ID: 001
Revises: 
Create Date: 2026-02-28
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=100), nullable=False),
        sa.Column('phone_number', sa.String(length=15), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('is_admin', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    op.create_table(
        'buses',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('bus_number', sa.String(length=20), nullable=False),
        sa.Column('operator_name', sa.String(length=100), nullable=False),
        sa.Column('source_city', sa.String(length=100), nullable=False),
        sa.Column('destination_city', sa.String(length=100), nullable=False),
        sa.Column('journey_date', sa.Date(), nullable=False),
        sa.Column('departure_time', sa.String(length=10), nullable=False),
        sa.Column('arrival_time', sa.String(length=10), nullable=False),
        sa.Column('total_seats', sa.Integer(), nullable=False),
        sa.Column('price_per_seat', sa.Float(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('bus_number'),
    )
    op.create_index(op.f('ix_buses_id'), 'buses', ['id'], unique=False)

    bookingstatus = postgresql.ENUM('PENDING', 'CONFIRMED', 'CANCELLED', name='bookingstatus')
    bookingstatus.create(op.get_bind())

    op.create_table(
        'bookings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('bus_id', sa.Integer(), nullable=False),
        sa.Column('seat_number', sa.Integer(), nullable=False),
        sa.Column('total_amount', sa.Float(), nullable=False),
        sa.Column('booking_time', sa.DateTime(), nullable=True),
        sa.Column('booking_status', sa.Enum('PENDING', 'CONFIRMED', 'CANCELLED', name='bookingstatus'), nullable=True),
        sa.ForeignKeyConstraint(['bus_id'], ['buses.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_bookings_id'), 'bookings', ['id'], unique=False)

    paymentstatus = postgresql.ENUM('SUCCESS', 'FAILED', name='paymentstatus')
    paymentstatus.create(op.get_bind())

    op.create_table(
        'payments',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('booking_id', sa.Integer(), nullable=False),
        sa.Column('payment_method', sa.String(length=50), nullable=False),
        sa.Column('payment_status', sa.Enum('SUCCESS', 'FAILED', name='paymentstatus'), nullable=True),
        sa.Column('transaction_time', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['booking_id'], ['bookings.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_payments_id'), 'payments', ['id'], unique=False)

    op.create_table(
        'notifications',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('message', sa.String(length=500), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_notifications_id'), 'notifications', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_notifications_id'), table_name='notifications')
    op.drop_table('notifications')
    op.drop_index(op.f('ix_payments_id'), table_name='payments')
    op.drop_table('payments')
    op.drop_index(op.f('ix_bookings_id'), table_name='bookings')
    op.drop_table('bookings')
    op.drop_index(op.f('ix_buses_id'), table_name='buses')
    op.drop_table('buses')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')
    op.execute("DROP TYPE IF EXISTS bookingstatus")
    op.execute("DROP TYPE IF EXISTS paymentstatus")
