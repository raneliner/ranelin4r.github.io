const back2top = document.getElementById('back2top');

function scrollCheck() {
    if (window.scrollY > 100) {
        back2top.classList.remove('hidden');
    } else {
        back2top.classList.add('hidden');
    }
}

window.addEventListener('scroll', scrollCheck);

let lenis = null;

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

function showNav() {
    const mobileNavbar = document.getElementById('mobile-navbar');
    if (mobileNavbar.classList.contains('visible')) {
        mobileNavbar.classList.remove('visible');
    } else {
        mobileNavbar.classList.add('visible');
    }
};

const logo = document.getElementById('logo');
let isAnimating = false;

logo.addEventListener('click', () => {
    if (isAnimating) return;
    
    if (logo.classList.contains('spin')) {
        logo.classList.remove('spin');
    } else {
        isAnimating = true;
        logo.classList.add('spin');
    }
});

logo.addEventListener('animationend', () => {
    isAnimating = false;
    logo.classList.remove('spin');
});

const load = document.getElementById('load');
const header = document.getElementById('header');
const main = document.getElementById('main');

window.addEventListener('DOMContentLoaded', function() {
    header.style.top = '0';
    main.style.overflow = 'visible';
    setTimeout(() => {
        load.style.opacity = '0';
    },500);
    setTimeout(() => {
        load.style.zIndex = '-114';
    },1000);
    
    scrollCheck();
    Init();
});

window.onbeforeunload = () => {
    document.body.style.overflow = 'hidden';
    header.style.top = '-60px';
    load.style.zIndex = '999';
    load.style.opacity = '1';
};

/* Image lightbox for post images */
(function(){
    function createLightboxDOM(){
        if (document.getElementById('theme-lightbox')) return document.getElementById('theme-lightbox');
        const wrapper = document.createElement('div');
        wrapper.id = 'theme-lightbox';
        wrapper.innerHTML = `
            <div class="lb-overlay" tabindex="-1" role="dialog" aria-hidden="true">
                <button class="lb-prev" aria-label="上一张">&#xe112;</button>
                <div class="lb-inner"><img class="lb-img" src="" alt=""><div class="lb-caption"></div></div>
                <button class="lb-next" aria-label="下一张">&#xe111;</button>
            </div>`;
        document.body.appendChild(wrapper);
        return wrapper;
    }

    function initImageLightbox(selector = '.post-content img'){
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
