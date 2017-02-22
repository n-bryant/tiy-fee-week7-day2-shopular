'use strict';

var app = angular.module('shop', ['LocalStorageModule']);
app.controller('ShopController', function (inventoryItems, $q, StorageService) {
  var _this = this;

  this.sortType = 'name';
  this.sortReverse = false;
  this.loggedIn = false;

  if (StorageService.get('all-items')) {
    this.allItems = StorageService.get('all-items');
  } else {
    $q.when(inventoryItems.get('./src/js/data/items.json')).then(function (response) {
      _this.allItems = response.data;
      console.log(_this.allItems);
    }).catch(function (error) {
      console.log(error);
    });
  }

  // creates new inventory item on form submit
  this.create = function (name, price, quantity, color, discount) {
    // this.allItems = StorageService.get('all-items');

    // storing item data
    var newItem = {
      name: name,
      price: price,
      quantity: quantity,
      color: color,
      discount: discount
    };
    this.allItems.push(newItem);
    StorageService.set('all-items', this.allItems);
    this.showAddItemForm();
  };

  // toggles display of add item form
  this.showAddItemForm = function () {
    var addItemForm = document.querySelector('.add-item-form');
    var inventoryTable = document.querySelector('.inventory-table');
    var formToggle = document.querySelector('.form-toggle');

    if (addItemForm.classList.contains('is-hidden')) {
      addItemForm.classList.remove('is-hidden');
      inventoryTable.classList.add('is-hidden');
      formToggle.innerText = 'Cancel';
    } else {
      addItemForm.classList.add('is-hidden');
      inventoryTable.classList.remove('is-hidden');
      formToggle.innerText = 'Add Item';
    }
  };

  // toggles data-nat attribute
  this.updateNationality = function () {
    this.colorEl = document.querySelector('.color[data-nat]');
    this.priceEl = document.querySelectorAll('.price[data-nat]');
    this.nameEl = document.querySelectorAll('.name[data-nat]');
    // toggle data-nat value
    if (this.colorEl.getAttribute('data-nat') === 'us') {
      this.colorEl.setAttribute('data-nat', 'uk');
      for (var index = 0; index < this.priceEl.length; index++) {
        this.priceEl[index].setAttribute('data-nat', 'uk');
      }
    } else {
      this.colorEl.setAttribute('data-nat', 'us');
      for (var _index = 0; _index < this.priceEl.length; _index++) {
        this.priceEl[_index].setAttribute('data-nat', 'us');
      }
    }

    this.updateNatDisplay();
  };

  // toggles nationality displays
  this.updateNatDisplay = function () {
    // update display based on current data-nat value
    if (this.colorEl.getAttribute('data-nat') === 'us') {
      this.colorEl.innerHTML = 'color';
    } else {
      this.colorEl.innerHTML = 'colour';
    }

    // change price and waste items
    if (this.priceEl[0].getAttribute('data-nat') === 'us') {
      // set US price
      for (var index = 0; index < this.allItems.length; index++) {
        var tax = 0.0575;
        var discount = this.allItems[index].discount;
        var rawPrice = this.allItems[index].price;
        var modPrice = rawPrice - discount + rawPrice * tax;
        this.priceEl[index].innerHTML = '$' + modPrice.toFixed(2);
      }
      // set US waste
      for (var _index2 = 0; _index2 < this.nameEl.length; _index2++) {
        if (this.nameEl[_index2].innerText === 'rubbish bin') {
          this.nameEl[_index2].innerText = 'waste basket';
        }
      }
    } else {
      // set UK price
      for (var _index3 = 0; _index3 < this.allItems.length; _index3++) {
        var _tax = 0.0575;
        var _discount = this.allItems[_index3].discount;
        var _rawPrice = this.allItems[_index3].price;
        var ukConv = 1.25;
        var _modPrice = (_rawPrice - _discount + _rawPrice * _tax) * ukConv;
        this.priceEl[_index3].innerHTML = 'GBR' + _modPrice.toFixed(2);
      }
      // set UK waste
      for (var _index4 = 0; _index4 < this.nameEl.length; _index4++) {
        if (this.nameEl[_index4].innerText === 'waste basket') {
          this.nameEl[_index4].innerText = 'rubbish bin';
        }
      }
    }
  };
});

app.controller('UserController', function (inventoryItems, $q, StorageService, UserManagementService) {
  this.loggedIn = false;
  this.currentUser;
  this.authenticate = function (username) {
    this.currentUser = UserManagementService.logIn(username);
    this.loggedIn = true;
    console.log(this.currentUser);

    document.querySelector('header').classList.remove('is-hidden');
    document.querySelector('main').classList.remove('is-hidden');
    document.querySelector('header h1').innerText = 'Welcome: ' + this.currentUser.name;
    document.querySelector('header span').innerText = 'Last Login: ' + this.currentUser.loggedInDate;
  };
});