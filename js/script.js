const back2top = document.getElementById('back2top');

function scrollCheck() {
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

const logo = document.querySelector('.navbar_logo');
const logo_text = document.querySelector('.navbar_logo span');
const prev = logo_text.innerHTML;

logo.onmouseover = function() {
    logo_text.style.opacity = 0;
    setTimeout(() => {
        logo_text.innerHTML = '🏠';
        logo_text.style.opacity = 1;
    }, 300);
    setTimeout(() => {
        logo_text.style.opacity = 0;
    }, 2000);
    setTimeout(() => {
    logo_text.innerHTML = prev;
    logo_text.style.opacity = 1;
    }, 2300);
}


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

const load = document.getElementById('load');
const header = document.getElementById('header');
const menu = document.getElementById('mobile-navbar');



/*
document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', function (e) {
    const a = this;
    const href = a.href;

    if (!href) return;
    if (a.hash || href === 'javascript:void(0);') return;

    e.preventDefault();

    document.body.style.overflow = 'hidden';
    menu.style.left = '-260px';
    header.style.top = '-60px';
    load.style.zIndex = '999';
    load.style.opacity = '1';

    setTimeout(() => {
      window.location.href = href;
    }, 400);
  });
});
*/

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

/*
document.addEventListener('DOMContentLoaded', function() {
    const pj = new Pjax({
        elements: 'a[href]:not([href^="#"]):not([href="javascript:void(0)"])',   // 拦截正常带链接的 a 标签
        selectors: ["#main","title","#logo","#back2top"]                                   // 根据实际需要确认重载区域
    });

    document.addEventListener('pjax:send', function() {
        document.body.style.overflow = 'hidden';
        menu.style.left = '-260px';
        header.style.top = '-60px';
        load.style.zIndex = '999';
        load.style.opacity = '1';
    });

    document.addEventListener('pjax:beforeReplace', function(e) {
        e.preventDefault(); // 阻止 Pjax 默认立即替换

        // Pjax 0.2.4 中，e.detail 包含所有重载区域的新内容（而非 e.target）
        // 因为你的 selectors 有多个（#main、#logo、#back2top），需遍历替换
        const newContents = e.detail; // newContents 是对象：{ selector: 新DOM元素 }

        // 延迟 300ms（过渡动画结束后）执行替换
        setTimeout(function() {
        // 遍历所有需要重载的区域，手动替换 DOM
        Object.keys(newContents).forEach(selector => {
            const oldElement = document.querySelector(selector);
            const newElement = newContents[selector];
            if (oldElement && newElement) {
            oldElement.parentNode.replaceChild(newElement, oldElement);
            }
        });

        // 替换后，恢复新内容的显示状态（移除过渡类）
        const newMain = document.querySelector('#main');
        newMain.classList.remove('pjax-fade-out');

        // 通知 Pjax 替换完成，触发后续 complete 事件（关键！）
        pj.fire('replace', newContents);
        }, fadeDuration); // 延迟时间 = 过渡动画时长（300ms）
    });

    document.addEventListener('pjax:complete', function() {
        setTimeout(() => {
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
        }, 400);
    });
});
*/

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
