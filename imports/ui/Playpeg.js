import React, { Component } from 'react';
import Playpeg from './Playpeg';
import eachLimit from 'async/eachLimit';
import { ROOT } from '../constants';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.cached = [];
    this.index = 0;
    this.loaded = new Set();
    this.imagesToLoadInParallel = 3;
    this.images = [];
    this.state = {
      image: this.props.event.image,
    };
  }

  componentDidMount() {
    Meteor.call('images', this.props.event.relativePath, (err, images) => {
      this.images = images;
      eachLimit(this.images, this.imagesToLoadInParallel, (image, callback) => {
        const img = new Image();
        img.addEventListener('load', () => {
          this.loaded.add(image);
          callback();
        }, false);
        img.src = `${ROOT}/image/${this.props.event.relativePath}/${image}`;
        this.cached.push(img);
      });
      this.moveToNextImage();
    });
  }

  moveToNextImage = () => {
    const image = this.images[this.index];
    if (this.loaded.has(image)) {
      this.index = (this.index + 1) % this.images.length;
      this.setState({ image });
    }
    this.timeout = setTimeout(this.moveToNextImage, 100);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const src = `${ROOT}/image/${this.props.event.relativePath}/${this.state.image}`;
    return (
      <img src={src} />
    );
  }
}
