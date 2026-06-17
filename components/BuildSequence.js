import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class BuildSequence {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.canvas = document.getElementById('build-sequence-canvas');
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    
    // The frames are in /assets/BUILD/frames/
    // named frame_000001.webp to frame_000360.webp
    this.frameCount = 360;
    this.images = [];
    this.currentFrame = { frame: 0 };
    
    this.textConcept = document.getElementById('build-text-concept');
    this.textDesign = document.getElementById('build-text-design');
    this.textBuild = document.getElementById('build-text-build');
    
    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
    
    this.preloadImages();
  }

  preloadImages() {
    this.images = new Array(this.frameCount);
    let loadedCount = 0;
    let indexToLoad = 1;

    const loadNextBatch = () => {
      while (indexToLoad <= this.frameCount && indexToLoad <= loadedCount + 10) {
        const i = indexToLoad;
        indexToLoad++;

        const img = new Image();
        const paddedNum = i.toString().padStart(6, '0');
        img.src = `/assets/BUILD/frames/frame_${paddedNum}.webp`;
        
        img.onload = () => {
          loadedCount++;
          if (Math.round(this.currentFrame.frame) === i - 1) {
            this.render();
          }
          if (indexToLoad <= this.frameCount) loadNextBatch();
        };
        
        img.onerror = () => {
          loadedCount++;
          if (indexToLoad <= this.frameCount) loadNextBatch();
        };
        
        this.images[i - 1] = img;
      }
    };

    loadNextBatch();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.render();
  }

  render() {
    const frameIndex = Math.round(this.currentFrame.frame);
    if(!this.images[frameIndex]) return;
    const img = this.images[frameIndex];
    
    if(img.complete && img.naturalHeight !== 0) {
      const canvasRatio = this.canvas.width / this.canvas.height;
      const imgRatio = img.width / img.height;
      let drawWidth = this.canvas.width;
      let drawHeight = this.canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        drawHeight = this.canvas.width / imgRatio;
        offsetY = (this.canvas.height - drawHeight) / 2;
      } else {
        drawWidth = this.canvas.height * imgRatio;
        offsetX = (this.canvas.width - drawWidth) / 2;
      }

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }
  }

  start() {
    this.resize();
    
    // Draw first frame immediately
    if (this.images[0].complete) {
      this.render();
    } else {
      this.images[0].onload = () => this.render();
    }

    if (this.tl) {
       // Refresh and return if already initialized
       ScrollTrigger.refresh();
       return;
    }

    // Create the pinned ScrollTrigger timeline
    this.tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.container,
        start: "top top",
        end: "+=6000",
        pin: true,
        scrub: true,
        onUpdate: () => this.render()
      }
    });

    // 1. Frame Sequence Animation
    this.tl.to(this.currentFrame, {
      frame: this.frameCount - 1,
      roundProps: "frame",
      ease: "none",
      duration: 10
    }, 0);

    // 2. Subtle Zoom Effect on the canvas
    this.tl.fromTo(this.canvas, 
      { scale: 1 }, 
      { scale: 1.15, ease: "none", duration: 10 }, 
      0
    );

    // 3. Typography Animation
    // Each word: Fades in -> Moves upward slightly -> Remains visible -> Fades out
    
    // CONCEPT (frames ~0 to ~90) -> Timeline time 0 to 3.3
    this.tl.fromTo(this.textConcept, 
      { opacity: 0, y: 50 }, 
      { opacity: 0.8, y: 0, duration: 0.8, ease: "power2.out" }, 0.5);
    this.tl.to(this.textConcept, 
      { opacity: 0, y: -50, duration: 0.8, ease: "power2.in" }, 2.5);

    // DESIGN (frames ~90 to ~180) -> Timeline time 3.3 to 6.6
    this.tl.fromTo(this.textDesign, 
      { opacity: 0, y: 50 }, 
      { opacity: 0.8, y: 0, duration: 0.8, ease: "power2.out" }, 3.8);
    this.tl.to(this.textDesign, 
      { opacity: 0, y: -50, duration: 0.8, ease: "power2.in" }, 5.8);

    // BUILD (frames ~180 to ~288) -> Timeline time 6.6 to 10
    this.tl.fromTo(this.textBuild, 
      { opacity: 0, y: 50 }, 
      { opacity: 0.8, y: 0, duration: 0.8, ease: "power2.out" }, 7.2);
    // Build fades out at the very end
    this.tl.to(this.textBuild, 
      { opacity: 0, y: -50, duration: 0.8, ease: "power2.in" }, 9.2);
  }
}
