'use strict';

const STORAGE_KEYS = { theme: 'driveselect-theme', favorites: 'driveselect-favorites', trip: 'driveselect-trip' };

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
   
  }
}

function formatPrice(amount) {
  return '$' + amount;
}

function getCarById(id) {
  return cars.find(function (car) { return car.id === Number(id); });
}

function getInsuranceById(id) {
  return insuranceTiers.find(function (tier) { return tier.id === id; });
}


function countDays(start, end) {
  const diff = new Date(end) - new Date(start);
  if (Number.isNaN(diff) || diff <= 0) return 0;
  return Math.ceil(diff / 86400000);
}

function calculateTotal(car, days, insurance) {
  const insuranceFee = insurance ? insurance.pricePerDay : 0;
  return (car.price + insuranceFee) * days;
}

function getTrip() {
  const trip = readStorage(STORAGE_KEYS.trip, null);
  if (!trip) return null;
  trip.days = countDays(trip.start, trip.end);
  return trip.days > 0 ? trip : null;
}

function setFieldState(input, message) {
  const feedback = input.parentElement.querySelector('.invalid-feedback');
  const hasError = message !== '';
  input.classList.toggle('is-invalid', hasError);
  input.classList.toggle('is-valid', !hasError);
  input.setAttribute('aria-invalid', String(hasError));
  if (feedback) {
    feedback.textContent = message;
    feedback.id = feedback.id || input.id + 'Error';
    input.setAttribute('aria-describedby', feedback.id);
  }
  return !hasError;
}

function clearFieldState(input) {
  input.classList.remove('is-invalid', 'is-valid');
  input.removeAttribute('aria-invalid');
}


function showToast(message) {
  let box = document.getElementById('toastBox');
  if (!box) {
    box = document.createElement('div');
    box.id = 'toastBox';
    box.setAttribute('aria-live', 'polite');
    document.body.appendChild(box);
  }
  const toast = document.createElement('div');
  toast.className = 'ds-toast';
  toast.textContent = message;
  box.appendChild(toast);
  setTimeout(function () { toast.classList.add('hide'); }, 2200);
  setTimeout(function () { toast.remove(); }, 2600);
}

let favorites = readStorage(STORAGE_KEYS.favorites, []).filter(function (id) { return getCarById(id); });

function createCarCard(car) {
  const trip = getTrip();
  const isFav = favorites.includes(car.id);
  const card = document.createElement('article');
  card.className = 'car-card';
  card.dataset.id = car.id;

  let featureItems = '';
  for (const feature of car.features) {
    featureItems += '<li>' + feature + '</li>';
  }

  const tripLine = trip
    ? '<p class="trip-total small text-secondary mb-0">&asymp; ' + formatPrice(calculateTotal(car, trip.days)) +
      ' for ' + trip.days + (trip.days === 1 ? ' day' : ' days') + '</p>'
    : '';

  card.innerHTML =
    '<button type="button" class="fav-btn' + (isFav ? ' active' : '') + '" data-id="' + car.id + '"' +
      ' aria-pressed="' + isFav + '" aria-label="Favorite: ' + car.name + '">' + (isFav ? '&#9829;' : '&#9825;') + '</button>' +
    '<img class="car-img" src="' + car.image + '" alt="' + car.name + '" loading="lazy">' +
    '<h3>' + car.name + '</h3>' +
    '<p class="meta mb-0">' + car.transmission + ' &middot; ' + car.seats + ' Seats &middot; ' + car.fuel + '</p>' +
    tripLine +
    '<div class="car-details" style="display:none"><ul class="small ps-3 mb-0 mt-2">' + featureItems + '</ul></div>' +
    '<div class="car-bottom">' +
      '<span class="price">' + formatPrice(car.price) + '/day</span>' +
      '<div class="d-flex gap-2">' +
        '<button type="button" class="btn btn-outline-secondary btn-sm details-btn" aria-expanded="false">Details</button>' +
        '<a href="contact.html?car=' + car.id + '" class="btn btn-dark-ws">Reserve</a>' +
      '</div>' +
    '</div>';
  return card;
}

function renderCars(list, container) {
  container.replaceChildren();
  list.forEach(function (car) {
    container.appendChild(createCarCard(car));
  });
}

function toggleFavorite(id) {
  const car = getCarById(id);
  if (favorites.includes(id)) {
    favorites = favorites.filter(function (favId) { return favId !== id; });
    showToast(car.name + ' removed from favorites');
  } else {
    favorites.push(id);
    showToast(car.name + ' added to favorites');
  }
  writeStorage(STORAGE_KEYS.favorites, favorites);
  updateFavoritesUI();
}

