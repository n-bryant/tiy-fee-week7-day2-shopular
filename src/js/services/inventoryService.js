angular.module('shop').service('inventoryItems', ItemsService);

function ItemsService($http) {
  function getItems(url) {
    return $http({
      method: 'GET',
      url: url
    });
  }

  return {
    get: getItems
  };
}
