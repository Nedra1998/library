var express = require('express');
var router = express.Router();
var path = require('path');

var Entry = require('../models/entry.js');

var toTitle = (string) => {
  if (typeof string === 'string') {
    return string.split(' ').map(word => {
      return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
  }else if(typeof string === 'object'){
    return string.map(x => {return toTitle(x)});
  }
};

router.get('/', function(req, res, next) {
  Entry.getAll((err, entries) => {
    if (err) return console.log(err)
    if (req.user) return res.json(entries.map(Entry.serialize));
    else return res.json(entries.map(Entry.safeSerialize));
  });
});

router.get('/all', function(req, res, next) {
  var sort = (req.query.sort ? req.query.sort : 'title')
  Entry.getAll(null, (err, entries) => {
    if (err) return console.log(err)
    if (req.user) return res.json(entries.map(Entry.serialize).sort((a, b) => {
      return ((a[sort] < b[sort]) ? -1 : (a[sort] > b[sort]) ? 1 : 0);
    }));
    else return res.json(entries.map(Entry.safeSerialize).sort((a, b) => {
      return ((a[sort] < b[sort]) ? -1 : (a[sort] > b[sort]) ? 1 : 0);
    }));
  });
});

router.get('/index', function(req, res, next) {
  Entry.getTitles(null, (err, entries) => {
    if (err) return console.log(err);
    res.json(entries);
  });
});
router.get('/dates', (req, res, next) => {
  Entry.getDates(null, (err, entries) => {
    if(err) return console.log(err);
    res.json(entries);
  })
})
router.get('/authors', (req, res, next) => {
  Entry.getAuthors(null, (err, entries) => {
    if (err) return console.log(err);
    res.json(entries);
  });
});
router.get('/owners', (req, res, next) => {
  Entry.getOwners(null, (err, entries) => {
    if (err) return console.log(err);
    res.json(entries);
  });
});

router.get('/search', (req, res, next) => {
  var callback = (err, results) => {
    if(err) return console.log(err);
    res.json(results);
  }
  if (req.query.query) Entry.findSearch(req.query.query, null, req.user, callback);
  else if(new Set([req.query.title, req.query.author, req.query.publisher, req.query.printer, req.query.owner]).size > 2) Entry.findAdvanced(req.query, null, req.user, callback);
  else if(req.query.title) Entry.findTitle(req.query.title, null, req.user, callback);
  else if(req.query.author) Entry.findAuthor(req.query.author, null, req.user, callback);
  else if(req.query.publisher) Entry.findPublisher(req.query.publisher, null, req.user, callback);
  else if(req.query.printer) Entry.findPrinter(req.query.printer, null, req.user, callback);
  else if(req.query.owner) Entry.findOwner(req.query.owner, null, req.user, callback);
  else res.json({'error':'search requires some query'});
});

router.get('/letter/:letter', (req, res, next) => {
  Entry.getLetter(req.params.letter, null, (err, entries) => {
    if(err) return console.log(err);
    if (req.user) return res.json(entries.map(Entry.serialize).sort((a, b) => {
      return ((a['title'] < b['title']) ? -1 : (a['title'] > b['title']) ? 1 : 0);
    }));
    else return res.json(entries.map(Entry.safeSerialize).sort((a, b) => {
      return ((a['title'] < b['title']) ? -1 : (a['title'] > b['title']) ? 1 : 0);
    }));
  });
});
router.get('/date/:year', (req, res, next) => {
  Entry.getYear(req.params.year, null, (err, entries) => {
    if(err) return console.log(err);
    if (req.user) return res.json(entries.map(Entry.serialize).sort((a, b) => {
      return (a['date'] < b['date']);
    }));
    else return res.json(entries.map(Entry.safeSerialize).sort((a,b) => {
      return (a['date'] < b['date']);
    }));
  });
});

router.get('/entry/:entry', function(req, res, next) {
  Entry.get(req.params.entry, null, (err, entry) => {
    if (err) return console.log(err);
    if (entry) res.json((req.user ? Entry.serialize(entry) : Entry.safeSerialize(entry)));
    else res.json({
      'error': 'entry not found \'' + req.params.entry + '\''
    });
  });
});

router.get('/delete/:entry', (req, res, next) => {
  if(!req.user) return res.json({'error': 'Must be logged in to delete entry'});
  Entry.deleteEntry(req.params.entry, null, (err, entry) => {
    if(err) return console.log(err);
    res.json({'success':'deleted entry'});
  });
});
router.get('/name/:name', (req, res, next) => {
  Entry.getName(req.params.name, req.user, (err, entry) => {
    if(err) return console.log(err);
    if(entry) res.json(entry);
    else res.json({
      'error': 'name not found \'' + req.params.name + '\''
    });
  });
});


router.post('/', (req, res, next) => {
  if(!req.user) return res.json({'error': 'Must be logged in to create entry'});
  var owners = [];
  var ownersDescriptions = [];
  if (req.body.owners && req.body.owners.length !== 0) {
    owners = JSON.parse(req.body.owners).map(entry => {
      return entry.name
    });
    ownersDescriptions = JSON.parse(req.body.owners).map(entry => {
      return entry.description
    });
  }
  Entry.createEntry({
    title: req.body.title,
    author: req.body.authors,
    publisher: req.body.publisher,
    printer: req.body.printer,
    date: req.body.date,
    description: req.body.description,
    owners: owners,
    ownersDescriptions: ownersDescriptions,
    cost: req.body.cost,
    acquired: req.body.acquired,
    source: req.body.source,
    appraisalValue: req.body.value,
    titleTranscription: req.body.transcription,
    reference: req.body.reference,
    type: req.body.type
  }, (err, entry) => {
    if (err) return console.log(err);
    res.json(Entry.serialize(entry));
    if (req.files) {
      var files = []
      var dir = appRoot + `/public/images/${entry._id}_`;
      for(var key in req.files){
        var name = req.files[key].md5 + '.' + req.files[key].mimetype.split('/')[1];
        files.push(dir + name);
        req.files[key].mv(dir + name, (err) => {
          if(err) return console.log(err);
        });
      }
      Entry.update({id: entry._id}, {files: files}, (err, raw) =>{
        if(err) return console.log(err);
      });
    }
  });
});

router.post('/modify/:id', (req, res, next) => {
  if(!req.user) return res.json({'error': 'Must be logged in to create entry'});
  var owners = [];
  var ownersDescriptions = [];
  if (req.body.owners && req.body.owners.length !== 0) {
    owners = JSON.parse(req.body.owners).map(entry => {
      return entry.name
    });
    ownersDescriptions = JSON.parse(req.body.owners).map(entry => {
      return entry.description
    });
  }
  var data = req.body
  data['owners'] =  owners;
  data['ownersDescriptions'] =  ownersDescriptions;
  Entry.findByIdAndUpdate(req.params.id, data, (err, raw) => {
    if(err) return console.log(err);
    res.json(raw);
    if (req.files) {
      var files = []
      var dir = appRoot + `/public/images/${req.params.id}_`;
      for(var key in req.files){
        var name = req.files[key].md5 + '.' + req.files[key].mimetype.split('/')[1];
        files.push(dir + name);
        req.files[key].mv(dir + name, (err) => {
          if(err) return console.log(err);
        });
      }
      Entry.findByIdAndUpdate(req.params.id, {$set:{files: files}}, (err, raw) => {
        console.log(err, raw);
      });
    }
  })
});

router.post('/upload', (req, res, next) => {
  let imgFile = req.files.file;
  let dest = req.body.dest;
  imageFile.mv(`${__dirname}/../public/${req.body.dest}`, (err) => {
    if(err){return console.log(err)
      return res.status(500).send(err);}
    res.json({file: `public/${req.body.dest}`});
  });
});

module.exports = router;
