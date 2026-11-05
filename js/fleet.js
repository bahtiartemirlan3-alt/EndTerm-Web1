'use strict';

function getCriteria(form, searchInput, priceInput) {
  const checkedTypes = form.querySelectorAll('input[name="type"]:checked');
  const transmission = form.querySelector('input[name="tr"]:checked');
  return {
    types: Array.from(checkedTypes).map(function (box) { return box.value; }),
    transmission: transmission ? transmission.value : '',
    maxPrice: Number(priceInput.value),
    query: searchInput.value.trim().toLowerCase()
  };
}

function filterCars(list, criteria) {
  return list.filter(function (car) {
    const typeOk = criteria.types.length === 0 || criteria.types.includes(car.type);
    const transmissionOk = criteria.transmission === '' || car.transmission === criteria.transmission;
    const priceOk = car.price <= criteria.maxPrice;
    const searchText = (car.name + ' ' + car.type + ' ' + car.fuel).toLowerCase();
    const queryOk = searchText.includes(criteria.query);
    return typeOk && transmissionOk && priceOk && queryOk;
  });
}

function sortCars(list, mode) {
  const copy = list.slice();
  if (mode === 'price-asc') copy.sort(function (a, b) { return a.price - b.price; });
  if (mode === 'price-desc') copy.sort(function (a, b) { return b.price - a.price; });
  if (mode === 'name') copy.sort(function (a, b) { return a.name.localeCompare(b.name); });
  return copy;
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.filters');
  const grid = document.getElementById('fleetGrid');
  const searchInput = document.getElementById('carSearch');
  const sortSelect = document.getElementById('carSort');
  const priceInput = document.getElementById('price');
  const priceLabel = document.getElementById('priceValue');
  const counter = document.getElementById('fleetCount');
  const resultText = document.getElementById('resultText');
  const emptyMessage = document.getElementById('noResults');

  function updateFleet() {
    const criteria = getCriteria(form, searchInput, priceInput);
    const result = sortCars(filterCars(cars, criteria), sortSelect.value);

    renderCars(result, grid);
    counter.textContent = result.length;
    priceLabel.textContent = formatPrice(criteria.maxPrice) + (criteria.maxPrice >= 200 ? '+' : '');
    resultText.textContent = 'Showing ' + result.length + ' of ' + cars.length + ' vehicles';
    emptyMessage.classList.toggle('d-none', result.length > 0);
  }

  searchInput.addEventListener('input', updateFleet);
  priceInput.addEventListener('input', updateFleet);
  form.addEventListener('change', updateFleet);
  sortSelect.addEventListener('change', updateFleet);
  form.addEventListener('reset', function () {
    searchInput.value = '';
    sortSelect.value = 'default';
    setTimeout(updateFleet, 0); 
  });

  document.addEventListener('keydown', function (event) {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (event.key === '/' && !typing) {
      event.preventDefault();
      searchInput.focus();
    }
  });

  const trip = getTrip();
  const tripBox = document.getElementById('tripInfo');
  if (trip && tripBox) {
    tripBox.textContent = 'Your trip: ' + trip.pickup + ' \u2192 ' + trip.dropoff + ', ' +
      trip.days + (trip.days === 1 ? ' day' : ' days') + '. Estimated totals are shown on each card.';
    tripBox.classList.remove('d-none');
  }

  updateFleet();
});
