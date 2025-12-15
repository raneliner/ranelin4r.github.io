(function () {

    /* =======================
     * State
     * ======================= */

    let lenis = null;
    let lastScrollY = 0;

    const header = document.querySelector('.navbar');
    const load = document.getElementById('load');

    /* =======================
     * Scroll
     * ======================= */

    function scrollCheck() {
        const back2top = document.getElementById('back2top');
        if (!back2top) return;

        if (window.scrollY > 100) {
            back2top.classList.remove('hidden');
        } else {
            back2top.classList.add('hidden');
        }
    }

    function handleNavScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY) {
            if (currentScrollY < 100) return;
            header.classList.remove('show');
        } else {
            header.classList.add('show');
        }

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', () => {
        scrollCheck();
        handleNavScroll();
    }, { passive: true });

    /* =======================
     * Global Init (once)
     * ======================= */

    function initGlobal() {

        new SmoothScroll('a[href*="#"]', {
            offset: 72,
            speed: 1000,
            speedAsDuration: true,
            easing: 'easeInOutQuart'
        });

        lenis = new Lenis();
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        bindMenu();
    }

    function bindMenu() {
        const menuBtn = document.getElementById('menu');
        const mobile = document.querySelector('.mobile-navbar');

        if (!menuBtn || !mobile) return;

        menuBtn.onclick = () => {
            if (!mobile.hasAttribute('tabindex')) {
                mobile.setAttribute('tabindex', '-1');
            }

            const opened = mobile.classList.toggle('visible');

            if (opened) {
                mobile.focus();
                const onFocusOut = e => {
                    if (!mobile.contains(e.relatedTarget)) {
                        mobile.classList.remove('visible');
                        mobile.removeEventListener('focusout', onFocusOut);
                    }
                };
                mobile.addEventListener('focusout', onFocusOut);
            }
        };
    }

    /* =======================
     * Page Init (per enter)
     * ======================= */

    function initPage() {
        scrollCheck();
        loadComments();
        loadFriends();
    }

    function loadComments() {
        const commentEle = document.querySelector('.comment');
        if (!commentEle) return;
        //if (commentEle.children.length > 0) return;

        const s = document.createElement('script');
        s.src = 'https://giscus.app/client.js';
        s.async = true;
        s.crossOrigin = 'anonymous';

        s.setAttribute('data-repo', 'raneliner/ranelin4r.github.io');
        s.setAttribute('data-repo-id', 'R_kgDOMpVltQ');
        s.setAttribute('data-category', 'Announcements');
        s.setAttribute('data-category-id', 'DIC_kwDOMpVltc4Cx0Cx');
        s.setAttribute('data-mapping', 'url');
        s.setAttribute('data-strict', '0');
        s.setAttribute('data-reactions-enabled', '1');
        s.setAttribute('data-emit-metadata', '0');
        s.setAttribute('data-input-position', 'bottom');
        s.setAttribute('data-theme', 'light');
        s.setAttribute('data-lang', 'zh-CN');

        commentEle.appendChild(s);
    }

    async function loadFriends() {
        const container = document.querySelector('.friends-link');
        if (!container) return;

        try {
            const res = await fetch('/json/friends.json');
            const json = await res.json();

            container.innerHTML = '';
            json.friends.forEach(friend => {
                container.insertAdjacentHTML('beforeend', `
                    <a class="friend-item" href="${friend.url}" target="_blank">
                        <img src="${friend.avatar}" alt="${friend.name}">
                        <div class="friend-info">
                            <span>${friend.title}</span>
                            <p>${friend.name} • ${friend.desc}</p>
                        </div>
                    </a>
                `);
            });
        } catch {
            container.innerHTML = '<p>甚是悲哉。</p>';
        }
    }

    /* =======================
     * Header Sync
     * ======================= */

    function syncHeader(next) {
        const pageTitle = next.container.dataset.pageTitle;
        const titleEl = document.getElementById('navbar-title');

        if (titleEl && pageTitle) {
            titleEl.textContent = pageTitle;
        }
    }

    /* =======================
     * Barba
     * ======================= */

    barba.init({
        transitions: [{
            async leave() {
                header.classList.remove('show');
                load.classList.remove('hidden');
                await new Promise(r => setTimeout(r, 400));
            },
            enter({ next }) {
                header.classList.add('show');
                setTimeout(() => load.classList.add('hidden'), 500);
                window.scrollTo(0, 0);
                syncHeader(next);
                initPage();
            }
        }]
    });

    /* =======================
     * Boot
     * ======================= */

    window.addEventListener('load', () => {
        header.classList.add('show');
        setTimeout(() => load.classList.add('hidden'), 1000);
        initGlobal();
        initPage();
    });

})();
