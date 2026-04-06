import requests
from datetime import date, timedelta

# adjust date as needed
d = date.today() + timedelta(days=1)
url = f'http://localhost:8000/api/buses/search?source_city=Chennai&destination_city=Coimbatore&journey_date={d.isoformat()}'
print('GET', url)
try:
    r = requests.get(url, timeout=10)
    print('status', r.status_code)
    data = r.json()
    print('found', len(data), 'buses')
    for x in data[:10]:
        print(x['bus_number'], x['operator_name'], x['journey_date'], x['price_per_seat'], x.get('available_seats'))
except Exception as e:
    print('error', e)
    print(r.text if 'r' in locals() else '')
