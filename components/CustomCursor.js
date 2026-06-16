import gsap from 'gsap';

export class CustomCursor {
  constructor() {
    this.createElements();
    this.init();
  }

  createElements() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.zIndex = '200001';
    document.body.appendChild(this.canvas);

    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';
    this.cursor.style.zIndex = '200003';
    document.body.appendChild(this.cursor);

    this.glow = document.createElement('div');
    this.glow.className = 'cursor-glow';
    this.glow.style.zIndex = '200002';
    document.body.appendChild(this.glow);
  }

  init() {
    const ctx = this.canvas.getContext('2d', { alpha: true, desynchronized: true });
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.canvas.width = width;
    this.canvas.height = height;

    this.handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      this.canvas.width = width;
      this.canvas.height = height;
    };
    window.addEventListener('resize', this.handleResize, { passive: true });

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };
    let lastMouse = { x: pos.x, y: pos.y };

    const particles = [];
    const maxParticles = 80;
    // Combination of all DUUO brand colors
    const colors = ['#8B2500', '#F5F0E8', '#1A1A18', '#888780', '#FFFFFF', '#EDE8DF'];

    class Particle {
      constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 6 + 3;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speedX = vx * 0.15 + (Math.random() * 4 - 2);
        this.speedY = vy * 0.15 + (Math.random() * 4 - 2);
        this.life = 1;
        this.decay = Math.random() * 0.03 + 0.02;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedX *= 0.92;
        this.speedY *= 0.92;
        this.life -= this.decay;
        this.size *= 0.94;
      }
      draw() {
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0, this.size), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    this.updateMouse = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      const dx = mouse.x - lastMouse.x;
      const dy = mouse.y - lastMouse.y;
      const dist = Math.hypot(dx, dy);
      
      if (dist > 3) {
        const numParticles = Math.min(Math.floor(dist / 8), 4);
        for(let i = 0; i < numParticles; i++) {
          if (particles.length < maxParticles) {
            particles.push(new Particle(mouse.x, mouse.y, dx, dy));
          } else {
            particles.shift();
            particles.push(new Particle(mouse.x, mouse.y, dx, dy));
          }
        }
        lastMouse.x = mouse.x;
        lastMouse.y = mouse.y;
      }
      
      if (this.cursor.style.opacity === '0' || this.cursor.style.opacity === '') {
        gsap.to([this.cursor, this.glow], { opacity: 1, duration: 0.3 });
      }
    };

    window.addEventListener('mousemove', this.updateMouse, { passive: true });

    const xSetCursor = gsap.quickSetter(this.cursor, "x", "px");
    const ySetCursor = gsap.quickSetter(this.cursor, "y", "px");
    const xSetGlow = gsap.quickSetter(this.glow, "x", "px");
    const ySetGlow = gsap.quickSetter(this.glow, "y", "px");

    this.tick = () => {
      const dt = 1.0 - Math.pow(1.0 - 0.2, gsap.ticker.deltaRatio());
      pos.x += (mouse.x - pos.x) * dt;
      pos.y += (mouse.y - pos.y) * dt;

      xSetCursor(mouse.x - 2.5);
      ySetCursor(mouse.y - 2.5);
      xSetGlow(mouse.x - 17.5);
      ySetGlow(mouse.y - 17.5);

      ctx.clearRect(0, 0, width, height);
      for(let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if(particles[i].life <= 0 || particles[i].size <= 0.1) {
          particles.splice(i, 1);
        }
      }
    };

    gsap.ticker.add(this.tick);

    this.handleMouseEnter = () => {
      this.cursor.classList.add('hover');
      this.glow.classList.add('hover');
    };

    this.handleMouseLeave = () => {
      this.cursor.classList.remove('hover');
      this.glow.classList.remove('hover');
    };

    this.updateInteractions = () => {
      const elements = document.querySelectorAll('a, button, .pill, .project-card');
      elements.forEach(el => {
        el.removeEventListener('mouseenter', this.handleMouseEnter);
        el.removeEventListener('mouseleave', this.handleMouseLeave);
        el.addEventListener('mouseenter', this.handleMouseEnter);
        el.addEventListener('mouseleave', this.handleMouseLeave);
      });
    };

    this.observer = new MutationObserver(this.updateInteractions);
    this.observer.observe(document.body, { childList: true, subtree: true });
    this.updateInteractions();
  }
}
