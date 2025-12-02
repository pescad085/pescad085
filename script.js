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

    // --- Vocabulary Practice Quiz (runs only on pages that include the quiz markup) ---
    const wordList = [
  { word: "Exasperate", definition: "To make someone very annoyed." },
  { word: "Jest", definition: "A joke or something said to be funny." },
  { word: "Rustling", definition: "A soft sound made when leaves, paper, or similar things move." },
  { word: "Haughty", definition: "Acting as if you are better than other people." },
  { word: "Ostentatious", definition: "Showing off to make others admire you." },
  { word: "Wont", definition: "Having a habit of doing something." },
  { word: "Reminisce", definition: "To think or talk about good memories from the past." },
  { word: "Content", definition: "Feeling happy or satisfied." },
  { word: "Heist", definition: "A robbery, especially from a bank or store." },
  { word: "Stagger", definition: "To walk without balance, almost falling." },
  { word: "Ailment", definition: "A small or minor sickness." },
  { word: "Astute", definition: "Able to make smart, quick decisions." },
  { word: "Sublime", definition: "Extremely beautiful or wonderful." },
  { word: "Despot", definition: "A cruel and powerful ruler." },
  { word: "Aphorism", definition: "A short, famous saying that expresses a truth." },
  { word: "Hideous", definition: "Very ugly." },
  { word: "Flutter", definition: "To move or flap quickly and lightly." },
  { word: "Rummage", definition: "To search by moving things around." },
  { word: "Eccentric", definition: "Acting in a strange or unusual way." },
  { word: "Diffuse", definition: "To spread out over a wide area." },
  { word: "Conjecture", definition: "A guess made without proof." },
  { word: "Scruple", definition: "A feeling that stops you from doing something wrong." },
  { word: "Tremble", definition: "To shake because of fear, cold, or nervousness." },
  { word: "Ineffable", definition: "Too great to describe in words." },
  { word: "Prattle", definition: "To talk in a silly or childish way." },
  { word: "Prudent", definition: "Careful and wise; avoiding risks." },
  { word: "Alms", definition: "Money, food, or goods given to poor people." },
  { word: "Recoil", definition: "To move back because of fear." },
  { word: "Ajar", definition: "Slightly open." },
  { word: "Abound", definition: "To exist in large numbers." },
  { word: "Disconcert", definition: "To make someone feel worried or confused suddenly." },
  { word: "Hurl", definition: "To throw something with great force." },
  { word: "Toil", definition: "Hard, tiring work." },
  { word: "Majestic", definition: "Beautiful and impressive." },
  { word: "Linger", definition: "To stay somewhere longer than needed." },
  { word: "Flippant", definition: "Not taking something serious seriously; joking at the wrong time." },
  { word: "Notion", definition: "An idea or belief." },
  { word: "Impress", definition: "To make someone admire you." },
  { word: "Reproach", definition: "To criticize someone for doing something wrong." },
  { word: "Furnace", definition: "A very hot container used to melt or burn things." },
  { word: "Notable", definition: "Important or well-known." },
  { word: "Scrawl", definition: "To write quickly and messily." },
  { word: "Somber", definition: "Sad or serious." },
  { word: "Mojo", definition: "A personal quality that brings charm or success." },
  { word: "Outburst", definition: "A sudden strong expression of emotion." },
  { word: "Efface", definition: "To erase or remove something from a surface." },
  { word: "Panacea", definition: "A cure-all for every problem or disease." },
  { word: "Wrath", definition: "Strong anger." },
  { word: "Reputation", definition: "What others think about someone." },
  { word: "Mend", definition: "To fix something that is broken." },
  { word: "Venerable", definition: "Deserving respect because of age or importance." },
  { word: "Aptitude", definition: "A natural ability to do something well." },
  { word: "Abominate", definition: "To strongly hate something." },
  { word: "Beseech", definition: "To beg someone desperately for something." },
  { word: "Humbly", definition: "In a modest or gentle way." },
  { word: "Haphazardly", definition: "Without planning; done in a careless way." },
  { word: "Intrepid", definition: "Very brave; not afraid of danger." },
  { word: "Mortify", definition: "To greatly embarrass someone." },
  { word: "Disclose", definition: "To reveal information or a secret." },
  { word: "Avow", definition: "To openly admit or declare something." },
  { word: "Vanity", definition: "Too much pride in one's looks or achievements." },
  { word: "Brandished", definition: "Held and waved something in a dramatic or threatening way." },
  { word: "Deject", definition: "To make someone sad or discouraged." },
  { word: "Summon", definition: "To call someone to come to you." },
  { word: "Redundant", definition: "Unnecessary because it repeats something." },
  { word: "Fragile", definition: "Easily broken or damaged." },
  { word: "Stuck", definition: "Unable to move or escape a situation." },
  { word: "Woe", definition: "Great sadness or suffering." },
  { word: "Ignominy", definition: "Public shame from bad behavior." },
  { word: "Odious", definition: "Extremely unpleasant or hateful." },
  { word: "Reproach", definition: "Disapproval or criticism for someone’s actions." },
  { word: "Attenuate", definition: "To make weaker or less strong." },
  { word: "Despondent", definition: "Feeling hopeless or very discouraged." },
  { word: "Quiver", definition: "To shake quickly because of fear, cold, or excitement." },
  { word: "Inevitable", definition: "Certain to happen; unavoidable." },
  { word: "Fetid", definition: "Having a very bad smell." },
  { word: "Tainted", definition: "Damaged or spoiled in quality or reputation." },
  { word: "Verdant", definition: "Covered in green plants or grass." },
  { word: "Gnashed", definition: "Ground teeth together in anger." },
  { word: "Alighted", definition: "Landed gently, like a bird or insect." },
  { word: "Tremendous", definition: "Very large or very good." },
  { word: "Assuage", definition: "To reduce pain or make something feel less bad." },
  { word: "Artificial Intelligence", definition: "Technology that makes machines act as if they are intelligent." },
  { word: "Compunction", definition: "A feeling of guilt after doing something wrong." },
  { word: "Heap", definition: "A large pile of things." },
  { word: "Emaciated", definition: "Extremely thin because of hunger or illness." },
  { word: "Ruffian", definition: "A violent or lawless person; a bully." },
  { word: "Dash", definition: "To run quickly; also a small amount added to food." },
  { word: "Cordial", definition: "Warm, friendly, and polite." },
  { word: "Peasant", definition: "A poor farmer or farm worker." },
  { word: "Roam", definition: "To walk or travel without a specific destination." },
  { word: "Elucidate", definition: "To explain something clearly." },
  { word: "Impoverish", definition: "To make someone very poor." },
  { word: "Smidgen", definition: "A very small amount." },
  { word: "Homage", definition: "Respect or honor shown to someone." },
  { word: "Patronize", definition: "To support someone or something, often with money." },
  { word: "Rectify", definition: "To correct something that is wrong." },
  { word: "Reminisce", definition: "To recall and talk about past experiences." },
  { word: "Defy", definition: "To refuse to obey someone or something." },
  { word: "Faze", definition: "To make someone feel afraid, upset, or nervous." }
];

    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    // Quiz UI only exists on practice.html
    const quizRoot = document.getElementById('quiz');
    if (quizRoot) {
        const definitionEl = document.getElementById('definition');
        const choicesEl = document.getElementById('choices');
        const nextBtn = document.getElementById('nextBtn');
        const restartBtn = document.getElementById('restartBtn');
        const scoreEl = document.getElementById('score');
        const currentEl = document.getElementById('current');
        const totalEl = document.getElementById('total');

        let order = Array.from({ length: wordList.length }, (_, i) => i);
        shuffleArray(order);
        let current = 0;
        let score = 0;
        totalEl.textContent = wordList.length;

        function renderQuestion() {
            const idx = order[current];
            const item = wordList[idx];
            definitionEl.textContent = item.definition;
            choicesEl.innerHTML = '';

            // create choices: correct + 3 random distractors
            const wrongs = [];
            const pool = wordList.map(w => w.word).filter(w => w !== item.word);
            shuffleArray(pool);
            for (let i = 0; i < 3; i++) wrongs.push(pool[i]);

            const options = [item.word, ...wrongs];
            shuffleArray(options);

            options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'btn choice-btn';
                btn.type = 'button';
                btn.textContent = opt;
                btn.addEventListener('click', () => handleChoice(btn, item.word));
                choicesEl.appendChild(btn);
            });

            currentEl.textContent = current + 1;
            scoreEl.textContent = `Score: ${score}`;
            // update Next button text
            nextBtn.textContent = current < wordList.length - 1 ? 'Next' : 'Finish';
        }

        function handleChoice(button, correctWord) {
            // disable all choices
            Array.from(choicesEl.children).forEach(b => b.disabled = true);
            const chosen = button.textContent;
            if (chosen === correctWord) {
                button.classList.add('correct');
                score++;
            } else {
                button.classList.add('incorrect');
                // highlight correct
                Array.from(choicesEl.children).forEach(b => {
                    if (b.textContent === correctWord) {
                        b.classList.add('correct');
                    }
                });
            }
            scoreEl.textContent = `Score: ${score}`;
        }

        nextBtn.addEventListener('click', () => {
            // if last question and choices still enabled (user didn't choose), treat as incorrect and move on
            if (current < wordList.length - 1) {
                current++;
                renderQuestion();
            } else {
                // finished
                quizRoot.innerHTML = `\n                    <div class="quiz-results">\n                        <h2>Results</h2>\n                        <p>Your score: <strong>${score}</strong> / ${wordList.length}</p>\n                        <p>Click Restart to try again.</p>\n                    </div>`;
            }
        });

        restartBtn.addEventListener('click', () => {
            order = Array.from({ length: wordList.length }, (_, i) => i);
            shuffleArray(order);
            current = 0;
            score = 0;
            renderQuestion();
        });

        // initial render
        renderQuestion();
    }
});
