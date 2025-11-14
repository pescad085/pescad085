// Robust navigation + UI interactions
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu?.classList.toggle('active');
        });
    }

    // Close menu when a link is clicked (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });

    // Set active link based on current page (robust, ignores hashes and querystrings)
    function updateActiveLink() {
        const links = document.querySelectorAll('.nav-link');
        const currentPath = window.location.pathname;
        const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

        links.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href') || '';
            try {
                const resolved = new URL(href, window.location.href);
                // only consider same-origin links
                if (resolved.origin !== window.location.origin) return;
                const linkFile = resolved.pathname.substring(resolved.pathname.lastIndexOf('/') + 1) || 'index.html';
                if (linkFile === currentFile) {
                    link.classList.add('active');
                }
            } catch (e) {
                // ignore invalid URLs
            }
        });
    }

    updateActiveLink();
    window.addEventListener('hashchange', updateActiveLink);
    window.addEventListener('popstate', updateActiveLink);
    window.addEventListener('pageshow', updateActiveLink);

    // Smooth scroll for same-page anchors (handles '#' and 'page.html#id' when on that page)
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href) return;

            // pure hash (e.g. #contact)
            if (href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    history.replaceState(null, '', href);
                }
                return;
            }

            // links with hash that resolve to the same page (e.g. index.html#contact when on index.html)
            try {
                const resolved = new URL(href, window.location.href);
                if (resolved.origin === window.location.origin && resolved.pathname === window.location.pathname && resolved.hash) {
                    const target = document.querySelector(resolved.hash);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        history.replaceState(null, '', resolved.hash);
                    }
                }
            } catch (e) {}
        });
    });

    // Intersection observer for simple fade-in animations
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.resource-card, .book-card, .portfolio-item').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Navbar scroll shadow effect
    const navbar = document.querySelector('.navbar');
    function onScroll() {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.style.setProperty('box-shadow', '0 6px 25px rgba(7, 59, 76, 0.15)');
        } else {
            navbar.style.setProperty('box-shadow', '0 4px 20px rgba(7, 59, 76, 0.12)');
        }
    }

    onScroll();
    window.addEventListener('scroll', onScroll);
});
