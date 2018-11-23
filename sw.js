self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open('restaurant-cache-v4').then((cache) => {
            return cache.addAll([
                '/',
                'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
                'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
                'manifest.json',
                '/restaurant.html',
                '/restaurant.html?id=1',
                '/restaurant.html?id=2',
                '/restaurant.html?id=3',
                '/restaurant.html?id=4',
                '/restaurant.html?id=5',
                '/restaurant.html?id=6',
                '/restaurant.html?id=7',
                '/restaurant.html?id=8',
                '/restaurant.html?id=9',
                '/restaurant.html?id=10',
                'js/main.js',
                'js/dbhelper.js',
                'js/restaurant_info.js',
                'js/setServiceWorker.js',
                'js/idb.js',
                'css/styles.css',
                'img/1.jpg',
                'img/2.jpg',
                'img/3.jpg',
                'img/4.jpg',
                'img/5.jpg',
                'img/6.jpg',
                'img/7.jpg',
                'img/8.jpg',
                'img/9.jpg',
                'img/10.jpg',
                'icons/diet-128.png',
                //'https://fonts.gstatic.com/s/quicksand/v7/6xKtdSZaM9iE8KbpRA_hK1QN.woff2',
                'https://fonts.googleapis.com/css?family=Quicksand:300'
            ]);
        }).catch(() => {
            console.log('Error while caching!');
        })
    );
});


self.addEventListener('fetch', (event) => {
    //console.log(event);
    let reg = new RegExp('(.*)?=(\\d*)');
    let request = event.request;
    let url = request.url;
    //console.log(request);

    event.respondWith(
        caches.match(request)
            .then((response) => {
                if (response) return response;
                return fetch(request);
            }).catch(error => {
                console.log('Error while fetching!');
            })
    );
});
