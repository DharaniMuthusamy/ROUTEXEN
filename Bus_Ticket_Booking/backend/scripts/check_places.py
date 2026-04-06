from app.db.database import SessionLocal

if __name__ == '__main__':
    db = SessionLocal()
    cnt = db.execute('SELECT COUNT(*) FROM places').scalar()
    rows = db.execute('SELECT name FROM places ORDER BY name LIMIT 20').fetchall()
    print('places count =', cnt)
    for r in rows:
        print('-', r[0])
    db.close()
