var express = require('express');
var router = express.Router();

var Entry = require('../models/entry.js');

var toTitle = (string) => {
  if (typeof string === 'string') {
    return string.split(' ').map(word => {
      return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
  } else if (typeof string === 'object') {
    return string.map(x => {
      return toTitle(x)
    });
  }
};

router.get('/all', function(req, res, next) {
  Entry.getPeople(null, (err, people) => {
    if (err) return console.log(err);
    res.json(people.sort());
  });
});

router.get('/index', (req, res, next) => {
  Entry.getPeople(null, (err, people) => {
    if(err) return console.log(err);
    res.json(people.sort());
  });
});

router.get('/search', (req, res, next) => {
  var callback = (err, results) => {
    if (err) return console.log(err);
    res.json(results);
  }
  if (req.query.query) Entry.findPerson(req.query.query, null, req.user, callback);
  else res.json({
    'error': 'search requires some query'
  });
});

router.get('/letter/:letter', (req, res, next) => {
  Entry.getAuthors(null, (err, authors) => {
    if (err) return console.log(err);
    Entry.getOwners(null, (err, owners) => {
      if (err) return console.log(err);
      const people = [];
      authors.concat(owners).sort().forEach((person) => {
        if (person[0] === req.params.letter.toUpperCase()) {
          people.push(person);
        }
      });
      return res.json(people);
    });
  });
});

module.exports = router;
