import gsap from 'gsap';

export class FoundersSection {
  constructor(sectionId) {
    this.section = document.getElementById(sectionId);
    this.fadeElements = this.section.querySelectorAll('.fs-fade');
    this.imageWrapper = this.section.querySelector('.fs-hero-image-wrapper');
    this.imageLeft = this.section.querySelector('.fs-image-left');
    this.imageRight = this.section.querySelector('.fs-image-right');

    // SVG Filter Elements
    this.displacementMap = document.getElementById('fs-disp');
    this.turbulence = document.getElementById('fs-turb');
    
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  start() {
    this.section.style.display = 'flex';
    
    const tl = gsap.timeline({ delay: 0.2 });

    // Make image wrapper visible immediately
    if (this.imageWrapper) {
      gsap.set(this.imageWrapper, { opacity: 1 });
    }

    // Slide in portrait halves
    if (this.imageLeft && this.imageRight) {
      tl.to([this.imageLeft, this.imageRight], {
        x: '0%',
        duration: 1.2,
        ease: 'power3.out'
      }, 0);
    }

    // Elegant text stagger line by line for everything else
    tl.to(this.fadeElements, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: 'power3.out'
    }, 0.2);

    window.addEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove(e) {
    if (!this.displacementMap || !this.turbulence) return;

    // Calculate mouse position relative to center [-1 to 1]
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    const distance = Math.sqrt(x * x + y * y);

    // Subtle distortion effect mapped to cursor
    const targetScale = distance * 20; 

    gsap.to(this.displacementMap, {
      attr: { scale: targetScale },
      duration: 1.5,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    gsap.to(this.turbulence, {
      attr: { baseFrequency: 0.01 + distance * 0.01 },
      duration: 1.5,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }
}
