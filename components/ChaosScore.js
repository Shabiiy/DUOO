import gsap from 'gsap';
import * as THREE from 'three';

export class ChaosScore {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.wrapper = this.container.querySelector('#cs-container');
    
    // Ensure wrapper is above background
    this.wrapper.style.zIndex = '10';

    this.injectSVGFilter();
    this.initWebGLBackground();

    this.questions = [
      { question: "Do you already have a clear design vision?", options: [ { text: "Yes", points: 0, icon: 'ring' }, { text: "Partially", points: 1, icon: 'half' }, { text: "No", points: 2, icon: 'solid' } ] },
      { question: "Do you have a defined budget?", options: [ { text: "Yes", points: 0, icon: 'ring' }, { text: "Rough estimate", points: 1, icon: 'half' }, { text: "No", points: 2, icon: 'solid' } ] },
      { question: "Are technical drawings completed?", options: [ { text: "Yes", points: 0, icon: 'ring' }, { text: "Partially", points: 1, icon: 'half' }, { text: "No", points: 2, icon: 'solid' } ] },
      { question: "How often do you receive project updates?", options: [ { text: "Weekly", points: 0, icon: 'ring' }, { text: "Sometimes", points: 1, icon: 'half' }, { text: "Rarely", points: 2, icon: 'half' }, { text: "Never", points: 3, icon: 'solid' } ] },
      { question: "Do you have a realistic timeline?", options: [ { text: "Yes", points: 0, icon: 'ring' }, { text: "Not sure", points: 1, icon: 'half' }, { text: "No", points: 2, icon: 'solid' } ] }
    ];

    this.currentStep = 0;
    this.totalPoints = 0;
    this.maxPoints = 11;

