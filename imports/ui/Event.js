import React, { Component } from 'react';
import moment from 'moment';
import LazyLoad from 'react-lazy-load';
import Playpeg from './Playpeg';
import Tags from './Tags';
import { Events } from '../api/events.js';

export default class EventsComponent extends Component {
  setActive = () => {
    if (!this.props.isActive) {
      this.props.setActive(this.props.src);
    }
  }

  render() {
    return (
      <li
        className="image shadow-lg my-2 border border-light"
        onMouseEnter={this.setActive}
        onMouseMove={this.setActive}
      >
        <div className="image__holder bg-dark">
          {this.props.isActive ?
            <Playpeg
              event={this.props.event}
              day={this.props.day}
              root={this.props.root}
            />
            :
            <LazyLoad
              offset={4000}
            >
              <img src={this.props.src} />
            </LazyLoad>
          }
        </div>
        {this.props.event.tags.length === 0 &&
          <div
            className="image__delete bg-danger px-1"
          >
            <button
              onClick={() => {
                this.props.delete(this.props.event);
              }}
              className="text-white close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        }
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
      </li>
    );
  }
}
