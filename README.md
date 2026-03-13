## RanDo – Campground Listing & Reviews

A full-stack web app to browse, create, and manage campgrounds, inspired by YelpCamp. Users can register, log in, create campgrounds with images and locations, see them on an interactive map, and leave reviews with ratings. This project focuses on learning the Node.js/Express/MongoDB/EJS stack, not on being a production-ready app.

Link: https://rando-9jdz.onrender.com
---

## 🌱 Why I Built This

I built this as a learning project and one of my first serious experiences with backend development. The goal was to understand how all the pieces fit together: routing, databases, authentication, file uploads, and templating. Along the way I experimented with maps, security middleware, and a more polished UI using EJS layouts and partials.

---

## 🧰 Tech Stack

**Core stack badges**

[![Node.js](https://img.shields.io/badge/Node.js-backend-green?logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express.js-router-black?logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-database-47A248?logo=mongodb)](https://www.mongodb.com)
[![EJS](https://img.shields.io/badge/EJS-templates-yellow)](https://ejs.co)

**Main libraries (from `package.json`)**

- **Server & core**: `express`, `ejs`, `ejs-mate`, `method-override`, `cookie-parser`
- **Database & models**: `mongoose`
- **Auth & sessions**: `passport`, `passport-local`, `passport-local-mongoose`, `express-session`, `connect-mongo`, `connect-flash`
- **Validation & security**: `joi`, `sanitize-html`, `express-mongo-sanitize`, `helmet`
- **File uploads & storage**: `multer`, `multer-storage-cloudinary`, `cloudinary`
- **Maps & geo**: `@maptiler/sdk`, `@maptiler/client`
- **HTTP utilities & misc**: `axios`, `punycode`, `dotenv`
- **Tooling**: `nodemon`

---

## 📚 What I Learned

- **Routing with Express**
  - Split routes into dedicated routers under `routes/` for campgrounds, reviews, and users.
  - Used `express.Router` with `.route()` chaining (e.g. `GET/POST` on `/campgrounds` and `GET/PUT/DELETE` on `/campgrounds/:id`).
  - Introduced controller modules in `controllers/` so route files stay thin and focused on wiring.

- **Connecting to MongoDB with Mongoose**
  - Connected to MongoDB with `mongoose.connect` using a configurable `DB_URL` (with a local fallback to `mongodb://127.0.0.1:27017/RanDo`).
  - Modeled data with Mongoose schemas:
    - `Campground` with title, price, description, location, GeoJSON `geometry`, images, `author`, and `reviews` references.
    - `User` with `email` and auth fields added by `passport-local-mongoose`.
    - `Review` with `body`, `rating`, and `author`.
  - Used Mongoose middleware to clean up related reviews when a campground is deleted (`CampgroundSchema.post('findOneAndDelete', ...)`).
  - Added virtuals (e.g. image thumbnails and `properties` for map popups) and enabled them in JSON.

- **Templating with EJS**
  - Used `ejs-mate` for layout support and defined shared layouts and partials (`views/layouts/boilerplate.ejs`, `views/partials/navbar.ejs`, `views/partials/flash.ejs`).
  - Rendered dynamic pages for:
    - Listing all campgrounds (`campgrounds/index.ejs`) with cards and a map.
    - Viewing a single campground with a carousel, map, and reviews (`campgrounds/show.ejs`).
    - Creating and editing campgrounds, plus user login/register forms.
  - Passed server-side data (like campgrounds, current user, flash messages, and `MAPTILER_API_KEY`) into the templates.

- **Authentication, Authorization & Sessions**
  - Implemented local authentication using `passport` and `passport-local-mongoose` on the `User` model.
  - Managed sessions with `express-session` and stored them in MongoDB using `connect-mongo`.
  - Added login, registration, and logout flows in `routes/users.js` and `controllers/user.js`:
    - Automatic login after registration.
    - Flash messages for success and error states.
  - Protected routes with custom middleware in `middleware.js`:
    - `isLoggedIn` to require authentication and remember the original URL via `req.session.returnTo`.
    - `ReturnTo` to restore that URL after login.
    - `isAuthor` and `isReviewAuthor` to ensure only resource owners can edit/delete their campgrounds or reviews.

- **CRUD Operations for Campgrounds and Reviews**
  - Full CRUD for campgrounds:
    - Create: form + `POST /campgrounds` (with image upload and geocoding).
    - Read: index and show pages, including populated author and reviews.
    - Update: `PUT /campgrounds/:id` with support for adding and deleting images.
    - Delete: `DELETE /campgrounds/:id` with flash feedback.
  - Create/delete for reviews:
    - Add: `POST /campgrounds/:id/reviews`.
    - Delete: `DELETE /campgrounds/:id/reviews/:reviewId` and pull from the campground.

- **File Uploads & Cloudinary Integration**
  - Used `multer` with `multer-storage-cloudinary` and a custom `storage` configuration in `cloudinary/index.js`.
  - Uploaded campground images to Cloudinary using credentials from environment variables.
  - Stored image `url` and `fileName` in MongoDB, and added a virtual `thumbnail` URL.
  - Implemented server-side deletion of Cloudinary images when they are removed from a campground on update.

- **Validation, Security & Error Handling**
  - Added request validation with Joi schemas in `schemas.js`:
    - `campgroundJoiSchema` and `reviewJoiSchema` validate titles, descriptions, locations, ratings, etc.
    - Extended Joi with a custom `escapeHTML` rule using `sanitize-html` to strip HTML tags from user input.
  - Sanitized Mongo queries using `express-mongo-sanitize`.
  - Hardened security headers with `helmet`, including a custom Content Security Policy that whitelists:
    - MapTiler endpoints, Cloudinary, Unsplash, CDNs, and fonts.
  - Centralized errors with a custom `ExpressErrorHandler` class and a final error-handling middleware that renders `views/error.ejs`.
  - Wrapped async route handlers with a reusable `catchAsync` utility.

- **Interactive Maps & Geospatial Features**
  - Used `@maptiler/client` server-side to geocode campground locations and store `geometry` as GeoJSON.
  - On the front-end:
    - `public/javascripts/showMap.js` renders a MapTiler map for a single campground with a marker and popup.
    - `public/javascripts/mapCluster.js` shows all campgrounds on a MapTiler map with clustering, popups, and navigation.
  - Passed data from EJS to the client as JSON (`camp` and `camps` objects) so the maps can display real campground data.

- **Form UX & Client-Side Enhancements**
  - Added Bootstrap-based form validation in `bootstrapFormValidateScript.js`.
  - Used star rating UI and responsive cards for reviews and campgrounds.
  - Used flash partials to show success/error alerts consistently.

- **Database Seeding & Fake Data**
  - Wrote a seeding script in `seeds/index.js` that:
    - Fetches images from Unsplash using `axios`.
    - Uses helper data (`seedHelpers.js`, `cities.js`, `Wilaya.js`) to generate 300 randomized campgrounds across many locations.
  - Directly connected to MongoDB and created realistic data for development and testing.

---

## 🗂 Project Structure

High-level structure based on the current code:

- **`app.js`**: Main Express app – connects to MongoDB, configures sessions, security middleware, Passport, static assets, and mounts all routes.
- **`models/`**
  - `campground.js`: Campground schema with images, price, location, GeoJSON geometry, author, and reviews + virtuals and cascade delete.
  - `review.js`: Review schema (body, rating, author reference).
  - `user.js`: User schema with email and Passport-local plugin.
- **`routes/`**
  - `campgrounds.js`: All campground index/show/new/edit/update/delete routes, wired to controller methods and upload middleware.
  - `reviews.js`: Routes for creating and deleting reviews, with validation and authorization.
  - `users.js`: Registration, login, and logout routes using Passport.
- **`controllers/`**
  - `campground.js`: All campground logic (listing, geocoding, creating, updating with image management, deleting).
  - `review.js`: Logic for creating and deleting reviews.
  - `user.js`: Logic for register, login, logout, and redirecting back to the originally requested page.
- **`views/`**
  - `campgrounds/`: `index`, `show`, `new`, `edit` templates.
  - `users/`: `login`, `register` templates.
  - `layouts/`: Shared base layout (`boilerplate.ejs`) and footer.
  - `partials/`: Navbar and flash message partials.
  - `home.ejs`, `error.ejs`: Home page and error page.
- **`public/`**
  - `javascripts/`: Front-end scripts for maps (`showMap.js`, `mapCluster.js`) and form validation (`bootstrapFormValidateScript.js`).
  - `stylesheets/` (referenced in views): CSS for maps, stars, global styling, and specific pages.
- **`cloudinary/`**
  - `index.js`: Cloudinary configuration and Multer storage setup.
- **`Utility/`**
  - `catchAsync.js`: Helper to wrap async route handlers.
  - `ExpressErrorHandler.js`: Custom error class.
  - `time.js`: Simple utility to log the server start time.
- **`seeds/`**
  - `index.js`: Database seeding script.
  - `seedHelpers.js`, `cities.js`, `Wilaya.js`: Data helpers for random camp generation.
- **`schemas.js`**: Joi validation schemas for campgrounds and reviews.
- **`middleware.js`**: Custom Express middleware for auth and validation.

---

## 🚀 How to Run It Locally

**1. Clone & install dependencies**

```bash
git clone <this-repo-url>
cd Rando
npm install
```

**2. Environment variables (`.env`)**

Create a `.env` file in the project root and define the variables that are actually referenced in the code:

```bash
NODE_ENV=development          # or production
DB_URL=mongodb://127.0.0.1:27017/RanDo
SECRET=some-session-secret    # used for MongoStore crypto

MAPTILER_API_KEY=your_maptiler_api_key

CLOUD_NAME=your_cloudinary_cloud_name
APIkey=your_cloudinary_api_key
APIsecret=your_cloudinary_api_secret
```

If `DB_URL` is not set, the app falls back to `mongodb://127.0.0.1:27017/RanDo`.

**3. Start the server**

Currently, there is no `start` script defined in `package.json`, so you can run:

```bash
node app.js
```

Or, for a better development experience with auto-reload (since `nodemon` is installed):

```bash
npx nodemon app.js
```

If you prefer `npm start`, you can add a `"start": "node app.js"` script to `package.json`.

**4. Open the app**

By default the server listens on port `3000`, so visit:

```text
http://localhost:3000
```

You can then register a user, log in, create campgrounds, and leave reviews.

---

## 🖼 Screenshots (to be added)

I’ll add real screenshots later, but typical views include:

- **Home / Campgrounds index** – list of all campgrounds with cards and a cluster map.
- **Campground show page** – image carousel, details, map, and reviews section.
- **Auth pages** – register and login forms.

---

## 💭 Challenges & What I’d Do Differently Next Time

- **Secrets & configuration**
  - Some sensitive values (like session secrets, fixed user IDs in seeds, and third-party keys in the seeding script) are hard-coded. Next time I’d move all of these into environment variables and centralize configuration so it’s easier to manage and safer to deploy.

- **Error handling & consistency**
  - While I added a custom error class and global error handler, a few controllers still mix logging, flashing, and redirects in ways that could be cleaner (and there’s at least one unused/typoed controller method for deleting reviews). I’d refactor controllers to have more consistent error paths and better separation between domain logic and response handling.

- **Structure & reusability**
  - `app.js` currently wires together database connection, middleware, routes, and security config all in one place. In a next iteration I’d extract configuration (database, security, session, Passport) into separate modules, add tests, and consider stronger typing or additional linting to catch bugs earlier.

Even with these rough edges, I’m proud of how much this project taught me about building a real-world-style app end to end. 🙂