function renderFavoritesPanel() {
  const list = document.getElementById('favList');
  const empty = document.getElementById('favEmpty');
  const clearBtn = document.getElementById('favClear');
  if (!list) return;

  list.replaceChildren();
  for (const id of favorites) {
    const car = getCarById(id);
    const item = document.createElement('li');
    item.className = 'fav-item';
    item.innerHTML =
      '<img src="' + car.image + '" alt="" width="64" height="48">' +
      '<div class="flex-grow-1"><strong>' + car.name + '</strong><br>' +
      '<a class="small" href="contact.html?car=' + car.id + '">' + formatPrice(car.price) + '/day &middot; Reserve</a></div>' +
      '<button type="button" class="btn-close remove-fav" data-id="' + car.id + '" aria-label="Remove ' + car.name + '"></button>';
    list.appendChild(item);
  }
  empty.classList.toggle('d-none', favorites.length > 0);
  clearBtn.classList.toggle('d-none', favorites.length === 0);
}

function updateFavoritesUI() {
  const counter = document.getElementById('favCount');
  if (counter) counter.textContent = favorites.length;

  document.querySelectorAll('.fav-btn').forEach(function (button) {
    const isFav = favorites.includes(Number(button.dataset.id));
    button.classList.toggle('active', isFav);
    button.setAttribute('aria-pressed', String(isFav));
    button.innerHTML = isFav ? '&#9829;' : '&#9825;';
  });
  renderFavoritesPanel();
}

function initFavorites() {
  document.addEventListener('click', function (event) {
    const heart = event.target.closest('.fav-btn');
    if (heart) toggleFavorite(Number(heart.dataset.id));

    const removeBtn = event.target.closest('.remove-fav');
    if (removeBtn) {
      toggleFavorite(Number(removeBtn.dataset.id));
      document.getElementById('favPanel').focus();
    }
  });

  const clearBtn = document.getElementById('favClear');
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      favorites = [];
      writeStorage(STORAGE_KEYS.favorites, favorites);
      updateFavoritesUI();
      showToast('Favorites cleared');
    });
  }
  updateFavoritesUI();
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-bs-theme', theme);
  const button = document.getElementById('themeToggle');
  if (button) {
    button.innerHTML = theme === 'dark' ? '&#9728;' : '&#9790;';
    button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    button.title = button.getAttribute('aria-label');
  }
}

function initTheme() {
  let theme = readStorage(STORAGE_KEYS.theme, 'light');
  applyTheme(theme);

  const button = document.getElementById('themeToggle');
  if (!button) return;
  button.addEventListener('click', function () {
    theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    writeStorage(STORAGE_KEYS.theme, theme);
  });
}

function validatePickupLocation(value) {
  return value.trim().length < 3 ? 'Enter a pick-up location (at least 3 characters).' : '';
}

function validateStart(value) {
  if (!value) return 'Choose a pick-up date and time.';
  if (new Date(value) < new Date()) return 'Pick-up cannot be in the past.';
  return '';
}

function validateEnd(value, start) {
  if (!value) return 'Choose a drop-off date and time.';
  if (start && new Date(value) <= new Date(start)) return 'Drop-off must be after pick-up.';
  return '';
}

function initHomePage() {
  const featuredGrid = document.getElementById('featuredGrid');
  if (featuredGrid) {
    renderCars(cars.filter(function (car) { return car.featured; }), featuredGrid);
  }

  const form = document.getElementById('searchForm');
  if (!form) return;
  const pickup = document.getElementById('pu');
  const dropoff = document.getElementById('do');
  const start = document.getElementById('pd');
  const end = document.getElementById('dd');

  form.addEventListener('submit', function (event) {
    event.preventDefault(); 
    const checks = [
      setFieldState(pickup, validatePickupLocation(pickup.value)),
      setFieldState(start, validateStart(start.value)),
      setFieldState(end, validateEnd(end.value, start.value))
    ];
    if (!checks.every(Boolean)) return;

    writeStorage(STORAGE_KEYS.trip, {
      pickup: pickup.value.trim(),
      dropoff: dropoff.value.trim() || pickup.value.trim(),
      start: start.value,
      end: end.value
    });
    window.location.href = 'fleet.html';
  });
  form.addEventListener('input', function (event) {
    if (event.target.classList.contains('is-invalid')) clearFieldState(event.target);
  });
}


document.addEventListener('DOMContentLoaded', function () {
  initTheme();
  initHomePage();
  initFavorites();
});
