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

router.get('/', function(req, res, next) {
    Entry.getBooks((err, entries) => {
        if (err) return console.log(err)
        res.json(entries.map(entry => {
            return (req.user ? Entry.serialize(entry) : Entry.safeSerialize(entry))
        }));
    });
});
router.post('/', (req, res, next) => {
    var owners = [];
    var ownersDescriptions = [];
    if (req.body.owners) {
        owners = JSON.parse(req.body.owners).map(entry => {
            return entry.name
        });
        ownersDescriptions = JSON.parse(req.body.owners).map(entry => {
            return entry.description
        });
    }
    Entry.createEntry({
        title: req.body.title,
        author: req.body.author.split(','),
        publisher: req.body.publisher,
        printer: req.body.printer,
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
        type: 'BOOK'
    }, (err, entry) => {
        if (err) return console.log(err);
        res.json(Entry.serialize(entry));
    });
});

router.get('/all', function(req, res, next) {
    var sort = (req.query.sort ? req.query.sort : 'title')
    Entry.getAll('BOOK', (err, entries) => {
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
    Entry.getTitles('BOOK', (err, entries) => {
        if (err) return console.log(err);
        res.json(entries.sort());
    });
});
router.get('/dates', (req, res, next) => {
    Entry.getDates('BOOK', (err, entries) => {
        if (err) return console.log(err);
        res.json(entries);
    })
})
router.get('/letter/:letter', (req, res, next) => {
    Entry.getLetter(req.params.letter, 'BOOK', (err, entries) => {
        if (err) return console.log(err);
        if (req.user) return res.json(entries.map(Entry.serialize).sort((a, b) => {
            return ((a['title'] < b['title']) ? -1 : (a['title'] > b['title']) ? 1 : 0);
        }));
        else return res.json(entries.map(Entry.safeSerialize).sort((a, b) => {
            return ((a['title'] < b['title']) ? -1 : (a['title'] > b['title']) ? 1 : 0);
        }));
    });
});
router.get('/date/:year', (req, res, next) => {
    Entry.getYear(req.params.year, 'BOOK', (err, entries) => {
        if (err) return console.log(err);
        if (req.user) return res.json(entries.map(Entry.serialize).sort((a, b) => {
            return (a['date'] < b['date']);
        }));
        else return res.json(entries.map(Entry.safeSerialize).sort((a, b) => {
            return (a['date'] < b['date']);
        }));
    });
});
router.get('/authors', (req, res, next) => {
    Entry.getAuthors('BOOK', (err, entries) => {
        console.log(entries);
        if (err) return console.log(err);
        res.json(entries);
    });
});
router.get('/owners', (req, res, next) => {
    Entry.getOwners('BOOK', (err, entries) => {
        if (err) return console.log(err);
        res.json(entries);
    });
});

router.get('/search', (req, res, next) => {
    var callback = (err, results) => {
        if (err) return console.log(err);
        res.json(results);
    }
    if (req.query.query) Entry.findSearch(req.query.query, 'BOOK', req.user, callback);
    else if (new Set([req.query.title, req.query.author, req.query.publisher, req.query.printer, req.query.owner]).size > 2) Entry.findAdvanced(req.query, 'BOOK', req.user, callback);
    else if (req.query.title) Entry.findTitle(req.query.title, 'BOOK', req.user, callback);
    else if (req.query.author) Entry.findAuthor(req.query.author, 'BOOK', req.user, callback);
    else if (req.query.publisher) Entry.findPublisher(req.query.publisher, 'BOOK', req.user, callback);
    else if (req.query.printer) Entry.findPrinter(req.query.printer, 'BOOK', req.user, callback);
    else if (req.query.owner) Entry.findOwner(req.query.owner, 'BOOK', req.user, callback);
    else res.json({
        'error': 'search requires some query'
    });
});

router.get('/:entry', function(req, res, next) {
    Entry.get(req.params.entry, 'BOOK', (err, entry) => {
        if (err) return console.log(err);
        if (entry) res.json(Entry.serialize(entry));
        else res.json({
            'error': 'entry not found \'' + req.params.entry + '\''
        });
    });
});

module.exports = router;
