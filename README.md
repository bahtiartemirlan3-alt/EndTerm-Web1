# DriveSelect: Endterm Project

**Topic:** Car rental website (continuation of the midterm project, same topic and layout).

**Live site:** _add the GitHub Pages / Netlify link here_

**Group members:**
- _Name Surname: contribution_
- _Name Surname: contribution_

**Pages:** Home, Fleet, Rules, About, Contact (navbar on every page).

## Midterm features (kept)
- Semantic HTML5, responsive layout (Flexbox, Grid, media queries at 992px and 576px), Bootstrap 5 navbar, accordion, forms and grid
- Insurance table (`rules.html`), search widget (Home), filters (Fleet), booking form (Contact)

## New endterm features

**Data (arrays), `js/data.js`**
- `cars`: 9 vehicles (name, type, price, transmission, seats, fuel, image, features). Cards on Home and Fleet are generated from it.
- `insuranceTiers`: 3 plans used by the booking form and the Rules page.
- `favorites` (in `js/main.js`): ids of saved cars. Each car also has a `features` array.

**Interface features**
1. **Filtering** by type, price slider and transmission (Fleet)
2. **Live search** by name, type or fuel, plus **sorting** (Fleet)
3. **Favorites list**: heart on every card, side panel, counter in the navbar, saved in `localStorage`
4. **Dark / light theme switcher** (navbar, remembered between pages)
5. **Booking estimate**: live price calculation from car, insurance and dates
6. **Details** toggle on each car card, **FAQ search**, clickable **insurance plans**, **back-to-top** button, toast messages

**Form validation (Contact, `js/booking.js`)**: full name, email format, phone format, driver age 21-80, category / vehicle / insurance selection, pick-up not in the past, drop-off after pick-up, rules checkbox. Messages appear under each field, submission is blocked until everything is valid, and a success message with a reference code is shown. The Home search form is validated as well.

**jQuery (`js/effects.js`)**
- Selectors: ID, class, element, attribute, descendant, multiple
- Traversal: `closest()`, `find()`, `siblings()`, `next()`
- Events: `click`, `input`, `scroll`, `focus`/`blur`, `keydown`
- Effects: `slideToggle`, `slideDown`/`slideUp`, `fadeIn`/`fadeOut`, `animate`

## Where to find things (for the defence)
| Requirement | File / function |
|---|---|
| Arrays | `js/data.js` (`cars`, `insuranceTiers`), `favorites` in `js/main.js` |
| Loops | `renderCars` (`forEach`), `createCarCard` (`for...of`), `fillVehicles` (`for...of`) |
| Functions with parameters / return value | `filterCars`, `sortCars`, `calculateTotal`, `countDays`, `formatPrice`, `generateReference` |
| DOM creation / removal | `createCarCard`, `renderFavoritesPanel`, `showToast` (created, then removed) |
| Events (`addEventListener`) | `click`, `input`, `change`, `submit`, `reset`, `keydown`, `DOMContentLoaded` |
| `preventDefault()` | form `submit` handlers in `js/booking.js` and `js/main.js`, `/` shortcut in `js/fleet.js` |
| Validation | `validators` object and `validateField` in `js/booking.js` |
| jQuery | `js/effects.js` |

## How to test
1. **Home:** click *Search Cars* with empty fields to see validation messages. Enter a location, a future pick-up and a later drop-off, then submit. You are taken to Fleet and your trip appears there.
2. **Fleet:** tick *SUV*, move the price slider, pick *Manual*, type `hybrid` in the search, change *Sort by*. Press **Clear Filters** to reset. Press `/` to jump to the search box.
3. **Favorites:** click a heart on any card, open the ♥ button in the navbar, remove an item. Reload the page: favorites stay.
4. **Theme:** click the moon / sun button in the navbar and reload.
5. **Details:** click *Details* on a card to slide the feature list open and closed.
6. **Contact:** press *Submit Reservation* empty; fill fields one by one (try an invalid email, age 19, drop-off before pick-up). Choose a vehicle, insurance and dates to see the live estimate. Tick the rules box and submit to see the success message. *Reserve* buttons on cards open this form with the car pre-selected.
7. **Rules:** click an insurance row to see its details; type `fuel` in the FAQ search.
8. Scroll down any page to see the back-to-top button.

## Run locally
Open `index.html` in a browser, or run `python -m http.server` in the project folder (internet is needed for the Bootstrap and jQuery CDN files).

## Deployment
GitHub Pages: *Settings > Pages > Deploy from branch > `main` / root*. The site is then available at `https://<username>.github.io/<repository>/`.
