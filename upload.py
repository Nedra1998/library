#!/usr/bin/python3

import csv
import json
import sys
import requests
from pprint import pprint
from dateutil.parser import parse

from currency_converter import CurrencyConverter

def main():
    if len(sys.argv) == 1:
        print("Requires CSV file")
    entries = []
    conv = CurrencyConverter()
    with open(sys.argv[1]) as file:
        lines = csv.reader(file)
        for i, l in enumerate(lines):
            if i != 0:
                item = {}
                if len(l[1].split(', ')) == 2:
                    l[1] = l[1].split(', ')
                    item['author'] = l[1][1] + ' ' + l[1][0]
                elif len(l[1].split(' and ')) > 1:
                    l[1] = l[1].split(' and ')
                    item['author'] = ','.join([x.split(', ')[1] + ' ' + x.split(', ')[0] for x in l[1]])
                else:
                    item['author'] = l[1]
                item['title'] = l[2]
                item['date'] = parse(l[3].split(' ')[0].split('-')[0].rstrip('?')).strftime("%Y-%m-%d") if l[3] else ''
                item['reference'] = l[5]
                item['description'] = l[7]
                item['binding'] = l[6]
                try:
                    item['acquired'] = parse(l[9].split(' ')[0]).strftime("%Y-%m-%d")
                    item['source'] = ' '.join(l[9].split(' ')[1:])
                except:
                    if l[9].split(' ')[0] == '?' or l[9].split(' ')[0] == '??':
                        item['source'] = ' '.join(l[9].split(' ')[1:])
                    else:
                        item['source'] = l[9]
                if l[10] != '' and l[10] != '?':
                    item['cost'] = float(l[10].rstrip('?'))
                elif l[11] != '':
                    item['cost'] = conv.convert(float(l[11]), 'GBP', 'USD')
                if item['title'] != '':
                    entries.append(item)
    for entry in entries:
        print("Uploading {}...".format(entry['title']))
        res = requests.post('https://rasmussen-collection.herokuapp.com/api/book/', entry)


if __name__ == "__main__":
    main()
