// From mislav @ https://github.com/github/fetch/issues/175

export function timeout(ms, timeoutErr, promise) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error(timeoutErr));
    }, ms);
    promise.then(resolve, reject)
  });
}
