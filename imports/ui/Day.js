import React, { Component } from 'react';
import Playpeg from './Playpeg';
import Event from './Event';

export default class Day extends Component {
  render() {
    const images = this.props.events.map((event, eventIndex) => {
      const src = `${this.props.root}/image/${event.relativePath}/${event.image}`;
      return (
        <Event
          key={src}
          event={event}
          day={this.props.day}
          src={src}
          delete={this.props.delete}
          setActive={this.props.setActive}
          isActive={this.props.active === src}
          root={this.props.root}
        />
      );
    });
    return (
      <li
        ref={(e) => { this.element = e; }}
      >
        <h2 className="text-light pt-3">{this.props.day}</h2>
        <ul className="images list-unstyled border-bottom border-light pb-3">
          {images}
        </ul>
      </li>
    );
  }
}
