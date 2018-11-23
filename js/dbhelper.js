/**
 * Common database helper functions.
 */

reviews_to_sync = []

class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }

  static initIDB() {
      return idb.open('restaurants-db', 2, (upgradeDb) => {
          switch (upgradeDb.oldVersion) {
              case 0:
                  upgradeDb.createObjectStore('restaurants-json');
              case 1:
                  upgradeDb.createObjectStore('reviews-json');
          }
      })
  }

  static getrestaurantsFromDB(idbPromise) {
      return idbPromise.then((db) => {
          if (!db) return;
          let tx = db.transaction('restaurants-json');
          let restaurantsStore = tx.objectStore('restaurants-json');
          return restaurantsStore.get('restaurants-json');
      });
  }

  static updateRestaurantsInDB(restaurants, idbPromise) {
      return idbPromise.then((db) => {
          if (!db) return;
          let tx = db.transaction('restaurants-json', 'readwrite');
          let restaurantsStore = tx.objectStore('restaurants-json');
          restaurantsStore.put(restaurants, 'restaurants-json');
          tx.complete;
      });
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    const idbPromise = DBHelper.initIDB();

    if (navigator.onLine) {
      console.log(navigator.onLine);
      fetch(DBHelper.DATABASE_URL)
        .then(response => response.json())
        .then(restaurants => {
          if (!restaurants || restaurants.length === 0) {
            throw new Error('Restaurants Empty!')
          }

          console.log('sds');
          DBHelper.updateRestaurantsInDB(restaurants, idbPromise);
          console.log('80s');
          callback(null, restaurants);
        }).catch(_ => {
          console.log('abv');
          DBHelper.getrestaurantsFromDB(idbPromise)
            .then((resturants) => {
              if (restaurants && restaurants.length > 0)
                callback(null, restaurants);
            });
        });
    } else {
      console.log('yre');
      DBHelper.getrestaurantsFromDB(idbPromise)
        .then((restaurants) => {
          console.log(restaurants)
          if (restaurants && restaurants.length > 0)
            callback(null, restaurants);
        }).catch(error => {
            console.log(error);
        });
    }
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        console.log('ftsct');
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    let photo_name = restaurant.photograph;
    if (photo_name === undefined) photo_name = "10";
    return (`/img/${photo_name}.jpg`);
  }

  /**
   * Map marker for a restaurant.
   */
   static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
      alt: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant)
      })
      marker.addTo(map);
    return marker;
  }

  /**
   * Fetch reviews by restaurant id
   */
   static getReviewsByRestaurant(dbPromise, restaurant_id) {
    return dbPromise.then((db) => {
      if (!db) return;
      let tx = db.transaction('reviews-json');
      let reviewStore = tx.objectStore('reviews-json');
      return reviewStore.get(restaurant_id);
    });
   }

  /**
   * Update reviews to db
   */
   static updateReviewsToDb(dbPromise, restaurant_id, review) {
    console.log('updated1!');
    return dbPromise.then(db => {
      if (!db) return;
      let tx = db.transaction('reviews-json', 'readwrite');
      let reviewStore = tx.objectStore('reviews-json');
      reviewStore.put(review, restaurant_id);
      tx.complete;
      console.log('updated!');
    });
   }

   static fetchReviewsByRestaurantId(restaurant_id) {
    const review_url = `http://localhost:1337/reviews/?restaurant_id=${restaurant_id}`;
    const dbPromise = DBHelper.initIDB();

    if (navigator.onLine) {
      return fetch(review_url)
        .then(response => response.json())
        .then(reviews => {
          if (!reviews || reviews.length === 0)
            throw new Error('No review found to updated!');

          console.log(restaurant_id); console.log(reviews);
          DBHelper.updateReviewsToDb(dbPromise, restaurant_id, reviews);
          return reviews;
          }).catch( _ => {
            return DBHelper.getReviewsByRestaurant(dbPromise, restaurant_id)
              .then(reviews => {
                if (reviews && reviews.length > 0)
                  return reviews;
              });
          });
        } else {
          return DBHelper.getReviewsByRestaurant(dbPromise, restaurant_id)
            .then(reviews => {
              if (reviews && reviews.length > 0)
                return reviews;
            });
        }
  }

    static putReviewsInDb(review_dict) {
      const dbPromise = DBHelper.initIDB();

      console.log(review_dict.restaurant_id);
      console.log(typeof review_dict.restaurant_id);
      DBHelper.getReviewsByRestaurant(dbPromise, review_dict.restaurant_id)
      .then(reviews => {
        if (!reviews) return;
        reviews.push(reviews);
        DBHelper.updateReviewsToDb(dbPromise, review_dict.restaurant_id, review_dict)

        if (navigator.onLine) {
          const review_url = 'http://localhost:1337/reviews';

          console.log('putReviewsInDb2');
          return fetch(review_url, {
            method: 'POST',
            body: JSON.stringify(review_dict),
            headers: {
              'Content-Type': 'application/json'
            }
          });
        } else {
          reviews_to_sync.push(review_dict)
        }
      }).catch(error => {
        console.log(error);
      })
    }
}
