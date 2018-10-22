var mongoose = require('mongoose');
var Fuse = require('fuse.js');
var path = require('path');

var entrySchema = mongoose.Schema({
  title: String,
  author: [String],
  publisher: [String],
  printer: [String],
  editor: [String],
  date: Date,
  year: Number,
  description: String,
  binding: String,
  owners: [String],
  ownersDescriptions: [String],
  cost: Number,
  acquired: Date,
  appraisalValue: Number,
  titleTranscription: String,
  reference: String,
  source: String,
  type: String,
  files: [String]
});

var Entry = module.exports = mongoose.model('Entry', entrySchema);

module.exports.createEntry = (entry, callback) => {
  var newEntry = new Entry({
    title: entry.title ? entry.title : '',
    author: entry.author ? entry.author : [],
    publisher: entry.publisher ? entry.publisher : [],
    printer: entry.printer ? entry.printer : [],
    editor: entry.editor ? entry.editor : [],
    date: entry.date ? new Date(entry.date) : new Date(0),
    year: entry.year ? entry.year : 0,
    description: entry.description ? entry.description : '',
    binding: entry.binding ? entry.binding : '',
    owners: entry.owners.length != 0 ? entry.owners : [],
    ownersDescriptions: entry.ownersDescriptions != [] ? entry.ownersDescriptions : [],
    cost: entry.cost ? entry.cost : 0,
    acquired: entry.acquired ? new Date(entry.acquired) : new Date(0),
    appraisalValue: entry.appraisalValue ? entry.appraisalValue : 0,
    titleTranscription: entry.titleTranscription ? entry.titleTranscription : '',
    reference: entry.reference ? entry.reference : '',
    source: entry.source ? entry.source : '',
    type: entry.type ? entry.type : 'BOOK',
    files: []
  });
  newEntry.save();
  callback(null, newEntry);
}

module.exports.getBooks = (callback) => {
  Entry.find({
    type: 'BOOK'
  }, callback);
}


module.exports.get = (id, type, callback) => {
  Entry.findOne(type ? {
    _id: id,
    type: type
  } : {
    _id: id,
  }, callback);
}

module.exports.deleteEntry = (id, type, callback) => {
  Entry.findOne(type ? {
    _id: id,
    type: type
  } : {
    _id: id,
  }).remove(callback);
}

module.exports.getLetter = (letter, type, callback) => {
  escape = (text) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
  var query;
  if (type) query = {
    title: new RegExp('^' + escape(letter.toLowerCase()), 'i'),
    type: type
  };
  else query = {
    title: new RegExp('^' + escape(letter.toLowerCase()), 'i')
  };
  Entry.find(query, callback);
}
module.exports.getYear = (year, type, callback) => {
  Entry.find((type ? {type: type} : {}), (err, entries) => {
    if(err) return callback(err);
    var matches = [];
    var match = parseInt(year);
    entries.forEach(entry => {
      if(entry.year === match){
        matches.push(entry);
      }
    });
    callback(null, matches);
  });
}
module.exports.getAll = (type, callback) => Entry.find((type ? {
  type: type
} : {}), callback);
module.exports.getTitle = (title, callback) => {
  Entry.find({
    title: new RegExp("^" + title.toLowerCase(), "i"),
  }, callback);
}
module.exports.getAuthor = (author, callback) => {
  Entry.find({
    author: new RegExp("^" + author.toLowerCase(), "i"),
  }, callback);
}
module.exports.getPublisher = (publisher, callback) => {
  Entry.find({
    publisher: new RegExp("^" + publisher.toLowerCase(), "i"),
  }, callback);
}
module.exports.getPrinter = (printer, callback) => {
  Entry.find({
    printer: new RegExp("^" + printer.toLowerCase(), "i"),
  }, callback);
}
module.exports.getOwner = (name, callback) => {
  Entry.find({
    owners: new RegExp("^" + owners.toLowerCase(), "i"),
  }, callback);
}

