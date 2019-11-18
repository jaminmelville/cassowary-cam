import React, { Component } from 'react';
import moment from 'moment';
import LazyLoad from 'react-lazy-load';
import { Link } from "react-router-dom";
import Playpeg from './Playpeg';
import Tags from './Tags';
import { Events } from '../api/events.js';
import { ROOT } from '../constants';
import Event from './Event';

export default class EventsComponent extends Component {

  state = {
    active: false,
  }

  render() {
    const events = this.props.events.map(event => (
      <Event
        key={event._id}
        tag={this.props.tag}
        tags={this.props.tags}
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
      <ul className="row text-center list-unstyled">
        {events}
      </ul>
    );
  }
}
