(() => {
    function scrollCheck() {
        const back2top = document.getElementById('back2top');

        if (window.scrollY > 100) {
            back2top.classList.remove('hidden');
        } else {
            back2top.classList.add('hidden');
        }
    }

    window.addEventListener('scroll', scrollCheck);

    function Init() {
        var scroll = new SmoothScroll('a[href*="#"]', {
            offset: 72,
            speed: 1000,
            speedAsDuration: true,
            easing: 'easeInOutQuart'
        });

        const lenis = new Lenis();
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    const load = document.getElementById('load');
    const header = document.getElementById('header');

    window.addEventListener('load', function() {
        header.style.top = '0';
        document.body.overflow = 'visible';
        setTimeout(() => {
            load.style.opacity = '0';
        },500);
        setTimeout(() => {
            load.style.zIndex = '-114';
        },1000);
        
        scrollCheck();
        Init();
    });
})()


    const menuBtn = document.getElementById('menu');
    const mobile = document.querySelector('.mobile-navbar');

    menuBtn.onclick = function() {

        // 确保可聚焦以便监听 focusout
        if (!mobile.hasAttribute('tabindex')) mobile.setAttribute('tabindex', '-1');

        const opened = mobile.classList.toggle('visible');

        if (opened) {
            // 打开时聚焦，失去焦点则收回
            mobile.focus();

            const onFocusOut = (e) => {
                const related = e.relatedTarget;
                if (!related || !mobile.contains(related)) {
                    mobile.classList.remove('visible');
                    mobile.removeEventListener('focusout', onFocusOut);
                }
            };
            mobile.addEventListener('focusout', onFocusOut);
        }
    };

/* Image lightbox for post images */
(() => {
    function createLightboxDOM(){
        if (document.getElementById('theme-lightbox')) return document.getElementById('theme-lightbox');
        const wrapper = document.createElement('div');
        wrapper.id = 'theme-lightbox';
        wrapper.innerHTML = `
            <div class="lb-overlay" tabindex="-1" role="dialog" aria-hidden="true">
                <button class="lb-prev" aria-label="上一张">&#xe112;</button>
                <div class="lb-inner">
                    <img class="lb-img" src="" alt="">
                    <div class="lb-caption"></div>
                </div>
                <button class="lb-next" aria-label="下一张">&#xe111;</button>
            </div>`;
        document.body.appendChild(wrapper);
        return wrapper;
    }

    function initImageLightbox(selector = '.post-content p img'){
        const imgs = Array.from(document.querySelectorAll(selector));
        if (!imgs.length) return;
        const root = createLightboxDOM();
        const overlay = root.querySelector('.lb-overlay');
        const imgEl = root.querySelector('.lb-img');
        const captionEl = root.querySelector('.lb-caption');
        const btnPrev = root.querySelector('.lb-prev');
        const btnNext = root.querySelector('.lb-next');

        let current = -1;

        function open(index){
            if (index < 0 || index >= imgs.length) return;
            current = index;
            const src = imgs[current].getAttribute('data-large') || imgs[current].src;
            const alt = imgs[current].alt || '';
            imgEl.src = src;
            imgEl.alt = alt;
            captionEl.textContent = alt;
            document.body.classList.add('lightbox-open');
            overlay.classList.add('open');
            overlay.focus();
        }

        function close(){
            overlay.classList.remove('open');
            setTimeout(() => {
                document.body.classList.remove('lightbox-open');
                imgEl.src = '';
            }, 300);
        }

        function prev(){ open((current - 1 + imgs.length) % imgs.length); }
        function next(){ open((current + 1) % imgs.length); }

        imgs.forEach((el, idx) => {
            el.style.cursor = 'zoom-in';
            el.addEventListener('click', (e) => {
                e.preventDefault();
                open(idx);
            });
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });
        btnPrev.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
        btnNext.addEventListener('click', (e) => { e.stopPropagation(); next(); });

        document.addEventListener('keydown', (e) => {
            if (!overlay.classList.contains('open')) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        });
    }

    // 暴露初始化函数并自动在 DOMContentLoaded 时初始化
    window.initImageLightbox = initImageLightbox;
    document.addEventListener('DOMContentLoaded', () => initImageLightbox());
})();

(() => {
    const container = document.querySelector('.friends-link');
    if (!container) return;

    async function loadFriendsFromJSON() {
        try {
            const response = await fetch('/json/friends.json');
            if (!response.ok) throw new Error('友链数据加载失败');
            const friendsJSON = await response.json();
            
            container.innerHTML = '';

            friendsJSON.friends.forEach(friend => {
                const friendHTML = `
                    <a class="friend-item" href="${friend.url}" target="_blank" rel="noopener noreferrer">
                        <img src="${friend.avatar}" alt="${friend.name}" loading="lazy">
                        <div class="friend-info">
                            <span>${friend.title}</span>
                            <p><i>${friend.name}</i> • ${friend.desc}</p>
                        </div>
                    </a>
                `;
                container.innerHTML += friendHTML;
            });
        } catch (error) {
            console.error(error);
            const errorContainer = document.getElementById('friendsContainer') || document.querySelector('.friends-link');
            if (errorContainer) {
                errorContainer.innerHTML = '<p>甚是悲哉。</p>';
            }
        }
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        loadFriendsFromJSON();
    } else {
        window.addEventListener('DOMContentLoaded', loadFriendsFromJSON);
    }
})();
