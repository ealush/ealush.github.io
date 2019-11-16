const GIT_REPOS = [
    'https://api.github.com/repos/fiverr/passable',
    'https://api.github.com/users/ealush/repos'
];

const CACHE_NAME = 'repositories';

const FETCH_OPTIONS = {
    method: 'get',
    cache: 'no-cache',
    credentials: 'omit'
};

async function sendMessage(msg) {
    var allClients = await clients.matchAll({ includeUncontrolled: true });
    return Promise.all(
        allClients.map(function clientMsg(client) {
            var chan = new MessageChannel();
            chan.port1.onmessage = onMessage;
            return client.postMessage(msg, [chan.port2]);
        })
    )
}

const onInstall = self.skipWaiting;

const onActivate = (event) => event.waitUntil(handleActivation());

async function handleActivation() {
    await cacheRepositories();
    await clients.claim();
}

const cacheRepositories = async () => {
    const cache = await caches.open(CACHE_NAME);

    await cache.addAll(GIT_REPOS);
    return self.skipWaiting();
}

self.addEventListener('install', onInstall);
self.addEventListener('activate', onActivate);
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => {
            return res || fetch(e.request)
        })
    )
});
