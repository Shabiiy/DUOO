import gsap from 'gsap';

export class Navbar {
  constructor() {
    this.nav = document.getElementById('navbar');
    
    // Smooth transition on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        this.nav.classList.add('scrolled');
      } else {
        this.nav.classList.remove('scrolled');
      }
    }, { passive: true });

    this.initPills();
  }

  initPills() {
    const layoutPills = () => {
      document.querySelectorAll('.pill').forEach(pill => {
        const circle = pill.querySelector('.hover-circle');
        if (!circle) return;
        
        const rect = pill.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        // Mathematical circle that covers the entire pill from the bottom
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${originY}px` });

        const label = pill.querySelector('.pill-label');
        const hoverLabel = pill.querySelector('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (hoverLabel) gsap.set(hoverLabel, { y: h + 12, opacity: 0 });
        
        if (pill._animTl) pill._animTl.kill();
        pill._animTl = gsap.timeline({ paused: true });
        
        pill._animTl.to(circle, { scale: 1.2, xPercent: -50, duration: 0.45, ease: "power3.out", overwrite: 'auto' }, 0);
        
        if (label) {
            pill._animTl.to(label, { y: -(h + 8), duration: 0.45, ease: "power3.out", overwrite: 'auto' }, 0);
        }
        if (hoverLabel) {
            gsap.set(hoverLabel, { y: Math.ceil(h + 100), opacity: 0 });
            pill._animTl.to(hoverLabel, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", overwrite: 'auto' }, 0);
        }
      });
    };
    
    // Slight delay to ensure DOM layout is complete before calculating pill sizes
    setTimeout(layoutPills, 100);
    window.addEventListener("resize", layoutPills);
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(layoutPills);
    }

    const handleMouseEnter = (e) => {
        const pill = e.currentTarget;
        if(pill._activeTween) pill._activeTween.kill();
        pill._activeTween = pill._animTl.tweenTo(pill._animTl.duration(), { duration: 0.35, ease: "power2.out", overwrite: 'auto' });
    };
    const handleMouseLeave = (e) => {
        const pill = e.currentTarget;
        if(pill._activeTween) pill._activeTween.kill();
        pill._activeTween = pill._animTl.tweenTo(0, { duration: 0.25, ease: "power2.out", overwrite: 'auto' });
    };
    
    document.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener("mouseenter", handleMouseEnter);
        pill.addEventListener("mouseleave", handleMouseLeave);
    });
  }

  show() {
    gsap.to(this.nav, {
      autoAlpha: 1, // handles visibility and opacity smoothly
      duration: 1,
      ease: 'power2.out'
    });
  }
}
