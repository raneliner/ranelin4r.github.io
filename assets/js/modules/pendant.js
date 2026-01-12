class RopePendant {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.segments = options.segments ?? 8;
    this.segLength = options.segLength ?? 10;
    this.gravity = options.gravity ?? 0.6;
    this.damping = options.damping ?? 0.99;
    this.stiffness = options.stiffness ?? 0.9;
    this.pendantSize = options.pendantSize ?? 42;
    this.margin = options.margin ?? 16;
    this.origin = { x: 0, y: 0 };

    this.img = new Image();
    this.img.src = options.image;

    this.dragging = false;

    this.resize();
    this.initPoints();
    this.initSwing();
    this.bindEvents();
    this.loop();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.origin.x = window.innerWidth - this.margin;
    this.origin.y = 0;
  }

  initPoints() {
    this.points = [];
    for (let i = 0; i <= this.segments; i++) {
      this.points.push({
        x: this.origin.x,
        y: this.origin.y + i * this.segLength,
        oldx: this.origin.x,
        oldy: this.origin.y + i * this.segLength
      });
    }
  }

  initSwing() {
    const last = this.points[this.points.length - 1];
    last.oldx += 100; // Cool.
  }

  updatePhysics() {
    for (let i = 1; i < this.points.length; i++) {
      const p = this.points[i];
      const vx = (p.x - p.oldx) * this.damping;
      const vy = (p.y - p.oldy) * this.damping;
      p.oldx = p.x;
      p.oldy = p.y;
      if (!this.dragging || i !== this.points.length - 1) {
        p.x += vx;
        p.y += vy + this.gravity;
      }
    }

    this.points[0].x = this.origin.x;
    this.points[0].y = this.origin.y;

    for (let k = 0; k < 6; k++) {
      for (let i = 0; i < this.points.length - 1; i++) {
        const p1 = this.points[i];
        const p2 = this.points[i + 1];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.hypot(dx, dy) || 0.0001;
        const diff = (dist - this.segLength) / dist * this.stiffness;

        if (i !== 0) {
          p1.x += dx * diff * 0.5;
          p1.y += dy * diff * 0.5;
        }
        p2.x -= dx * diff * 0.5;
        p2.y -= dy * diff * 0.5;
      }
      this.points[0].x = this.origin.x;
      this.points[0].y = this.origin.y;
    }
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#555';
    ctx.stroke();

    const last = this.points[this.points.length - 1];
    if (this.img.complete) {
      ctx.drawImage(
        this.img,
        last.x - this.pendantSize / 2,
        last.y - this.pendantSize / 2,
        this.pendantSize,
        this.pendantSize
      );
    }
  }

  loop() {
    this.updatePhysics();
    this.draw();
    requestAnimationFrame(() => this.loop());
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());

    this.canvas.addEventListener('pointerdown', e => {
      const last = this.points[this.points.length - 1];
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      if (Math.hypot(dx, dy) < this.pendantSize) {
        this.dragging = true;
        this.canvas.classList.add('dragging');
        this.canvas.setPointerCapture(e.pointerId);
      }
    });

    this.canvas.addEventListener('pointermove', e => {
      if (!this.dragging) return;
      const last = this.points[this.points.length - 1];
      last.x = e.clientX;
      last.y = e.clientY;
      last.oldx = e.clientX;
      last.oldy = e.clientY;
    });

    const endDrag = e => {
      this.dragging = false;
      this.canvas.classList.remove('dragging');
      try { this.canvas.releasePointerCapture(e.pointerId); } catch {}
    };

    this.canvas.addEventListener('pointerup', endDrag);
    this.canvas.addEventListener('pointercancel', endDrag);
  }
}
