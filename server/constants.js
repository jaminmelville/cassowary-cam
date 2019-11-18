let base = '/home/ben/Pictures';
let fileToWatch = '/home/ben/code/camera/latest.txt';

if (process.env.ROOT_URL === 'http://localhost:3000/') {
  base = '/home/ben/nfs/armor/home/ben/Pictures';
  fileToWatch = '/home/ben/nfs/armor/home/ben/code/camera/latest.txt';
}

export const BASE = base;
export const FILE_TO_WATCH = fileToWatch;
