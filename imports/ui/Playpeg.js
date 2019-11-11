import React, { Component } from 'react';
import Playpeg from './Playpeg';
import eachLimit from 'async/eachLimit';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.cached = [];
    this.index = 0;
    this.loaded = new Set();
    this.imagesToLoadInParallel = 3;
    this.state = {
      image: this.props.event.image,
    };
  }

  componentDidMount() {
    Meteor.call('images', this.props.event.relativePath, (err, images) => {
      eachLimit(images, this.imagesToLoadInParallel, (image, callback) => {
        const img = new Image();
        img.addEventListener('load', () => {
          this.loaded.add(image);
          callback();
        }, false);
        img.src = `${this.props.root}/image/${this.props.event.relativePath}/${image}`;
        this.cached.push(img);
      });
      this.interval = setInterval(() => {
        const image = images[this.index];
        if (this.loaded.has(image)) {
          this.index = (this.index + 1) % images.length;
          this.setState({ image });
        }
      }, 100);
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const src = `${this.props.root}/image/${this.props.event.relativePath}/${this.state.image}`;
    return (
      <img src={src} />
    );
  }
}
