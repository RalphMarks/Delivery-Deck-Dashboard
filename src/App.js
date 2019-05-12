import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import './css/App.css';
import ActivateUser from './components/ActivateUser';
import Landing from './containers/Landing';
import Login from './containers/Login';
import Signup from './containers/Signup';
import Dashboard from './containers/Dashboard';
import TrackingPage from './containers/TrackingPage';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

class App extends Component {
  render() {
    return (
      <div className="text-center">
        <div>
          <Route path="/" exact component={Landing} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/activate_user" component={ActivateUser} />
          <Route
          path="/tracking/:tracking_code"
          component={TrackingPage}
        />
        </div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
