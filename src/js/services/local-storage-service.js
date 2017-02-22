app.service('StorageService', StorageService);

function StorageService(localStorageService) {
  function set(name, data) {
    localStorageService.set(name, data);
  }

  function get(name) {
    // return null if the key does not exist
    return localStorageService.get(name) || null;
  }

  return {
    set: set,
    get: get
  }
}
