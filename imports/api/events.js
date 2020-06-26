import { Mongo } from 'meteor/mongo';
const BASE = '/home/ben/Pictures';
import rimraf from 'rimraf';

class EventsClass extends Mongo.Collection {

  remove(selector, callback) {
    const event = Events.findOne(selector);
    rimraf(`${BASE}/motion-cam/${event.relativePath}`, () => {});
    return super.remove(selector, callback);
  }

}

export const Events = new EventsClass('events');
