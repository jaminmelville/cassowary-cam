import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import moment from 'moment';
import { withTracker } from 'meteor/react-meteor-data';
import classNames from 'classnames';

export default class TagsComponent extends Component {

  render() {
    const tags = this.props.tags.map((item) => {
      const selected = this.props.selected.indexOf(item.name) >= 0;
      const tag = (
        <span key={item._id}>
          <span
            className={classNames('badge tag', {
              'badge-light': selected,
              'badge-dark': !selected,
            })}
            onClick={() => {
              this.props.onChange(item);
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
              'badge-light': this.props.selected.indexOf('not-set') >= 0,
              'badge-dark': this.props.selected.indexOf('not-set') < 0,
            })}
            onClick={() => {
              this.props.onChange({ name: 'not-set' });
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
