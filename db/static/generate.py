#!/usr/bin/env python3

import json
from pprint import pprint

def gen_entry(entry):
    entry_str = "# {}\n".format(entry['title'])
    entry_str += "## {}\n\n".format(', '.join(entry['authors']))
    entry_str += "**Title:**  {}\n\n".format(entry['title'])
    entry_str += "**Authors:**  {}\n\n".format(', '.join(entry['authors']))
    entry_str += "**Title Transcription:**  {}\n\n".format(entry['titleTranscription'])
    entry_str += "**Printers:**  {}\n\n".format(', '.join(entry['printers']))
    entry_str += "**Date:**  {}\n\n".format(entry['date'])
    entry_str += "**Reference:**  {}\n\n".format(entry['reference'])
    entry_str += "**Binding:**  {}\n\n".format(entry['binding'])
    entry_str += "**Description:**  {}\n\n".format(entry['description'])
    entry_str += "### Owners:\n"
    for i, own in enumerate(entry['owners']):
        entry_str += "* **{}:**  {}\n\n".format(entry['owners'][i], entry['ownersDescriptions'][i])
    entry_str += "\n\n"
    return entry_str


def main():
    DATA = sorted(json.load(open('entries.json', 'r')), key=lambda x: x['authors'][0] if x['authors'] else '')
    with open('static.md', 'w') as file:
        for entry in DATA:
            file.write(gen_entry(entry))


if __name__ == "__main__":
    main()
