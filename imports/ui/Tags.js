import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import moment from 'moment';
import { withTracker } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import { Tags } from '../api/tags.js';

class TagsComponent extends Component {

  render() {
    if (!this.props.ready) {
      return null;
    }
    const tags = this.props.tags.map((item) => {
      const selected = this.props.selected.indexOf(item._id) >= 0;
      const tag = (
        <span key={item._id}>
          <span
            className={classNames('badge tag', {
              'badge-light': selected,
              'badge-dark': !selected,
            })}
            onClick={() => {
              this.props.onChange(item._id);
            }}
          >
            {item.name}
          </span>
          {' '}
        </span>
      );
      return tag;
    });
    if (this.props.showUntagged) {
      tags.push((
        <span key='untagged'>
          <span
            className={classNames('badge tag', {
              'badge-light': this.props.selected.indexOf('untagged') >= 0,
              'badge-dark': this.props.selected.indexOf('untagged') < 0,
            })}
            onClick={() => {
              this.props.onChange('untagged');
            }}
          >
            untagged
          </span>
          {' '}
        </span>
      ))
    }
    return (
      <div>
        {tags}
      </div>
    );
  }

}

export default withTracker(() => {
  const handle = Meteor.subscribe('tags');
  return {
    ready: handle.ready(),
    tags: Tags.find({}, { sort: { name: 1 } }).fetch(),
  };
})(TagsComponent);
