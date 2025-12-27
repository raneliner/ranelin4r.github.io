function initProjects() {
  const particles = document.createElement('div');

  particles.id = 'particles';
  particles.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  `;
  document.body.appendChild(particles);

  particlesJS('particles', {
    particles: {
      number: { value: 160, density: { enable: true, value_area: 800 } },
      color: { value: '#000' },
      shape: { type: 'circle' },
      opacity: { value: 0.3, random: true },
      size: { value: 10, random: true },
      line_linked: { enable: false },
      move: { enable: true, speed: 1.2, random: true }
    },
    interactivity: {
      detect_on: 'window',
      events: { onhover: { enable: false }, onclick: { enable: false }, resize: true },
      modes: { bubble: { distance: 120, size: 10, duration: 0.4, opacity: 1 } }
    },
    retina_detect: true
  });
}