mongoexport -h ds131687.mlab.com:31687 -d rasmussen-collection -c entries -u Admin -p ArdenRasmussen1998 -o $(date +%d.%m.%y).json --jsonArray
mongoexport -h ds131687.mlab.com:31687 -d rasmussen-collection -c users -u Admin -p ArdenRasmussen1998 -o users-$(date +%d.%m.%y).json --jsonArray
