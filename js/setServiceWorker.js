document.addEventListener('DOMContentLoaded', (event) => {
  setServiceWorker();
});

function setServiceWorker() {
    if (!navigator.serviceWorker) return;
    navigator.serviceWorker.register('/sw.js').then(() => {
        console.log('Service Worker Registered!');
    }).catch((error) => {
        console.log('Registration failed!');
        console.log(error);
    });
}
