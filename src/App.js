import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import './css/App.css';
import Landing from './containers/Landing';
import Login from './containers/Login';
import Signup from './containers/Signup';
//import Dashboard from './containers/Dashboard'; <Route path="/dashboard" component={Dashboard} />

class App extends Component {
  render() {
    return (
      <div class="text-center">
        <div>
          <Route path="/" exact component={Landing} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
        </div>
      </div>
    );
  }
}

export default App;
