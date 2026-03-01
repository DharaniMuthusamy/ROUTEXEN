import sqlite3
conn=sqlite3.connect('routexen_local.db')
c=conn.cursor()
c.execute("SELECT name FROM sqlite_master WHERE type='table'")
print('tables:', c.fetchall())
try:
    c.execute('SELECT count(*) FROM users')
    print('users_count=', c.fetchone()[0])
except Exception as e:
    print('users table check error:', e)
conn.close()
