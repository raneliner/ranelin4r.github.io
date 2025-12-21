const loadAnimate = {
  load: document.getElementById('load'),
  nav: document.querySelector('.navbar'),
  mobileNav: document.querySelector('.mobile-navbar'),

  enter() {
    this.nav.classList.add('show');
    //this.mobileNav.classList.add('show');
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

function initGlobal() {
  lenis = new Lenis();
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

window.addEventListener('load', () => {
  loadAnimate.enter();
  menuToggle.init();
  initGlobal();
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