    // Start directly with the first question so the user can answer immediately
    this.renderQuestion();
  }

  initWebGLBackground() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    this.container.insertBefore(canvas, this.wrapper);

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(new THREE.Color(0xf5f0e8), 1); // Cream background

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);

    const uniforms = {
      resolution: { value: [window.innerWidth, window.innerHeight] },
      time: { value: 0.0 },
      xScale: { value: 1.0 },
      yScale: { value: 0.5 },
      distortion: { value: 0.05 },
    };

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
        
        float d = length(p) * distortion;
        
        float rx = p.x * (1.0 + d);
        float gx = p.x;
        float bx = p.x * (1.0 - d);

        float lineR = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
        float lineG = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
        float lineB = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);
        
        // Default glowing line colors
        vec3 defaultColor = vec3(lineR, lineG, lineB);
        
        // Calculate intensity based on the maximum color channel
        float intensity = clamp(max(lineR, max(lineG, lineB)), 0.0, 1.0);
        
        // Cream background: rgb(245, 240, 232) -> vec3(0.960, 0.941, 0.909)
        vec3 bg = vec3(0.960, 0.941, 0.909);
        
        // Enhance lines
        intensity = smoothstep(0.1, 0.8, intensity);

        // Blend the cream background with the default multi-colored lines
        vec3 color = mix(bg, clamp(defaultColor, 0.0, 1.0), intensity);
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const position = [
      -1.0, -1.0, 0.0,
       1.0, -1.0, 0.0,
      -1.0,  1.0, 0.0,
       1.0, -1.0, 0.0,
      -1.0,  1.0, 0.0,
       1.0,  1.0, 0.0,
    ];

    const positions = new THREE.BufferAttribute(new Float32Array(position), 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", positions);

    const material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: uniforms,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = () => {
      uniforms.time.value += 0.01;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height, false);
      uniforms.resolution.value = [width, height];
    };

    handleResize();
    animate();
    window.addEventListener("resize", handleResize);
  }

  injectSVGFilter() {
    const svgHTML = `
      <svg style="display: none;">
        <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
          <feTurbulence type="fractalNoise" baseFrequency="0.001 0.005" numOctaves="1" seed="17" result="turbulence" />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
          <feSpecularLighting in="softMap" surfaceScale="5" specularConstant="1" specularExponent="100" lightingColor="white" result="specLight">
            <fePointLight x="-200" y="-200" z="300" />
          </feSpecularLighting>
          <feComposite in="specLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litImage" />
          <feDisplacementMap in="SourceGraphic" in2="softMap" scale="200" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    `;
    this.container.insertAdjacentHTML('afterbegin', svgHTML);
  }

  wrapInEditorialBox(content) {
    return `
      <div class="cs-editorial-panel" style="
        position: relative; 
        width: 90vw; 
        max-width: 800px; 
        min-height: 380px; 
        background: rgba(255,255,255,0.45);
        border: 1px solid rgba(139,37,0,0.18);
        border-radius: 20px; 
        box-shadow: 0 15px 40px rgba(0,0,0,0.05);
        padding: 40px 30px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      ">
        ${content}
      </div>
    `;
  }

  nextStep(selectedPoints) {
    this.totalPoints += selectedPoints;
    
    const animator = this.wrapper.querySelector('.cs-question-animator');
    if (animator) {
      gsap.to(animator, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          this.currentStep++;
          if (this.currentStep < this.questions.length) {
            this.renderQuestion();
          } else {
            this.renderResult();
          }
        }
      });
    }
  }

  renderQuestion() {
    const q = this.questions[this.currentStep];
    
    let optionsHtml = q.options.map((opt, index) => {
      let iconSvg = '';
      if (opt.icon === 'ring') {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events: none; flex-shrink: 0;"><circle cx="14" cy="14" r="13" stroke="#8C2803" stroke-width="2"/></svg>`;
      } else if (opt.icon === 'half') {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events: none; flex-shrink: 0;"><circle cx="14" cy="14" r="13" stroke="#8C2803" stroke-width="2"/><path d="M 14 1 A 13 13 0 0 0 14 27 Z" fill="#8C2803"/></svg>`;
      } else if (opt.icon === 'solid') {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events: none; flex-shrink: 0;"><circle cx="14" cy="14" r="14" fill="#8C2803"/></svg>`;
      }

      return `
      <button class="cs-option-btn" data-points="${opt.points}" style="
        display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
        width: 150px; height: 80px; flex-shrink: 1;
        background: #F7F5F1; border: 1px solid rgba(139,37,0,0.25); 
        cursor: pointer; border-radius: 12px; position: relative; overflow: hidden;
        transition: all 0.3s ease; font-family: var(--font-sans);
      ">
        ${iconSvg}
        <span style="position: relative; z-index: 2; pointer-events: none; color: #8C2803; text-transform: uppercase; font-weight: 700; letter-spacing: 0.1em; font-size: 10px;">${opt.text}</span>
      </button>
      `;
    }).join('');

    let progressHtml = `<div style="display: flex; gap: 10px; margin-bottom: 24px; align-items: center;">`;
    for (let i = 0; i < this.questions.length; i++) {
      if (i === this.currentStep) {
        progressHtml += `<div style="width: 5px; height: 5px; border-radius: 50%; background: #8C2803;"></div>`;
      } else if (i < this.currentStep) {
        progressHtml += `<div style="width: 24px; height: 2px; background: #8C2803;"></div>`;
      } else {
        progressHtml += `<div style="width: 5px; height: 5px; border-radius: 50%; background: rgba(139,37,0,0.15);"></div>`;
      }
    }
    progressHtml += `</div>`;

    const innerContent = `
      <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 24px; width: 100%;">
        
        <!-- Left Spacer for Perfect Centering -->
        <div style="flex: 1;"></div>

        <!-- Inner Question Card -->
        <div style="
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(139,37,0,0.18);
          border-radius: 16px;
          padding: 24px;
          width: 540px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0 30px;
        ">
          <div style="font-size: 10px; color: #8C2803; letter-spacing: 3px; text-transform: uppercase; font-weight: 600; margin-bottom: 16px;">QUESTION ${this.currentStep + 1} OF ${this.questions.length}</div>
          <h3 style="font-family: var(--font-serif); font-size: clamp(20px, 3vw, 24px); color: #1B1B1B; font-weight: 300; margin-bottom: 30px; text-align: center; max-width: 95%; line-height: 1.2;">${q.question}</h3>
          
          <div class="cs-options" style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; width: 100%;">
            ${optionsHtml}
          </div>
        </div>

        <!-- Sidebar Info -->
        <div style="flex: 1; display: flex; flex-direction: column; align-items: flex-start; min-width: 120px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8C2803" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 8px;">
            <line x1="12" y1="2" x2="12" y2="22"></line>
            <line x1="4.93" y1="7.07" x2="19.07" y2="16.93"></line>
            <line x1="19.07" y1="7.07" x2="4.93" y2="16.93"></line>
          </svg>
          <div style="font-size: 9px; color: #8C2803; letter-spacing: 2px; text-transform: uppercase; font-weight: 700; margin-bottom: 6px;">5 QUESTIONS</div>
          <div style="font-family: var(--font-serif); font-size: 12px; color: #1B1B1B; line-height: 1.4;">Takes less than<br>2 minutes.</div>
        </div>
      </div>

      ${progressHtml}

      <button class="cs-next-btn" style="
        background: #8C2803;
        color: #FFFFFF;
        border: none;
        border-radius: 30px;
        padding: 12px 36px;
        font-size: 10px;
        letter-spacing: 2px;
        text-transform: uppercase;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: all 0.3s ease;
        opacity: 0.4;
      ">
        NEXT QUESTION <span style="font-size: 13px; line-height: 1;">&rarr;</span>
      </button>
    `;

    if (this.currentStep === 0) {
      const fullHtml = `
        <div class="cs-main-panel" style="
          position: relative;
          width: 90vw;
          max-width: 900px;
          background: rgba(250, 248, 245, 0.7);
          border: 1px solid rgba(139,37,0,0.05);
          border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.05);
          padding: 40px 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          backdrop-filter: blur(10px);
        ">
          <div style="font-size: 10px; color: #8C2803; letter-spacing: 3px; text-transform: uppercase; font-weight: 600; margin-bottom: 12px;">THE DUUO CHAOS INDEX</div>
          <h2 style="font-family: var(--font-serif); font-size: clamp(28px, 4vw, 42px); color: #1B1B1B; font-weight: 300; text-transform: uppercase; margin-bottom: 12px; text-align: center; line-height: 1.1;">HOW MUCH CHAOS IS<br>IN YOUR PROJECT?</h2>
          <div style="font-size: 10px; color: #8C2803; letter-spacing: 2px; text-transform: uppercase; font-weight: 600; margin-bottom: 24px; text-align: center; line-height: 1.6;">ANSWER A FEW QUESTIONS AND DISCOVER<br>YOUR PROJECT'S CHAOS SCORE.</div>

          <div class="cs-question-animator" style="display: flex; flex-direction: column; align-items: center; width: 100%;">
            ${innerContent}
          </div>
        </div>
      `;
      this.wrapper.innerHTML = fullHtml;
      gsap.fromTo(this.wrapper.children[0], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
    } else {
      const animator = this.wrapper.querySelector('.cs-question-animator');
      animator.innerHTML = innerContent;
      gsap.fromTo(animator, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
    }

    this.bindEvents();
  }

  bindEvents() {
    let selectedPoints = null;
    const btns = this.wrapper.querySelectorAll('.cs-option-btn');
    const nextBtn = this.wrapper.querySelector('.cs-next-btn');

    btns.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        if (selectedPoints === null || parseInt(btn.getAttribute('data-points')) !== selectedPoints) {
          btn.style.transform = 'scale(1.03)';
        }
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
      });
      
      btn.addEventListener('click', (e) => {
        // Deselect all
        btns.forEach(b => {
          b.style.borderColor = 'rgba(139,37,0,0.25)';
          b.style.background = '#F7F5F1';
          b.style.boxShadow = 'none';
          b.querySelector('span').style.color = '#8C2803';
          
          // Revert SVGs to #8C2803
          const paths = b.querySelectorAll('path, circle, line');
          paths.forEach(p => {
            if (p.hasAttribute('fill') && p.getAttribute('fill') !== 'none') p.setAttribute('fill', '#8C2803');
            if (p.hasAttribute('stroke')) p.setAttribute('stroke', '#8C2803');
          });
        });
        
        // Select current
        btn.style.borderColor = '#8C2803';
        btn.style.background = '#8C2803';
        btn.style.boxShadow = '0 10px 26px rgba(140,40,3,0.16)';
        btn.querySelector('span').style.color = '#FFFFFF';
        
        // Change SVG to #FFFFFF
        const paths = btn.querySelectorAll('path, circle, line');
        paths.forEach(p => {
          if (p.hasAttribute('fill') && p.getAttribute('fill') !== 'none') p.setAttribute('fill', '#FFFFFF');
          if (p.hasAttribute('stroke')) p.setAttribute('stroke', '#FFFFFF');
        });
        
        selectedPoints = parseInt(e.currentTarget.getAttribute('data-points'));
        
        // Enable next button visually
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
      });
    });

    nextBtn.addEventListener('click', () => {
      if (selectedPoints !== null) {
        // Prevent double clicks
        nextBtn.style.pointerEvents = 'none';
        this.nextStep(selectedPoints);
      } else {
        // Shake animation if no option selected
        gsap.fromTo(nextBtn, { x: -5 }, { x: 5, duration: 0.05, yoyo: true, repeat: 5, onComplete: () => gsap.set(nextBtn, { x: 0 }) });
      }
    });
  }

  renderResult() {
    let scorePercentage = Math.round((this.totalPoints / this.maxPoints) * 100);
    
    let message = "";
    if (scorePercentage <= 25) message = "Your project is highly organized.";
    else if (scorePercentage <= 50) message = "There are areas that need more structure.";
    else if (scorePercentage <= 75) message = "Your project is vulnerable to chaos.";
    else message = "Your project needs immediate structure and accountability.";

    const content = `
      <div style="display: flex; flex-direction: column; align-items: center; width: 100%; text-align: center;">
        <div style="font-size: 11px; color: #8C2803; letter-spacing: 3px; text-transform: uppercase; font-weight: 600; margin-bottom: 40px;">DIAGNOSTIC COMPLETE</div>
        
        <!-- Score Wheel -->
        <div style="position: relative; width: 200px; height: 200px; margin-bottom: 30px;">
          <svg viewBox="0 0 200 200" style="width: 100%; height: 100%; transform: rotate(-90deg);">
            <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(139,37,0,0.1)" stroke-width="4" />
            <circle class="cs-meter-fill" cx="100" cy="100" r="90" fill="none" stroke="#8C2803" stroke-width="8" stroke-dasharray="565.48" stroke-dashoffset="565.48" stroke-linecap="round" />
          </svg>
          <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div style="font-size: 9px; letter-spacing: 2px; color: #8C2803; margin-bottom: 4px; text-transform: uppercase; font-weight: 700;">CHAOS SCORE</div>
            <div style="display: flex; align-items: baseline;">
              <span id="cs-score-number" style="font-family: var(--font-serif); font-size: 56px; color: #1B1B1B; line-height: 1; font-weight: 300;">0</span>
              <span style="font-family: var(--font-serif); font-size: 28px; color: #8C2803;">%</span>
            </div>
          </div>
        </div>
        
        <h3 style="font-family: var(--font-serif); font-size: clamp(24px, 4vw, 32px); color: #1B1B1B; font-weight: 300; margin-bottom: 12px; line-height: 1.3; max-width: 500px;">
          ${message}
        </h3>
        <div style="font-size: 10px; color: #8C2803; margin-bottom: 32px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">
          Ready to build without chaos?
        </div>
        
        <button class="cs-book-btn" style="
          background: #8C2803; 
          color: #FFFFFF; 
          border: none; 
          padding: 14px 44px; 
          font-size: 11px; 
          letter-spacing: 2px; 
          text-transform: uppercase; 
          font-weight: 600; 
          cursor: pointer; 
          border-radius: 30px; 
          transition: all 0.3s ease;
        ">
          CONTACT US
        </button>
      </div>
    `;

    this.wrapper.innerHTML = this.wrapInEditorialBox(content);

    const bookBtn = this.wrapper.querySelector('.cs-book-btn');
    bookBtn.addEventListener('mouseenter', () => {
      bookBtn.style.transform = 'scale(1.03)';
    });
    bookBtn.addEventListener('mouseleave', () => {
      bookBtn.style.transform = 'scale(1)';
    });
    bookBtn.addEventListener('click', () => window.location.href = 'mailto:contact@duuointeriors.com');

    // Animate content in
    gsap.fromTo(this.wrapper.children[0], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });

    // Animate Meter and Score
    const meter = this.wrapper.querySelector('.cs-meter-fill');
    const scoreNum = this.wrapper.querySelector('#cs-score-number');
    
    const circumference = 2 * Math.PI * 90;
    const targetOffset = circumference - (scorePercentage / 100) * circumference;

    const scoreObj = { val: 0 };
    gsap.to(scoreObj, {
      val: scorePercentage,
      duration: 3,
      ease: "power3.out",
      delay: 0.8,
      onUpdate: () => {
        scoreNum.textContent = Math.round(scoreObj.val);
      }
    });

    gsap.to(meter, {
      strokeDashoffset: targetOffset,
      duration: 3,
      ease: "power3.out",
      delay: 0.8,
      onComplete: () => {
        window.dispatchEvent(new CustomEvent('quizCompleted'));
      }
    });
  }
}
