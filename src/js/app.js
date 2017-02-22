'use strict';

const app = angular.module('shop', ['LocalStorageModule']);
  app.controller('ShopController', function(inventoryItems, $q, StorageService) {

    this.sortType = 'name';
    this.sortReverse = false;
    this.loggedIn = false;

    if (StorageService.get('all-items')) {
      this.allItems = StorageService.get('all-items');
    } else {
      $q.when(inventoryItems.get('./src/js/data/items.json')).then((response) => {
        this.allItems = response.data;
        console.log(this.allItems);
      }).catch((error) => {
        console.log(error);
      });
    }

    // creates new inventory item on form submit
    this.create = function(name, price, quantity, color, discount) {
      // this.allItems = StorageService.get('all-items');

      // storing item data
      let newItem = {
        name: name,
        price: price,
        quantity: quantity,
        color: color,
        discount: discount
      }
      this.allItems.push(newItem);
      StorageService.set('all-items', this.allItems);
      this.showAddItemForm();
    }

    // toggles display of add item form
    this.showAddItemForm = function() {
      const addItemForm = document.querySelector('.add-item-form');
      const inventoryTable = document.querySelector('.inventory-table');
      const formToggle = document.querySelector('.form-toggle');

      if (addItemForm.classList.contains('is-hidden')) {
        addItemForm.classList.remove('is-hidden');
        inventoryTable.classList.add('is-hidden');
        formToggle.innerText = 'Cancel';
      } else {
        addItemForm.classList.add('is-hidden');
        inventoryTable.classList.remove('is-hidden');
        formToggle.innerText = 'Add Item';
      }
    }

    // toggles data-nat attribute
    this.updateNationality = function() {
      this.colorEl = document.querySelector('.color[data-nat]');
      this.priceEl = document.querySelectorAll('.price[data-nat]');
      this.nameEl = document.querySelectorAll('.name[data-nat]');
      // toggle data-nat value
      if (this.colorEl.getAttribute('data-nat') === 'us') {
        this.colorEl.setAttribute('data-nat', 'uk');
        for (let index = 0; index < this.priceEl.length; index++) {
          this.priceEl[index].setAttribute('data-nat', 'uk');
        }
      } else {
        this.colorEl.setAttribute('data-nat', 'us');
        for (let index = 0; index < this.priceEl.length; index++) {
          this.priceEl[index].setAttribute('data-nat', 'us');
        }
      }

      this.updateNatDisplay();
    };

    // toggles nationality displays
    this.updateNatDisplay = function() {
      // update display based on current data-nat value
      if (this.colorEl.getAttribute('data-nat') === 'us') {
        this.colorEl.innerHTML = 'color';
      } else {
        this.colorEl.innerHTML = 'colour';
      }

      // change price and waste items
      if (this.priceEl[0].getAttribute('data-nat') === 'us') {
        // set US price
        for (let index = 0; index < this.allItems.length; index++) {
          let tax = 0.0575;
          let discount = this.allItems[index].discount;
          let rawPrice = this.allItems[index].price;
          let modPrice = ((rawPrice - discount) + (rawPrice * tax));
          this.priceEl[index].innerHTML = `$${modPrice.toFixed(2)}`;
        }
        // set US waste
        for (let index = 0; index < this.nameEl.length; index++) {
          if (this.nameEl[index].innerText === 'rubbish bin') {
            this.nameEl[index].innerText = 'waste basket';
          }
        }
      } else {
        // set UK price
        for (let index = 0; index < this.allItems.length; index++) {
          let tax = 0.0575;
          let discount = this.allItems[index].discount;
          let rawPrice = this.allItems[index].price;
          let ukConv = 1.25;
          let modPrice = ((rawPrice - discount) + (rawPrice * tax)) * ukConv;
          this.priceEl[index].innerHTML = `GBR${modPrice.toFixed(2)}`;
        }
        // set UK waste
        for (let index = 0; index < this.nameEl.length; index++) {
          if (this.nameEl[index].innerText === 'waste basket') {
            this.nameEl[index].innerText = 'rubbish bin';
          }
        }
      }
    }
  });

  app.controller('UserController', function(inventoryItems, $q, StorageService, UserManagementService) {
    this.loggedIn = false;
    this.currentUser;
    this.authenticate = function(username) {
      this.currentUser = UserManagementService.logIn(username);
      this.loggedIn = true;
      console.log(this.currentUser);

      document.querySelector('header').classList.remove('is-hidden');
      document.querySelector('main').classList.remove('is-hidden');
      document.querySelector('header h1').innerText = `Welcome: ${this.currentUser.name}`;
      document.querySelector('header span').innerText = `Last Login: ${this.currentUser.loggedInDate}`;
    };

  });
