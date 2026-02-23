from osm_village_fetcher import fetch_villages_for_district, fetch_villages_by_coordinates

print('Testing Nagpur...')
v = fetch_villages_for_district('Nagpur', 'Maharashtra', 10)
print(f'Found {len(v)} villages')

if len(v) == 0:
    print('Trying fallback...')
    v = fetch_villages_by_coordinates('Nagpur', 'Maharashtra', 21.1458, 79.0882, 10)

for village in v[:5]:
    print(f'{village["name"]} - {village["latitude"]}, {village["longitude"]}')
