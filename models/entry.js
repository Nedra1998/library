var mongoose = require('mongoose');
var Fuse = require('fuse.js');

var entrySchema = mongoose.Schema({
  title: String,
  author: [String],
  publisher: String,
  printer: String,
  date: Date,
  description: String,
  owners: [String],
  ownersDescriptions: [String],
  cost: Number,
  acquired: Date,
  source: String,
  type: String,
});

var Entry = module.exports = mongoose.model('Entry', entrySchema);

module.exports.createEntry = (entry, callback) => {
  var newEntry = new Entry({
    title: entry.title ? entry.title.toLowerCase() : '',
    author: entry.author ? entry.author.join('|').toLowerCase().split('|') : [],
    publisher: entry.publisher ? entry.publisher.toLowerCase() : '',
    printer: entry.printer ? entry.printer.toLowerCase() : '',
    date: entry.date ? new Date(entry.date) : new Date(0),
    description: entry.description ? entry.description : '',
    owners: entry.owners.length != 0 ? entry.owners.join('|').toLowerCase().split('|') : [],
    ownersDescriptions: entry.ownersDescriptions != [] ? entry.ownersDescriptions : [],
    cost: entry.cost ? entry.cost : 0,
    acquired: entry.acquired ? new Date(entry.acquired) : new Date(0),
    source: entry.source ? entry.source : '',
    type: entry.type ? entry.type : 'BOOK'
  });
  newEntry.save();
  callback(null, newEntry);
}

module.exports.getBooks = (callback) => {
  Entry.find({
    type: 'BOOK'
  }, callback);
}


module.exports.get = (title, type, callback) => {
  Entry.findOne(type ? {
    title: title.toLowerCase(),
    type: type
  } : {
    title: title.toLowerCase()
  }, callback);
}

module.exports.deleteEntry = (title, type, callback) => {
  Entry.findOne(type ? {
    title: title.toLowerCase(),
    type: type
  } : {
    title: title.toLowerCase()
  }).remove(callback);
}

module.exports.getLetter = (letter, type, callback) => {
  var query;
  if (type) query = {
    title: new RegExp('^' + letter.toLowerCase(), 'i'),
    type: type
  };
  else query = {
    title: new RegExp('^' + letter.toLowerCase(), 'i')
  };
  Entry.find(query, callback);
}
module.exports.getAll = (type, callback) => Entry.find((type ? {
  type: type
} : {}), callback);
module.exports.getTitle = (title, callback) => {
  Entry.find({
    title: title.toLowerCase()
  }, callback);
}
module.exports.getAuthor = (author, callback) => {
  Entry.find({
    author: author.toLowerCase()
  }, callback);
}
module.exports.getPublisher = (publisher, callback) => {
  Entry.find({
    publisher: publisher.toLowerCase()
  }, callback);
}
module.exports.getPrinter = (printer, callback) => {
  Entry.find({
    printer: printer.toLowerCase()
  }, callback);
}
module.exports.getOwner = (name, callback) => {
  Entry.find({
    owners: name.toLowerCase()
  }, callback);
}

module.exports.getName = (name, loggedin, callback) => {
  Entry.find({
    author: name.toLowerCase()
  }, (err, authored) => {
    if (err) return callback(err);
    Entry.find({
      owner: name.toLowerCase()
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
      entries[key].owners.forEach(name => owners.add(name.name));
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
      entries[key].owners.forEach(owner => people.add(owner.name));
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
  var zip = rows => rows[0].map((_, c) => rows.map(row => row[c]));
  var owners = []
  if (entry.owners.length != 0) {
    owners = zip([entry.owners, entry.ownersDescription]).map(pair => {
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
    title: toTitle(entry.title),
    author: entry.author ? entry.author.map(auth => {
      return toTitle(auth);
    }) : [],
    publisher: toTitle(entry.publisher),
    printer: toTitle(entry.printer),
    date: new Date(entry.date).toISOString(),
    description: entry.description,
    owners: owners,
    cost: entry.cost,
    acquired: new Date(entry.acquired).toISOString(),
    source: entry.source,
    type: entry.type
  };
}
module.exports.safeSerialize = (entry) => {
  var zip = rows => rows[0].map((_, c) => rows.map(row => row[c]));
  var owners = []
  if (entry.owners.length != 0) {
    owners = zip([entry.owners, entry.ownersDescription]).map(pair => {
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
    title: toTitle(entry.title),
    author: entry.author ? entry.author.map(auth => {
      return toTitle(auth);
    }) : [],
    publisher: toTitle(entry.publisher),
    printer: toTitle(entry.printer),
    date: new Date(entry.date).toISOString(),
    description: entry.description,
    owners: owners,
    type: entry.type
  };
}
