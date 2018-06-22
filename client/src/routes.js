import React from 'react';
import {Switch, Route} from 'react-router';

import Home from './views/home.js';
import Book from './views/books.js';
import People from './views/people.js';
import Create from './views/create.js';
import Modify from './views/modify.js';
import Entry from './views/entry.js';
import Person from './views/person.js';
import Login from './views/login.js';
import CreateUser from './views/createUser.js';
import DeleteUser from './views/deleteUser.js';

export default (
  <Switch>
    <Route exact path='/' component={Home} />
    <Route exact path='/books' component={Book} />
    <Route exact path='/people' component={People} />
    <Route exact path='/create' component={Create} />
    <Route path='/modify/:title' component={Modify} />
    <Route path='/entry/:title' component={Entry} />
    <Route path='/people/:name' component={Person} />
    <Route exact path='/users/login' component={Login} />
    <Route exact path='/users/create' component={CreateUser} />
    <Route exact path='/users/delete' component={DeleteUser} />
  </Switch>
)
