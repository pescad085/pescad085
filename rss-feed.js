// rss-feed.js
// Loads Blogger posts into the marquee. Uses JSONP first (avoids CORS), then a public CORS proxy fallback.

(function () {
    const BLOG_BASE = 'https://bahjats.blogspot.com';

    // Primary loader: JSONP using the blog's origin (works for blogspot)
    function fetchBloggerRSS() {
        const callbackName = '__blogger_jsonp_cb_' + Math.floor(Math.random() * 1000000);
        const jsonpUrl = `${BLOG_BASE}/feeds/posts/default?alt=json-in-script&callback=${callbackName}`;

        console.log('Attempting JSONP fetch for Blogger feed:', jsonpUrl);

        let timedOut = false;
        const timeoutMs = 8000; // 8s
        const timeout = setTimeout(() => {
            timedOut = true;
            console.warn('Blogger JSONP timed out. Falling back.');
            cleanup();
            fetchViaCORSProxy();
        }, timeoutMs);

        // Create callback
        window[callbackName] = function (data) {
            if (timedOut) return;
            clearTimeout(timeout);
            try {
                console.log('Blogger JSONP returned data.');
                parseBloggerJSON(data);
            } catch (err) {
                console.error('Error handling JSONP data:', err);
                displayFallbackMarquee();
            } finally {
                cleanup();
            }
        };

        function cleanup() {
            try { delete window[callbackName]; } catch (e) { window[callbackName] = undefined; }
            const s = document.getElementById(callbackName + '_script');
            if (s && s.parentNode) s.parentNode.removeChild(s);
        }

        // Insert script tag
        const script = document.createElement('script');
        script.id = callbackName + '_script';
        script.src = jsonpUrl;
        script.async = true;
        script.onerror = function (e) {
            if (timedOut) return;
            clearTimeout(timeout);
            console.error('JSONP script error:', e);
            cleanup();
            fetchViaCORSProxy();
        };
        document.body.appendChild(script);
    }

    // Fallback: Fetch feed XML via a public CORS proxy and parse
    async function fetchViaCORSProxy() {
        try {
            console.log('Attempting public CORS-proxy fetch (AllOrigins)...');
            const rssUrl = `${BLOG_BASE}/feeds/posts/default`;
            const proxy = 'https://api.allorigins.win/get?url=' + encodeURIComponent(rssUrl);
            const res = await fetch(proxy);
            if (!res.ok) throw new Error('CORS proxy response not ok');
            const json = await res.json();
            const xmlText = json.contents;
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            parseBloggerXML(xmlDoc);
        } catch (err) {
            console.error('CORS proxy fetch failed:', err);
            displayFallbackMarquee();
        }
    }

    // Parse Blogger JSON feed structure
    function parseBloggerJSON(data) {
        try {
            const entries = (data && data.feed && data.feed.entry) || [];
            const posts = [];
            for (let i = 0; i < Math.min(entries.length, 15); i++) {
                const e = entries[i];
                const title = (e.title && e.title.$t) || 'Untitled';
                const published = (e.published && e.published.$t) || '';
                let link = '#';
                if (e.link && Array.isArray(e.link)) {
                    const alt = e.link.find(l => l.rel === 'alternate');
                    if (alt && alt.href) link = alt.href;
                }
                posts.push({ title: title.trim(), published: formatDate(published), link });
            }
            if (posts.length) displayMarquee(posts);
            else displayFallbackMarquee();
        } catch (err) {
            console.error('Error parsing Blogger JSON:', err);
            displayFallbackMarquee();
        }
    }

    // Parse Atom/XML feed returned by proxy
    function parseBloggerXML(xmlDoc) {
        try {
            if (xmlDoc.getElementsByTagName('parsererror').length) throw new Error('XML parse error');
            const entries = xmlDoc.getElementsByTagName('entry') || [];
            const posts = [];
            for (let i = 0; i < Math.min(entries.length, 15); i++) {
                const entry = entries[i];
                const title = entry.getElementsByTagName('title')[0]?.textContent || 'Untitled';
                const published = entry.getElementsByTagName('published')[0]?.textContent || '';
                const links = entry.getElementsByTagName('link') || [];
                let link = '#';
                for (let j = 0; j < links.length; j++) {
                    if (links[j].getAttribute('rel') === 'alternate') {
                        link = links[j].getAttribute('href');
                        break;
                    }
                }
                posts.push({ title: title.trim(), published: formatDate(published), link });
            }
            if (posts.length) displayMarquee(posts);
            else displayFallbackMarquee();
        } catch (err) {
            console.error('Error parsing XML feed:', err);
            displayFallbackMarquee();
        }
    }

    function formatDate(isoString) {
        try {
            if (!isoString) return '';
            const d = new Date(isoString);
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } catch (e) { return ''; }
    }

    // Render marquee content (duplicate for seamless scroll)
    function displayMarquee(posts) {
        const marqueeContent = document.getElementById('marqueeContent');
        if (!marqueeContent) return console.warn('No #marqueeContent element found');
        const text = posts.map(p => `📝 ${escapeHtml(p.title)} ${p.published ? '(' + p.published + ')' : ''}`).join(' • ');
        // Duplicate text twice to create continuous loop
        marqueeContent.innerHTML = `<span class="marquee-text">${text}</span><span class="marquee-text">${text}</span>`;
    }

    function escapeHtml(str) {
        return String(str).replace(/[&<>"']/g, function (m) {
            return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m];
        });
    }

    function displayFallbackMarquee() {
        const marqueeContent = document.getElementById('marqueeContent');
        if (!marqueeContent) return;
        const fallbackText = '📝 Welcome to my blog! • 🎓 Teaching web design and English • 🎹 Creating music and tutorials • ✍️ Writing educational content • 🎮 Gaming and content creation';
        marqueeContent.innerHTML = `<span class="marquee-text">${fallbackText}</span><span class="marquee-text">${fallbackText}</span>`;
    }

    // Start
    document.addEventListener('DOMContentLoaded', function () {
        console.log('rss-feed: initializing');
        fetchBloggerRSS();
    });

})();
