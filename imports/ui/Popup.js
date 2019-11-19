import React, { Component } from 'react';
import moment from 'moment';
import LazyLoad from 'react-lazy-load';
import { Link } from "react-router-dom";
import Playpeg from './Playpeg';
import { Tags } from '../api/tags.js';
import { Events } from '../api/events.js';
import { ROOT } from '../constants';

export default class Popup extends Component {

  render() {
    const event = Events.findOne({ _id: this.props.match.params.event });
    const tags = event.tags.map(eventTag =>
      Tags.findOne({ _id: eventTag }).name
    );
    return (
      <div className="popup">
        <Link to={`/tag/${this.props.match.params.tag}`} className="btn btn-secondary">Back to all</Link>
        <h2 className="text-white text-center">{tags.join(', ').toUpperCase()} {tags.length > 0 && '|'} {moment(event.timestamp).format('dddd do MMMM YYYY')}</h2>
        <div className="image my-3 shadow-lg border border-light">
          <div className="image__holder bg-dark">
            <Playpeg
              event={event}
            />
          </div>
        </div>
      </div>
    );
  }
}
