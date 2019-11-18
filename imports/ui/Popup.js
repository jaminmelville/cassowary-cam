import React, { Component } from 'react';
import moment from 'moment';
import LazyLoad from 'react-lazy-load';
import { Link } from "react-router-dom";
import Playpeg from './Playpeg';
import Tags from './Tags';
import { Events } from '../api/events.js';
import { ROOT } from '../constants';

export default class Popup extends Component {

  render() {
    const event = Events.findOne({ _id: this.props.match.params.event });
    return (
      <div className="popup">
        <Link to="/" className="btn btn-secondary">Back to all</Link>
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
