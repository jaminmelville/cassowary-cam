import React, { Component } from 'react';
import moment from 'moment';
import LazyLoad from 'react-lazy-load';
import { Link, withRouter } from "react-router-dom";
import Playpeg from './Playpeg';
import Tags from './Tags';
import Events from './Events';
import Stats from './Stats';
import { ROOT } from '../constants';

class Home extends Component {

  render() {
    const tag = this.props.match.params.tag;
    const events = this.props.events
      .filter((event) => {
        let shouldShow = false;
        if (tag === 'not-set') {
          shouldShow = event.tags.length === 0;
        } else {
          shouldShow = event.tags.some(eventTag =>
            this.props.tags.find(t => t.name === tag)._id === eventTag
          );
        }
        return shouldShow;
      });
    return (
      <>
        <div className="filters text-center">
          <Tags
          tags={this.props.tags}
          showUntagged
          selected={[ tag ]}
          onChange={(t) => {
            if (tag !== t.name) {
              this.props.history.push(`/tag/${t.name}`);
            }
          }}
          />
        </div>
        {events.length > 0 &&
          <>
            <Stats
              events={events}
            />
            <Events
              events={events}
              tag={tag}
              tags={this.props.tags}
            />
          </>
        }
        {events.length === 0 &&
          <h1 className="text-white text-center py-4">
            No results.
          </h1>
        }

      </>
    );
  }
}

export default withRouter(Home);
