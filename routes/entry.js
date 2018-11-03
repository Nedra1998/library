var express = require('express');

var Entry = require('../models/entry.js');

var router = express.Router();

function glist(elems) {
  if (Array.isArray(elems)){
    return elems
  }else if(elems !== null){
    return [elems]
  }else{
    return []
  }
}

router.get('/', function(req, res, next) {
  Entry.getAll(null, (err, entries) => {
    if (err) return console.log(err)
    if (req.user) return res.json(entries.map(Entry.serialize));
    else return res.json(entries.map(Entry.safeSerialize));
  });
});

router.get('/titles', function(req, res, next) {
  Entry.getTitles(null, (err, entries) => {
    if (err) return console.log(err);
    res.json(entries);
  });
});

router.get('/titles/:letter', (req, res) => {
  Entry.getLetter(req.params.letter, null, (err, entries) => {
    console.log(entries);
    if (err) return console.log(err);
    if (req.user) return res.json(entries.map(Entry.serialize).sort((a, b) => {
      return ((a['title'] < b['title']) ? -1 : (a['title'] > b['title']) ? 1 : 0);
    }));
    else return res.json(entries.map(Entry.safeSerialize).sort((a, b) => {
      return ((a['title'] < b['title']) ? -1 : (a['title'] > b['title']) ? 1 : 0);
    }));
  });
});

router.get('/dates', function(req, res, next) {
  Entry.getDates(null, (err, entries) => {
    if (err) return console.log(err);
    res.json(entries);
  });
});

router.get('/dates/:year', (req, res, next) => {
  Entry.getDate(req.params.year, null, (err, entries) => {
    if(err) return console.log(err);
    if (req.user) return res.json(entries.map(Entry.serialize).sort((a, b) => {
      return (a['date'] < b['date']);
    }));
    else return res.json(entries.map(Entry.safeSerialize).sort((a,b) => {
      return (a['date'] < b['date']);
    }));
  });
});

router.get('/delete/:id', (req, res, next) => {
  if(!req.user) return res.json({'error': 'Must be logged in to delete entry'});
  Entry.deleteEntry(req.params.id, null, (err, entry) => {
    if(err) return console.log(err);
    res.json({'success':'deleted entry'});
  });
});

router.get('/name', (req, res, next) => {
  Entry.getName(req.query.name, req.user, (err, entry) => {
    if(err) return console.log(err);
    if(entry) res.json(entry);
    else res.json({
      'error': 'name not found \'' + req.params.name + '\''
    });
  });
});

router.get('/search', (req,res) => {
  Entry.findSearch(req.query.query, null, req.user, (err, results) => {
    res.json(results);
  });
});

router.get('/id/:id', (req, res) => {
  Entry.get(req.params.id, (err, entry) => {
    if (err) return console.log(err);
    if (entry) res.json((req.user ? Entry.serialize(entry) : Entry.safeSerialize(entry)));
    else res.json({
      'error': 'entry not found \'' + req.params.entry + '\''
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
    authors: glist(req.body.authors),
    publishers: glist(req.body.publishers),
    printers: glist(req.body.printers),
    editors: glist(req.body.editors),
    date: req.body.date,
    description: req.body.description,
    binding: req.body.binding,
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


module.exports = router;
