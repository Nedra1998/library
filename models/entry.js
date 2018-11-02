var mongoose = require('mongoose');
var Fuse = require('fuse.js');

var entrySchema = mongoose.Schema({
  title: String,
  authors: [String],
  publishers: [String],
  printers: [String],
  editors: [String],
  owners: [String],
  ownersDescriptions: [String],
  date: Number,
  acquired: Date,
  cost: Number,
  appraisalValue: Number,
  description: String,
  binding: String,
  titleTranscription: String,
  reference: String,
  source: String,
  type: String,
  files: [String]
});

var Entry = module.exports = mongoose.model('Entry', entrySchema);

module.exports.createEntry = (entry, callback) => {
  var newEntry = new Entry({
    entry
  });
  newEntry.save();
  callback(null, newEntry);
}

module.exports.deleteEntry = (id, callback) => {
  Entry.findOne({
    _id: id
  }).remove(callback);
}

module.exports.getBooks = (callback) => {
  Entry.find({
    type: 'BOOK'
  }, callback);
}

module.exports.get = (id, callback) => {
  Entry.findOne({
    _id: id
  }, callback);
}

module.exports.getLetter = (letter, type, callback) => {
  escape = (text) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
  var query = type ? {
    title: new RegExp('^' + escape(letter.toLowerCase()), 'i'),
    type: type
  } : {
    title: new RegExp('^' + escape(letter.toLowerCase()), 'i')
  };
  Entry.find(query, callback);
}

module.exports.getDate = (date, type, callback) => {
  Entry.find(type ? {date: date , type: type} : {date: date}, callback);
}

module.exports.getAll = (type, callback) => {
  Entry.find(type ? {type: type} : {}, callback);
}

module.exports.getName = (name, loggedin, callback) => {
  re = new RegExp('^' + name.toLowerCase() + '$', 'i');
  Entry.find({ authors: re }, (err, authored) => {
    if (err) return callback(err);
    Entry.find({ owners: re }, (err, owned) => {
      if (err) return callback(err);
      callback(null, {
        "author": (loggedin ? authored.map(Entry.serialize) : authored.map(Entry.safeSerialize)),
        "owner": (loggedin ? owned.map(Entry.serialize) : owned.map(Entry.safeSerialize))
      });
    });
  });
}
module.exports.getTitles = (type, callback) => {
  Entry.find(type ? {
    type: type
  } : {}, (err, entries) => {
    if (err) return callback(err);
    var titles = []
    for (var key in entries) {
      titles.push(entries[key].title);
    }
    callback(null, titles);
  });
}
module.exports.getDates = (type, callback) => {
  Entry.find(type ? {
    type: type
  } : {}, (err, entries) => {
    if (err) return callback(err);
    var dates = []
    for (var key in entries) {
      dates.push(entries[key].date);
    }
    callback(null, dates);
  });
}
module.exports.getPeople = (type, callback) => {
  Entry.find(type ? {
    type: type
  } : type, (err, entries) => {
    if(err) return callback(err);
    var people = new Set([]);
    for (var key in entries){
      entries[key].authors.forEach(name => people.add(name));
      entries[key].owners.forEach(owner => people.add(owner));
    }
    callback(null, Array.from(people));
  });
}

module.exports.findSearch = (query, type, loggedin, callback) => {
  Entry.find(type ? { type: type } : {}, (err, entries) => {
    if (err) return callback(err);
    entries = (loggedin ? entries.map(Entry.serialize) : entries.map(Entry.safeSerialize));
    var fuse = new Fuse(entries, {
      shouldSort: true,
      threshold: 0.5,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        'title',
        'authors',
        'publishers',
        'owners',
        'date',
        'printers',
        'source'
      ]
    });
    callback(null, fuse.search(query));
  });
}

module.exports.serialize = (entry) => {
  var zip = (rows) => rows[0].map((_, c) => rows.map((row) => row[c]));
  var owners = [];
  if (entry.owners.length != 0) {
    owners = zip([entry.owners, entry.ownersDescriptions]).map(pair => {
      return {
        'name': pair[0],
        'description': pair[1]
      };
    });
  }
  return {
    id: entry._id,
    title: entry.title,
    authors: entry.authors,
    publisher: entry.publisher,
    printer: entry.printer,
    date: entry.date,
    description: entry.description,
    binding: entry.binding,
    owners: owners,
    cost: entry.cost,
    acquired: new Date(entry.acquired).toISOString(),
    source: entry.source,
    appraisalValue: entry.appraisalValue,
    titleTranscription: entry.titleTranscription,
    reference: entry.reference,
    type: entry.type,
    files: entry.files.map((file) => {
      return path.relative(appRoot + '/public', file);
    })
  };
}
module.exports.safeSerialize = (entry) => {
  var zip = rows => rows[0].map((_, c) => rows.map(row => row[c]));
  var owners = []
  if (entry.owners.length != 0) {
    owners = zip([entry.owners, entry.ownersDescriptions]).map(pair => {
      return {
        'name': pair[0],
        'description': pair[1]
      };
    });
  }
  var toTitle = (string) => {
    if (string == '') return '';
    return string.split(' ').map(word => {
      return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
  };
  return {
    id: entry._id,
    title: entry.title,
    authors: entry.authors,
    publisher: entry.publisher,
    printer: entry.printer,
    date: entry.date,
    description: entry.description,
    binding: entry.binding,
    owners: owners,
    titleTranscription: entry.titleTranscription,
    reference: entry.reference,
    type: entry.type,
    files: entry.files.map((file) => {
      return path.relative(appRoot + '/public', file);
    })
  };
}
