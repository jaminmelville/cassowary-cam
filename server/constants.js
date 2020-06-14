let base = '/home/pi/Pictures';

if (process.env.ROOT_URL === 'http://localhost:3000/') {
  base = '/home/ben/nfs/armor/home/ben/Pictures';
}

export const BASE = base;
