import { Meteor } from 'meteor/meteor';
const fs = require('fs');
import { Events } from '../imports/api/events';
import { Tags } from '../imports/api/tags';
import { BASE } from './constants';

Meteor.startup(() => {
  Tags.upsert({ name: 'pig' }, { $set: { name: 'pig' } });
  Tags.upsert({ name: 'cassowary' }, { $set: { name: 'cassowary' } });
  Tags.upsert({ name: 'cat' }, { $set: { name: 'cat' } });
  Tags.upsert({ name: 'wallaby' }, { $set: { name: 'wallaby' } });
  Tags.upsert({ name: 'kurlew' }, { $set: { name: 'kurlew' } });
  Tags.upsert({ name: 'rat' }, { $set: { name: 'rat' } });
  Tags.upsert({ name: 'dog' }, { $set: { name: 'dog' } });
  Tags.upsert({ name: 'bird' }, { $set: { name: 'bird' } });
  Tags.upsert({ name: 'bandicoot' }, { $set: { name: 'bandicoot' } });
  Tags.upsert({ name: 'echidna' }, { $set: { name: 'echidna' } });
  Tags.upsert({ name: 'orange-footed scrubfowl' }, { $set: { name: 'orange-footed scrubfowl' } });
  Tags.upsert({ name: 'other' }, { $set: { name: 'other' } });
});

Meteor.publish('events', function eventsPublication() {
  return Events.find({});
});

Meteor.publish('tags', function tagsPublication() {
  return Tags.find({});
});

function getSortedFiles(dir) {
  return fs.readdirSync(dir)
    .map(fileName => ({
      name: fileName,
      time: fs.statSync(dir + '/' + fileName).mtime.getTime(),
    }))
    .sort((a, b) => {
      return a.time - b.time;
    })
    .map(file => file.name);
}

function getDays() {
  const directories = fs.readdirSync(`${BASE}/motion-cam`).reverse();
  return directories.map((day) => {
    const subdirectories = getSortedFiles(`${BASE}/motion-cam/${day}`).reverse();
    const events = subdirectories.map((event) => {
      const images = getSortedFiles(`${BASE}/motion-cam/${day}/${event}`);
      let image = '';
      if (images.length) {
        image = images[parseInt(images.length / 2)];
      }
      return {
        relativePath: `${day}/${event}`,
        image,
        timestamp: fs.statSync(`${BASE}/motion-cam/${day}/${event}`).mtime.getTime(),
      };
    });
    return {
      name: day,
      events,
    }
  });
}

Meteor.methods({
  days() {
    return getDays();
  },
  images(path) {
    const images = getSortedFiles(`${BASE}/motion-cam/${path}`);
    return images;
  },
  removeEvent(id) {
    Events.remove({ _id: id });
  },
  sync() {
    getDays().forEach((day) => {
      day.events.forEach((event) => {
        Events.upsert({ relativePath: event.relativePath }, {
          $set: { ...event },
        });
        Events.update({ tags: { $exists : false } }, { $set: { tags: [] } });
      })
    });
  }
});

WebApp.connectHandlers.use('/image', (req, res, next) => {
  fs.readFile(`${BASE}/motion-cam${req.url}`, function (err, content) {
    res.writeHead(200, { 'Content-type': 'image/jpg' });
    res.end(content);
  });
});

WebApp.connectHandlers.use('/sync', (req, res, next) => {
  // Meteor.call('sync')
  res.writeHead(200);
  res.end('synced\n');
});