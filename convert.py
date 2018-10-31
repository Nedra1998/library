import json

with open("test.json") as file:
    data = json.load(file)

for elem in data:
    elem['date'] = int(elem['date']['$date'].split('-')[0])
    elem['publishers'] = [elem['publisher']] if elem['publisher'] != '' else []
    elem['printers'] = [elem['printer']] if elem['printer'] != '' else []
    elem['authors'] = elem['author']
    elem.pop('author', None)
    elem.pop('publisher', None)
    elem.pop('printer', None)
    elem['editors'] = []

with open('out.json', 'w') as file:
    json.dump(data, file)
# print(data)
