import gsap from 'gsap';

export class IntroScreen {
  constructor(onComplete) {
    this.screen = document.getElementById('intro-screen');
    this.logo = document.getElementById('intro-logo');
    this.hint = document.querySelector('.intro-hint');
    this.onComplete = onComplete;
    this.interactionTriggered = false;

    this.tagline1 = document.querySelector('.intro-tagline-1');
    this.tagline2 = document.querySelector('.intro-tagline-2');
  }

  startAnimations() {
    gsap.fromTo([this.tagline1, this.tagline2], 
      { opacity: 0 }, 
      { opacity: 1, duration: 1.5, stagger: 0.4, ease: 'power2.out' }
    );
    this.setupInteraction();
  }

  setupInteraction() {
    // Reveal hint smoothly
    gsap.to(this.hint, { opacity: 0.5, duration: 1.5, ease: 'power2.out', delay: 1 });

    const events = ['click', 'touchstart', 'wheel', 'keydown'];
    const trigger = () => {
      if (this.interactionTriggered) return;
      this.interactionTriggered = true;
      events.forEach(e => window.removeEventListener(e, trigger));
      this.playExit();
    };

    events.forEach(e => window.addEventListener(e, trigger, { passive: true }));
  }

  playExit() {
    // Fade out hint and logo
    gsap.to([this.hint, this.logo, this.tagline1, this.tagline2], { opacity: 0, duration: 0.4, ease: 'power2.inOut' });

    // Instantly hide the intro screen wrapper to let pixels handle the actual reveal
    setTimeout(() => {
      gsap.set(this.screen, { opacity: 0, display: 'none', pointerEvents: 'none' }); 
      this.onComplete();
    }, 400);
  }

  reset() {
    this.interactionTriggered = false;
    gsap.set([this.logo, this.tagline1, this.tagline2], { opacity: 1 });
    gsap.set(this.screen, { display: 'flex', pointerEvents: 'auto' });
    gsap.to(this.screen, { opacity: 1, duration: 0.5 });
    this.setupInteraction();
  }
}
