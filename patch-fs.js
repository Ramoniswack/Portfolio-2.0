const fs = require('fs');

const originalReadlink = fs.readlink;
fs.readlink = function(path, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }
  originalReadlink(path, options, (err, linkString) => {
    if (err && err.code === 'EISDIR') {
      err.code = 'EINVAL';
    }
    callback(err, linkString);
  });
};

const originalReadlinkSync = fs.readlinkSync;
fs.readlinkSync = function(path, options) {
  try {
    return originalReadlinkSync(path, options);
  } catch (err) {
    if (err.code === 'EISDIR') {
      err.code = 'EINVAL';
    }
    throw err;
  }
};

if (fs.promises) {
  const origPromisesReadlink = fs.promises.readlink;
  fs.promises.readlink = async function(path, options) {
    try {
      return await origPromisesReadlink.call(this, path, options);
    } catch (err) {
      if (err.code === 'EISDIR') {
        err.code = 'EINVAL';
      }
      throw err;
    }
  };
}

const originalWatch = fs.watch;
fs.watch = function(filename, options, listener) {
  try {
    const watcher = originalWatch(filename, options, listener);
    const origOn = watcher.on;
    watcher.on = function(event, cb) {
      if (event === 'error') {
        const wrappedCb = (err) => {
          if (err && err.code === 'EISDIR') {
            // Ignore EISDIR errors from watchpack to prevent infinite loops
            return;
          }
          return cb(err);
        };
        return origOn.call(this, event, wrappedCb);
      }
      return origOn.call(this, event, cb);
    };
    return watcher;
  } catch (err) {
    if (err.code === 'EISDIR') {
      // Return a dummy watcher if it throws synchronously
      const EventEmitter = require('events');
      const dummyWatcher = new EventEmitter();
      dummyWatcher.close = () => {};
      return dummyWatcher;
    }
    throw err;
  }
};
