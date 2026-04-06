import requests
from datetime import date, timedelta

d = date.today() + timedelta(days=1)
url = f"http://localhost:8000/api/buses/search?source_city=Mumbai&destination_city=Pune&journey_date={d.isoformat()}"
print('GET', url)
r = requests.get(url)
print('status', r.status_code)
try:
    data = r.json()
    print('found', len(data), 'buses')
    for x in data[:5]:
        print(x['bus_number'], x['operator_name'], x['journey_date'], x['price_per_seat'])
except Exception as e:
    print('error parsing response', e)
    print(r.text)
