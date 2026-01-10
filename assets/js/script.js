const loadAnimate = {
  load: document.getElementById('load'),
  nav: document.querySelector('.navbar'),
  mobileNav: document.querySelector('.mobile-navbar'),

  enter() {
    this.nav.classList.add('show');
    setTimeout(() => {
      this.load.classList.add('hidden');
    }, 500);
  },

  leave() {
    this.nav.classList.remove('show');
    this.load.classList.remove('hidden');
    if (this.mobileNav.classList.contains('show')) {
      this.mobileNav.classList.remove('show');
    }
  }
}

const menuToggle = {
  button: document.getElementById('menu'),
  mobileNav: document.querySelector('.mobile-navbar'),

  init() {
    this.button.addEventListener('click', e => {
      e.stopPropagation();
      this.mobileNav.classList.toggle('show');
    });

    document.addEventListener('click', e => {
      if (!this.mobileNav.classList.contains('show')) return;

      if (!this.button.contains(e.target)) {
        this.mobileNav.classList.remove('show');
      }
    });
  }
}

const scrollCheck = {
  nav: document.querySelector('.navbar'),
  back: document.getElementById('back2top'),
  lastScrollY: 0,
  currentScrollY: window.scrollY,
  
  init() {
    window.addEventListener('scroll', () => {
      this.currentScrollY = window.scrollY;
      this.backToTop();
      this.navScroll();
    }, { passive: true });
  },

  backToTop() {
    if (!this.back) return;

    if (this.currentScrollY > 100) {
      this.back.classList.add('show');
    } else {
      this.back.classList.remove('show');
    }
  },

  navScroll() {
    if (this.currentScrollY > this.lastScrollY) {
      if (this.currentScrollY < 100) return;
      this.nav.classList.remove('show');
    } else {
      this.nav.classList.add('show');
    }
    this.lastScrollY = this.currentScrollY;
  }
}

function initGlobal() {
  lenis = new Lenis();
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  var scroll = new SmoothScroll('a[href*="#top"]', {
    offset: 72,
    speed: 1500,
    speedAsDuration: true,
    easing: 'easeInOutQuart'
  });
}

window.addEventListener('DOMContentLoaded', () => {
  loadAnimate.enter();
  menuToggle.init();
  scrollCheck.init();
  initGlobal();
});

document.addEventListener('DOMContentLoaded', () => {
  const type = document.body.className.toLowerCase();

  switch (type) {
    case 'projects':
      initProjects();
      document.body.classList.add('pro');
      break;
    case 'page':
      console.log('page');
      break;
    case 'index':
      console.log('index');
      break;
    default:
      console.log('No specific init for this page type.');
  }
});

window.addEventListener('beforeunload', () => {
  loadAnimate.leave();
});

window.addEventListener('pageshow', (e) => {
  if (e.persisted || performance) {
    loadAnimate.enter();
  }
});

window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
    e.preventDefault();
    e.stopPropagation();
    }
});
