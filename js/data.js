'use strict';

const cars = [
  { id: 1, name: 'Eco Compact Pro',      type: 'Compact', price: 45,  transmission: 'Automatic', seats: 5, fuel: 'Hybrid',  image: 'imegas/tesla.jpg',    featured: true,
    features: ['Bluetooth & USB', 'Very low fuel use', 'Parking sensors'] },
  { id: 2, name: 'Urban Explorer SUV',   type: 'SUV',     price: 75,  transmission: 'Automatic', seats: 7, fuel: 'Diesel',  image: 'imegas/fortuner.jpg', featured: true,
    features: ['AWD', 'Third-row seating', 'Roof rails'] },
  { id: 3, name: 'Sleek Executive Sedan', type: 'Sedan',  price: 110, transmission: 'Automatic', seats: 5, fuel: 'Premium', image: 'imegas/f10.jpg',      featured: true,
    features: ['Leather seats', 'Navigation', 'Adaptive cruise control'] },
  { id: 4, name: 'Urban Compact',        type: 'Compact', price: 40,  transmission: 'Manual',    seats: 4, fuel: 'Petrol',  image: 'imegas/55.png',       featured: false,
    features: ['Easy city parking', 'Air conditioning', '2 bags'] },
  { id: 5, name: 'Eco Sedan Hybrid',     type: 'Sedan',   price: 55,  transmission: 'Automatic', seats: 5, fuel: 'Hybrid',  image: 'imegas/Haval.jpg',    featured: false,
    features: ['Lane assist', 'Rear camera', '2 bags'] },
  { id: 6, name: 'Cruiser SUV AWD',      type: 'SUV',     price: 80,  transmission: 'Automatic', seats: 5, fuel: 'Petrol',  image: 'imegas/forester.jpg', featured: false,
    features: ['AWD', 'Heated seats', 'Large trunk'] },
  { id: 7, name: 'Family Minivan',       type: 'SUV',     price: 85,  transmission: 'Automatic', seats: 7, fuel: 'Diesel',  image: 'imegas/carnival.jpg', featured: false,
    features: ['Sliding doors', 'Child-seat anchors', '7 seats'] },
  { id: 8, name: 'Business Executive',   type: 'Luxury',  price: 120, transmission: 'Automatic', seats: 5, fuel: 'Premium', image: 'imegas/mercedes.jpg', featured: false,
    features: ['Massage seats', 'Premium audio', 'Chauffeur-ready rear seats'] },
  { id: 9, name: 'Sport Roadster',       type: 'Luxury',  price: 150, transmission: 'Manual',    seats: 2, fuel: 'Premium', image: 'imegas/shelby.jpg',   featured: false,
    features: ['V8 engine', 'Convertible roof', 'Sport suspension'] }
];

const insuranceTiers = [
  { id: 'basic',   name: 'Basic Protection', pricePerDay: 0,  summary: 'Third-party liability, high-deductible collision cover, basic roadside assist.' },
  { id: 'plus',    name: 'Standard Plus',    pricePerDay: 15, summary: 'Reduced deductible, windshield and tire cover, 24/7 priority assistance.' },
  { id: 'premium', name: 'Full Premium',     pricePerDay: 29, summary: 'Zero deductible, theft and vandalism protection, full roadside towing.' }
];
