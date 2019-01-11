var express = require('express');
var Fuse = require('fuse.js');

var Entry = require('../models/entry.js');

var router = express.Router();

var people = []
var lastDate = 0;

function genObj(entries) {
  lastDate = new Date;
  var tmpPeople = {}
  for (var i = 0; i < entries.length; i++) {
    for (var j = 0; j < entries[i].authors.length; j++) {
      if (entries[i].authors[j] in tmpPeople) {
        tmpPeople[entries[i].authors[j]].authored.push(entries[i].id);
      } else {
        tmpPeople[entries[i].authors[j]] = {
          authored: [entries[i].id],
          published: [],
          printed: [],
          edited: [],
          owned: []
        }
      }
    }
    for (var j = 0; j < entries[i].publishers.length; j++) {
      if (entries[i].publishers[j] in tmpPeople) {
        tmpPeople[entries[i].publishers[j]].published.push(entries[i].id);
      } else {
        tmpPeople[entries[i].publishers[j]] = {
          authored: [],
          published: [entries[i].id],
          printed: [],
          edited: [],
          owned: []
        }
      }
    }
    for (var j = 0; j < entries[i].printers.length; j++) {
      if (entries[i].printers[j] in tmpPeople) {
        tmpPeople[entries[i].printers[j]].printed.push(entries[i].id);
      } else {
        tmpPeople[entries[i].printers[j]] = {
          authored: [],
          published: [],
          printed: [entries[i].id],
          edited: [],
          owned: []
        }
      }
    }
    for (var j = 0; j < entries[i].editors.length; j++) {
      if (entries[i].editors[j] in tmpPeople) {
        tmpPeople[entries[i].editors[j]].edited.push(entries[i].id);
      } else {
        tmpPeople[entries[i].editors[j]] = {
          authored: [],
          published: [],
          printed: [],
          edited: [entries[i].id],
          owned: []
        }
      }
    }
    for (var j = 0; j < entries[i].owners.length; j++) {
      if (entries[i].owners[j] in tmpPeople) {
        tmpPeople[entries[i].owners[j]].owned.push(entries[i].id);
      } else {
        tmpPeople[entries[i].owners[j]] = {
          authored: [],
          published: [],
          printed: [],
          edited: [],
          owned: [entries[i].id]
        }
      }
    }
  }
  people = []
  for(var key in tmpPeople){
    people.push({
      name: key,
      authored: tmpPeople[key].authored,
      published: tmpPeople[key].published,
      printed: tmpPeople[key].printed,
      edited: tmpPeople[key].edited,
      owned: tmpPeople[key].owned
    });
  }
  return people;
}

router.get('/', (req, res, next) => {
  if ((new Date) - lastDate > 15 * 1000) {
    Entry.getAll(null, (err, entries) => {
      if (err) return console.log(err);
      else return res.json(genObj(entries));
    });
  } else {
    return res.json(people);
  }
});

router.get('/search', (req, res) => {
  if ((new Date) - lastDate > 15 * 1000) {
    Entry.getAll(null, (err, entries) => {
      if (err) return console.log(err);
    });
  }
  var fuse = new Fuse(people, {
    shouldSort: true,
    threshold: 0.5,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['name', 'authored', 'owned', 'edited', 'published', 'printed']
  });
  res.json(fuse.search(req.query.query));
});

module.exports = router;
