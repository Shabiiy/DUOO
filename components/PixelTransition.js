import gsap from 'gsap';

export class PixelTransition {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.pixels = [];
  }

  createPixels(opacityStart) {
    this.container.innerHTML = ''; // clear existing
    this.pixels = [];
    const baseSize = Math.max(window.innerWidth, window.innerHeight) > 1000 ? 50 : 35;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const cols = Math.ceil(w / baseSize);
    const rows = Math.ceil(h / baseSize);
    
    this.container.style.display = 'grid';
    this.container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    this.container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    this.container.style.gridAutoFlow = 'dense';
    
    const fragment = document.createDocumentFragment();
    const totalArea = cols * rows;
    let currentArea = 0;
    
    const shades = ['#8B2500', '#822200', '#942700', '#852300'];
    
    while(currentArea < totalArea) {
      const pixel = document.createElement('div');
      pixel.classList.add('pixel');
      pixel.style.position = 'relative'; 
      
      const isLarge = Math.random() > 0.85;
      if (isLarge && currentArea + 4 <= totalArea) {
        pixel.style.gridColumn = 'span 2';
        pixel.style.gridRow = 'span 2';
        currentArea += 4;
      } else {
        currentArea += 1;
      }
      
      pixel.style.backgroundColor = shades[Math.floor(Math.random() * shades.length)];
      fragment.appendChild(pixel);
      this.pixels.push(pixel);
    }
    
    this.container.appendChild(fragment);
    this.pixels.forEach(p => gsap.set(p, { opacity: opacityStart, scale: 1.05 }));
  }

  // Original Intro Outward Disperse (Full -> Empty)
  trigger(onComplete) {
    this.createPixels(1);
    
    const tl = gsap.timeline({
      onComplete: () => {
        this.container.style.display = 'none';
        if(onComplete) onComplete();
      }
    });
    
    tl.to(this.pixels, {
      opacity: 0,
      scale: 0.1,
      rotation: () => gsap.utils.random(-45, 45),
      x: () => gsap.utils.random(-150, 150),
      y: () => gsap.utils.random(-150, 150),
      duration: 1.4,
      stagger: {
        amount: 0.8,
        from: "center",
        grid: "auto",
        ease: "power2.inOut"
      },
      ease: 'power3.inOut'
    });
  }

  // Page Transition: Empty -> Full -> Empty
  triggerPageTransition(onMidpoint, overlayText = null) {
    this.createPixels(0);
    this.container.style.display = 'grid';

    let textEl = null;
    if (overlayText) {
      textEl = document.createElement('div');
      textEl.textContent = overlayText;
      textEl.style.position = 'absolute';
      textEl.style.top = '50%';
      textEl.style.left = '50%';
      textEl.style.transform = 'translate(-50%, -50%)';
      textEl.style.color = 'var(--cream)';
      textEl.style.fontFamily = "'Great Vibes', cursive";
      textEl.style.fontSize = 'clamp(4rem, 10vw, 8rem)';
      textEl.style.fontWeight = '400';
      textEl.style.zIndex = '100';
      textEl.style.opacity = '0';
      textEl.style.pointerEvents = 'none';
      textEl.style.textAlign = 'center';
      textEl.style.textShadow = '0 4px 15px rgba(0,0,0,0.2)';
      this.container.appendChild(textEl);
    }

    // Disperse IN
    gsap.fromTo(this.pixels, 
      { opacity: 0, scale: 0.1, rotation: () => gsap.utils.random(-45, 45), x: () => gsap.utils.random(-150, 150), y: () => gsap.utils.random(-150, 150) },
      { opacity: 1, scale: 1.05, rotation: 0, x: 0, y: 0, duration: 1.0, 
        stagger: { amount: 0.5, from: "random", ease: "power2.inOut" }, ease: 'power3.out',
        onComplete: () => {
          if (onMidpoint) onMidpoint();
          
          // Disperse OUT
          gsap.to(this.pixels, {
            opacity: 0, scale: 0.1, rotation: () => gsap.utils.random(-45, 45), x: () => gsap.utils.random(-150, 150), y: () => gsap.utils.random(-150, 150),
            duration: 1.0, delay: 0.4, // slightly longer delay so text is readable
            stagger: { amount: 0.5, from: "center", ease: "power2.inOut" }, ease: 'power3.in',
            onComplete: () => {
              this.container.style.display = 'none';
              if (textEl) textEl.remove();
            }
          });

          // Text Fade OUT
          if (textEl) {
            gsap.to(textEl, { opacity: 0, y: -20, duration: 0.8, delay: 0.2, ease: "power2.in" });
          }
        }
      }
    );

    // Text Fade IN
    if (textEl) {
      gsap.to(textEl, { opacity: 1, y: 0, duration: 1.0, delay: 0.5, ease: "power2.out" });
      gsap.from(textEl, { y: 20, duration: 1.0, delay: 0.5, ease: "power2.out" });
    }
  }

  // Reverse Intro: Empty -> Full
  triggerReverse(onComplete) {
    this.createPixels(0);
    this.container.style.display = 'grid';

    gsap.fromTo(this.pixels, 
      { opacity: 0, scale: 0.1, rotation: () => gsap.utils.random(-45, 45), x: () => gsap.utils.random(-150, 150), y: () => gsap.utils.random(-150, 150) },
      { opacity: 1, scale: 1.05, rotation: 0, x: 0, y: 0, duration: 1.4, 
        stagger: { amount: 0.8, from: "center", ease: "power2.inOut" }, ease: 'power3.out',
        onComplete: () => {
          if (onComplete) onComplete();
        }
      }
    );
  }
}
