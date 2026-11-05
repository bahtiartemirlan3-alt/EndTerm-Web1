'use strict';

function todayString() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return now.getFullYear() + '-' + month + '-' + day;
}

const validators = {
  name: function (value) {
    const text = value.trim();
    if (text.length < 2) return 'Please enter your full name (at least 2 characters).';
    if (!/^[\p{L}\s'.-]+$/u.test(text)) return 'Name may contain letters, spaces, apostrophes and hyphens only.';
    return '';
  },
  email: function (value) {
    if (value.trim() === '') return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())) return 'Enter a valid email, e.g. jane@example.com.';
    return '';
  },
  phone: function (value) {
    if (value.trim() === '') return 'Phone number is required.';
    if (!/^\+?[0-9\s()-]{10,18}$/.test(value.trim())) return 'Use 10\u201315 digits; spaces, +, ( ) and - are allowed.';
    return '';
  },
  age: function (value) {
    if (value === '') return 'Driver age is required.';
    const age = Number(value);
    if (!Number.isInteger(age)) return 'Age must be a whole number.';
    if (age < 21) return 'Drivers must be at least 21 years old (see Rules).';
    if (age > 80) return 'Maximum driver age is 80.';
    return '';
  },
  category: function (value) { return value === '' ? 'Select a car category.' : ''; },
  vehicle: function (value) { return value === '' ? 'Select a vehicle.' : ''; },
  insurance: function (value) { return value === '' ? 'Choose an insurance tier.' : ''; },
  pu: function (value) {
    if (value === '') return 'Choose a pick-up date.';
    if (value < todayString()) return 'Pick-up date cannot be in the past.';
    return '';
  },
  do: function (value, form) {
    if (value === '') return 'Choose a drop-off date.';
    const pickup = form.elements.pu.value;
    if (pickup && value <= pickup) return 'Drop-off must be after the pick-up date.';
    return '';
  },
  terms: function (checked) { return checked ? '' : 'You must accept the rental rules to continue.'; }
};

function validateField(form, field) {
  const rule = validators[field.id];
  if (!rule) return true;
  const value = field.type === 'checkbox' ? field.checked : field.value;
  return setFieldState(field, rule(value, form));
}

function generateReference() {
  return 'DS-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}


document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('bookingForm');
  const category = document.getElementById('category');
  const vehicle = document.getElementById('vehicle');
  const insurance = document.getElementById('insurance');
  const pickup = document.getElementById('pu');
  const dropoff = document.getElementById('do');
  const estimate = document.getElementById('estimate');
  const successBox = document.getElementById('bookingSuccess');
  const summaryBox = document.getElementById('formSummary');
  const fieldIds = Object.keys(validators);

  pickup.min = todayString();

  function fillVehicles(selectedCategory, selectedId) {
    vehicle.replaceChildren(new Option('Select a vehicle', ''));
    for (const car of cars) {
      if (selectedCategory === '' || car.type === selectedCategory) {
        vehicle.add(new Option(car.name + ' \u2014 ' + formatPrice(car.price) + '/day', car.id));
      }
    }
    vehicle.value = selectedId ? String(selectedId) : '';
  }

  function fillInsurance() {
    insurance.replaceChildren(new Option('Select insurance tier', ''));
    insuranceTiers.forEach(function (tier) {
      const label = tier.name + (tier.pricePerDay ? ' (+' + formatPrice(tier.pricePerDay) + '/day)' : ' (included)');
      insurance.add(new Option(label, tier.id));
    });
  }

  let estimateShown = false;

  function updateEstimate() {
    const car = getCarById(vehicle.value);
    const tier = getInsuranceById(insurance.value);
    const days = countDays(pickup.value, dropoff.value);

    if (!car || !tier || days === 0) {
      if (estimateShown) hideBox(estimate);
      estimateShown = false;
      return;
    }
    const total = calculateTotal(car, days, tier);
    estimate.querySelector('.estimate-text').textContent =
      car.name + ': ' + formatPrice(car.price) + ' + insurance ' + formatPrice(tier.pricePerDay) +
      ' per day \u00d7 ' + days + (days === 1 ? ' day' : ' days');
    estimate.querySelector('.estimate-total').textContent = formatPrice(total);
    if (!estimateShown) revealBox(estimate);
    estimateShown = true;
  }

  fillVehicles('', null);
  fillInsurance();

  const params = new URLSearchParams(window.location.search);
  const presetCar = getCarById(params.get('car'));
  if (presetCar) {
    category.value = presetCar.type;
    fillVehicles(presetCar.type, presetCar.id);
  }
  if (getInsuranceById(params.get('insurance'))) insurance.value = params.get('insurance');

  const trip = getTrip();
  if (trip) {
    pickup.value = trip.start.slice(0, 10);
    dropoff.value = trip.end.slice(0, 10);
  }
  updateEstimate();

  category.addEventListener('change', function () {
    fillVehicles(category.value, null);
    updateEstimate();
  });

  form.addEventListener('focusout', function (event) {
    if (fieldIds.includes(event.target.id)) validateField(form, event.target);
  });
  form.addEventListener('input', function (event) {
    if (event.target.classList.contains('is-invalid')) validateField(form, event.target);
  });
  form.addEventListener('change', function (event) {
    if (fieldIds.includes(event.target.id)) validateField(form, event.target);
    updateEstimate();
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault(); 
    const fields = fieldIds.map(function (id) { return document.getElementById(id); });
    let errors = 0;
    let firstInvalid = null;

    fields.forEach(function (field) {
      if (!validateField(form, field)) {
        errors++;
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (errors > 0) {
      successBox.classList.add('d-none');
      summaryBox.textContent = 'Please fix ' + errors + (errors === 1 ? ' field' : ' fields') + ' highlighted below.';
      revealBox(summaryBox);
      firstInvalid.focus();
      return;
    }

    const car = getCarById(vehicle.value);
    const tier = getInsuranceById(insurance.value);
    const days = countDays(pickup.value, dropoff.value);
    const total = calculateTotal(car, days, tier);
    const guest = document.getElementById('name').value.trim();

    successBox.querySelector('.success-text').textContent =
      'Thank you, ' + guest + '! Reference ' + generateReference() + ': ' + car.name + ' for ' + days +
      (days === 1 ? ' day' : ' days') + ' with ' + tier.name + '. Estimated total ' + formatPrice(total) +
      '. A confirmation email will arrive within 15 minutes.';

    hideBox(summaryBox);
    form.reset();
    form.querySelectorAll('.is-valid, .is-invalid').forEach(clearFieldState);
    fillVehicles('', null);
    hideBox(estimate);
    estimateShown = false;
    revealBox(successBox);
    successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  form.addEventListener('reset', function () {
    setTimeout(function () {
      form.querySelectorAll('.is-valid, .is-invalid').forEach(clearFieldState);
      fillVehicles('', null);
      updateEstimate();
    }, 0);
  });
});
