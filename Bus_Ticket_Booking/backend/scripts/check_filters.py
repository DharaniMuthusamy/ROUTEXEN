import requests
from datetime import date, timedelta

d = date.today() + timedelta(days=1)
base = 'http://localhost:8000/api/buses/search'
params = {'source_city':'Chennai','destination_city':'Coimbatore','journey_date':d.isoformat()}
print('Query:', params)
r = requests.get(base, params=params, timeout=10)
print('status', r.status_code, 'count', len(r.json()))
# try AC_SEATER
params2 = dict(params); params2['bus_type']='AC_SEATER'
r2 = requests.get(base, params=params2, timeout=10)
print('AC_SEATER count', len(r2.json()))
# try SEATER
params3 = dict(params); params3['bus_type']='SEATER'
r3 = requests.get(base, params=params3, timeout=10)
print('SEATER count', len(r3.json()))