module.exports.getName = (name, loggedin, callback) => {
  Entry.find({
    author: new RegExp("^" + name.toLowerCase() + "$", "i"),
  }, (err, authored) => {
    if (err) return callback(err);
    Entry.find({
      owners: new RegExp("^" + name.toLowerCase() + "$", "i"),
    }, (err, owned) => {
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
module.exports.getAuthors = (type, callback) => {
  Entry.find(type ? {
    type: type
  } : {}, (err, entries) => {
    if (err) return callback(err);
    var authors = new Set([]);
    for (var key in entries) {
      entries[key].author.forEach(name => authors.add(name));
    }
    callback(null, Array.from(authors));
  });
}
module.exports.getOwners = (type, callback) => {
  Entry.find(type ? {
    type: type
  } : type, (err, entries) => {
    if (err) return callback(err);
    var owners = new Set([]);
    for (var key in entries) {
      entries[key].owners.forEach(name => owners.add(name));
    }
    callback(null, Array.from(owners));
  });
}

module.exports.getPeople = (type, callback) => {
  Entry.find(type ? {
    type: type
  } : type, (err, entries) => {
    if(err) return callback(err);
    var people = new Set([]);
    for (var key in entries){
      entries[key].author.forEach(name => people.add(name));
      entries[key].owners.forEach(owner => people.add(owner));
    }
    callback(null, Array.from(people));
  });
}

module.exports.findSearch = (query, type, loggedin, callback) => {
  Entry.find(type ? {
    type: type
  } : {}, (err, entries) => {
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
        'author',
        'publisher',
        'owners',
        'date',
        'printer',
        'source'
      ]
    });
    callback(null, fuse.search(query));
  });
}
module.exports.findAdvanced = (query, type, loggedin, callback) => {
  Entry.find(type ? {
    type: type
  } : type, (err, entries) => {
    if (err) return callback(err);
    entries = (loggedin ? entries.map(Entry.serialize) : entries.map(Entry.safeSerialize));
    if (query.title) {
      var titleSearch = new Fuse(entries, {
        keys: ['title']
      });
      entries = titleSearch.search(query.title);
    }
    if (query.author) {
      var authorSearch = new Fuse(entries, {
        keys: ['author']
      });
      entries = authorSearch.search(query.author);
    }
    if (query.publisher) {
      var publisherSearch = new Fuse(entries, {
        keys: ['publisher']
      });
      entries = publisherSearch.search(query.publisher);
    }
    if (query.printer) {
      var printerSearch = new Fuse(entries, {
        keys: ['printer']
      });
      entries = printerSearch.search(query.printer);
    }
    if (query.owner) {
      var ownerSearch = new Fuse(entries, {
        keys: ['owners.name']
      });
      entries = ownerSearch.search(query.owner);
    }
    callback(null, entries);
  });
}
module.exports.findTitle = (query, type, loggedin, callback) => {
  Entry.find(type ? {
    type: type
  } : {}, (err, entries) => {
    if (err) return callback(err);
    entries = (loggedin ? entries.map(Entry.serialize) : entries.map(Entry.safeSerialize));
    var fuse = new Fuse(entries, {
      shouldSort: true,
      keys: ['title']
    });
    callback(null, fuse.search(query));
  });
}
module.exports.findAuthor = (query, type, loggedin, callback) => {
  Entry.find(type ? {
    type: type
  } : {}, (err, entries) => {
    if (err) return callback(err);
    entries = (loggedin ? entries.map(Entry.serialize) : entries.map(Entry.safeSerialize));
    var fuse = new Fuse(entries, {
      shouldSort: true,
      keys: ['author']
    });
    callback(null, fuse.search(query));
  });
}
module.exports.findPerson = (query, type, loggedin, callback) => {
  Entry.getPeople(type, (err, entries) => {
    if (err) return callback(err);
    var fuse = new Fuse(entries, {
      shouldSort: true,
    });
    callback(null, fuse.search(query).map(id => {return entries[id]}));
  });
}
module.exports.findPublisher = (query, type, loggedin, callback) => {
  Entry.find(type ? {
    type: type
  } : {}, (err, entries) => {
    if (err) return callback(err);
    entries = (loggedin ? entries.map(Entry.serialize) : entries.map(Entry.safeSerialize));
    var fuse = new Fuse(entries, {
      shouldSort: true,
      keys: ['publisher']
    });
    callback(null, fuse.search(query));
  });
}
module.exports.findPrinter = (query, type, loggedin, callback) => {
  Entry.find(type ? {
    type: type
  } : {}, (err, entries) => {
    if (err) return callback(err);
    entries = (loggedin ? entries.map(Entry.serialize) : entries.map(Entry.safeSerialize));
    var fuse = new Fuse(entries, {
      shouldSort: true,
      keys: ['printer']
    });
    callback(null, fuse.search(query));
  });
}
module.exports.findOwner = (query, type, loggedin, callback) => {
  Entry.find(type ? {
    type: type
  } : {}, (err, entries) => {
    if (err) return callback(err);
    entries = (loggedin ? entries.map(Entry.serialize) : entries.map(Entry.safeSerialize));
    var fuse = new Fuse(entries, {
      shouldSort: true,
      keys: ['owners.name']
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
    author: entry.author ? entry.author.map(auth => {
      return auth;
    }) : [],
    publisher: entry.publisher,
    printer: entry.printer,
    editor: entry.editor,
    date: new Date(entry.date).toISOString(),
    year: entry.year,
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
    author: entry.author ? entry.author.map(auth => {
      return auth;
    }) : [],
    publisher: entry.publisher,
    printer: entry.printer,
    editors: entry.editors,
    date: new Date(entry.date).toISOString(),
    year: entry.year,
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
