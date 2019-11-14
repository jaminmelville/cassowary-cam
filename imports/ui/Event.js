import React, { Component } from 'react';
import moment from 'moment';
import LazyLoad from 'react-lazy-load';
import { Link } from "react-router-dom";
import Playpeg from './Playpeg';
import Tags from './Tags';
import { Events } from '../api/events.js';
import { ROOT } from '../constants';

export default class EventsComponent extends Component {

  render() {
    return (
      <li
        className="col-xl-4 col-md-6 col-sm-12"
        onMouseEnter={this.props.setActive}
        onMouseMove={this.props.setActive}
      >
        <div className="image my-3 shadow-lg border border-light">
          <Link to={`/event/${this.props.event._id}`}>
            <div className="image__holder bg-dark">
              {this.props.isActive ?
                <Playpeg
                  event={this.props.event}
                />
                :
                <LazyLoad
                  offset={4000}
                >
                  <img src={`${ROOT}/image/${this.props.event.relativePath}/${this.props.event.image}`} />
                </LazyLoad>
              }
            </div>
          </Link>
          {this.props.event.tags.length === 0 && this.props.isActive &&
            <div
              className="image__delete bg-danger px-1"
            >
              <button
                onClick={this.props.delete}
                className="text-white close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          }
          {this.props.isActive &&
            <div className="event__tags">
              <Tags
                selected={this.props.event.tags}
                onChange={(id) => {
                  if (this.props.event.tags.indexOf(id) < 0) {
                    Events.update({ _id: this.props.event._id}, {
                      $addToSet: { tags: id }
                    });
                  } else {
                    Events.update({ _id: this.props.event._id}, {
                      $pull: { tags: id }
                    });
                  }
                }}
              />
            </div>
          }
        </div>
      </li>
    );
  }
}
