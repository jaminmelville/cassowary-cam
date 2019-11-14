import React, { Component } from 'react';
import moment from 'moment';
import { withTracker } from 'meteor/react-meteor-data';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Events } from '../api/events.js';
import Event from './Event';
import Stats from './Stats';
import Tags from './Tags';
import Popup from './Popup';

import { ROOT } from '../constants';

class App extends Component {

  state = {
    active: false,
    selected: [ 'untagged' ],
  }

  render() {
    if (!this.props.ready) {
      return null;
    }
    const events = this.props.events
    .filter((event) => {
      let shouldShow = this.state.selected.length === 0 || event.tags.filter(tag => this.state.selected.includes(tag)).length > 0;
      if (this.state.selected.indexOf('untagged') >= 0) {
        shouldShow = event.tags.length === 0;
      }
      return shouldShow;
    })
    .map(event => (
      <Event
        key={event._id}
        event={event}
        isActive={this.state.active === event}
        setActive={() => {
          this.setState({ active: event });
        }}
        delete={() => {
          const next = Events.findOne(
            { timestamp: { $lt: event.timestamp } },
            { sort: { timestamp: -1 } },
          );
          const active = next;
          this.setState({ active }, () => {
            Meteor.call('removeEvent', event._id);
          });
        }}
      />
    ));
    return (
      <Router>
        <div className="container">
          <Route path="/" exact>
            {events.length > 0 &&
              <Stats
                events={this.props.events}
                selected={this.state.selected}
              />
            }
            <div className="filters">
              <Tags
                showUntagged
                selected={this.state.selected}
                onChange={(id) => {
                  if (this.state.selected.indexOf(id) < 0) {
                    this.setState({ selected: [ id ]});
                  } else {
                    const selected = this.state.selected.filter(tag => tag !== id);
                    this.setState({ selected });
                  }
                }}
              />
            </div>
            {events.length === 0 &&
              <p>
                Nothing to see here..
              </p>
            }
            <ul className="row text-center list-unstyled">
              {events}
            </ul>
          </Route>
          <Route path="/event/:id" component={Popup} />
        </div>
      </Router>
    );
  }
}

export default withTracker(() => {
  const handle = Meteor.subscribe('events');
  const events = Events.find({}, { sort: { timestamp: -1 } }).fetch();
  return {
    ready: handle.ready(),
    events,
  };
})(App);
