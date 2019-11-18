import React, { Component } from 'react';
import moment from 'moment';
import { withTracker } from 'meteor/react-meteor-data';
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Events } from '../api/events.js';
import { Tags } from '../api/tags.js';
import Popup from './Popup';
import Home from './Home';

import { ROOT } from '../constants';

class App extends Component {

  render() {
    if (!this.props.ready) {
      return null;
    }
    return (
      <Router>
        <div className="container">
          <Switch>
            <Route path="/tag/:tag/event/:event" component={Popup} />
            <Route path="/tag/:tag" render={() =>
              <Home
                events={this.props.events}
                tags={this.props.tags}
              />
            } />
            <Redirect
              to="/tag/not-set"
            />
          </Switch>
        </div>
      </Router>
    );
  }
}


export default withTracker(() => {
  const eventsHandle = Meteor.subscribe('events');
  const tagHandle = Meteor.subscribe('tags');
  const events = Events.find({}, { sort: { timestamp: -1 } }).fetch();
  return {
    ready: eventsHandle.ready() && tagHandle.ready(),
    events,
    tags: Tags.find({}, { sort: { name: 1 } }).fetch(),
  };
})(App);
