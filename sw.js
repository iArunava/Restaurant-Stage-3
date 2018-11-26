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
                'css/restaurant-details.css',
                'css/home-styles.min.css',
                'img/1.webp',
                'img/2.webp',
                'img/3.webp',
                'img/4.webp',
                'img/5.webp',
                'img/6.webp',
                'img/7.webp',
                'img/8.webp',
                'img/9.webp',
                'img/10.webp',
                'icons/diet-128.png',
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
    if (url.endsWith('.jpg')) {
        url = url.substring(0, url.length - 3) + 'webp'
        console.log(url);
        request = new Request(url);
    }
    //request.url = url;
    //console.log(request.url);

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
