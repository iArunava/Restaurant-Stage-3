self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('restaurant-cache-v2').then((cache) => {
            return cache.addAll([
                '/',
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
                'https://fonts.gstatic.com/s/quicksand/v7/6xKtdSZaM9iE8KbpRA_hK1QN.woff2'
            ]);
        })
    );
});


self.addEventListener('fetch', (event) => {
    let reg = new RegExp('(.*)?=(\\d*)');
    let request = event.request;
    let url = request.url;

    event.respondWith(
        caches.match(request).then((response) => {
            if (response) return response;
            return fetch(request);
        })
    );
});
