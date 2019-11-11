import React, { Component } from 'react';
import moment from 'moment';
import { withTracker } from 'meteor/react-meteor-data';
import { Events } from '../api/events.js';
import Day from './Day';
import Stats from './Stats';
import Tags from './Tags';

const ROOT = window.location.port === '3000' ? '' : '/motion-cam';

class App extends Component {
  state = {
    active: false,
    selected: [ 'untagged' ],
  }

  componentDidMount() {
    Meteor.call('days', (err, allDays) => {
      if (!err) {
        const days = allDays.filter(day => day.events.length);
        this.setState({ days });
      }
    });
  }

  render() {
    if (!this.props.ready) {
      return null;
    }
    const eventsGroupedByDay = this.props.events
      .filter((event) => { // @TODO: Could achieve this filtering in mongo query.
        let shouldShow = this.state.selected.length === 0 || event.tags.filter(tag => this.state.selected.includes(tag)).length > 0;
        if (this.state.selected.indexOf('untagged') >= 0) {
          shouldShow = event.tags.length === 0;
        }
        return shouldShow;
      })
      .reduce((days, event) => {
        const day = moment(event.timestamp).format('dddd Do MMMM YYYY');
        if (Object.keys(days).indexOf(day) < 0) {
          days[day] = {
            events: [],
            day,
          };
        }
        days[day].events.push(event);
        return days;
      }, {});
    const days = Object.values(eventsGroupedByDay).map((day, index) => {
      return (
        <Day
          key={`${day.day}${this.state.selected.join(',')}`}
          day={day.day}
          events={day.events}
          root={ROOT}
          setActive={(active) => {
            this.setState({ active });
          }}
          active={this.state.active}
          delete={(event) => {
            const next = Events.findOne(
              { timestamp: { $lt: event.timestamp } },
              { sort: { timestamp: -1 } },
            );
            const active = `${ROOT}/image/${next.relativePath}/${next.image}`;
            Meteor.call('delete', event.relativePath);
            Events.remove({ _id: event._id });
            this.setState({ active });
          }}
        />
      );
    });
    return (
      <div className="container">
        <Stats
          events={this.props.events}
          selected={this.state.selected}
        />
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
        <ul className="text-center days list-unstyled">
          {days}
        </ul>
      </div>
    );
  }
}

export default withTracker(() => {
  const handle = Meteor.subscribe('events');
  let events = Events.find({}, { sort: { timestamp: -1 } }).fetch()
  if (!events) {
    events = []
  }
  return {
    ready: handle.ready(),
    events,
  };
})(App);
