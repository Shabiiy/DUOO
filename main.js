import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { IntroScreen } from './components/IntroScreen.js';
import { PixelTransition } from './components/PixelTransition.js';
import { Navbar } from './components/Navbar.js';
import { CustomCursor } from './components/CustomCursor.js';
import { ChaosMessages } from './components/ChaosMessages.js';
import { FoundersSection } from './components/FoundersSection.js';
import { BuildSequence } from './components/BuildSequence.js';
import { ChaosScore } from './components/ChaosScore.js';
import { ContactSection } from './components/ContactSection.js';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Journey3D from './components/Journey3D.jsx';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Lock scroll initially during intro
lenis.stop();
document.body.classList.add('intro-active');

const navbar = new Navbar();
const pixelTransition = new PixelTransition('pixel-reveal-container');
const customCursor = new CustomCursor();
const foundersSection = new FoundersSection('founders-section');
const buildSequence = new BuildSequence('build-sequence-section');
const chaosScore = new ChaosScore('chaos-score-section');
const contactSection = new ContactSection('contact-section');
let journeyReactRoot = null;

const chaosMessages = new ChaosMessages('chaos-container', () => {
  pixelTransition.triggerPageTransition(() => {
    document.getElementById('scene00-section').style.display = 'none';
    foundersSection.start();
    const journeyRootEl = document.getElementById('journey-react-root');
    if (journeyRootEl) {
      journeyRootEl.style.display = 'block';
      journeyReactRoot = createRoot(journeyRootEl);
      journeyReactRoot.render(React.createElement(Journey3D));
    }
    document.body.classList.remove('intro-active');
    lenis.start();
  });
});

const introScreen = new IntroScreen(() => {
  document.getElementById('main-content').classList.add('visible');
  const scene00Video = document.getElementById('scene00-video');
  scene00Video.play().catch(() => {});
  pixelTransition.trigger(() => {
    chaosMessages.start();
  });
  scene00Video.addEventListener('ended', () => {
    chaosMessages.freeze();
  }, { once: true });
});

window.addEventListener('journeyComplete', () => {
  if (window.buildTransitionTriggered) return;
  window.buildTransitionTriggered = true;
  lenis.stop();

  pixelTransition.triggerPageTransition(() => {
    document.getElementById('journey-react-root').style.display = 'none';
    const foundersSectionEl = document.getElementById('founders-section');
    if (foundersSectionEl) foundersSectionEl.style.display = 'none';

    document.getElementById('build-sequence-section').style.display = 'block';

    const chaosScoreSection = document.getElementById('chaos-score-section');
    if (chaosScoreSection) chaosScoreSection.style.display = 'block';

    const contactSectionEl = document.getElementById('contact-section');
    if (contactSectionEl) contactSectionEl.style.display = 'none';

    window.scrollTo(0, 0);
    buildSequence.start();
    lenis.start();
  }, 'Our Process');
});

window.addEventListener('quizCompleted', () => {
  if (window.contactUnlocked) return;
  window.contactUnlocked = true;
  const contactSectionEl = document.getElementById('contact-section');
  if (contactSectionEl) {
    contactSectionEl.style.display = 'block';
    contactSection.play();
    ScrollTrigger.refresh();
  }
}, { once: true });

const reverseHandler = (e) => {
  if (window.buildTransitionTriggered && window.scrollY <= 0 && e.deltaY < 0 && !window.reverseTransitionTriggered) {
    window.reverseTransitionTriggered = true;
    lenis.stop();

    pixelTransition.triggerPageTransition(() => {
      document.getElementById('build-sequence-section').style.display = 'none';
      const chaosScoreSection = document.getElementById('chaos-score-section');
      if (chaosScoreSection) chaosScoreSection.style.display = 'none';

      const contactSectionEl = document.getElementById('contact-section');
      if (contactSectionEl) contactSectionEl.style.display = 'none';

      document.getElementById('journey-react-root').style.display = 'block';
      const foundersSectionEl = document.getElementById('founders-section');
      if (foundersSectionEl) foundersSectionEl.style.display = 'flex';

      ScrollTrigger.refresh();

      const journeyST = ScrollTrigger.getById('journeyTrigger');
      if (journeyST) {
        const targetScroll = journeyST.end - 10;
        lenis.scrollTo(targetScroll, { immediate: true });
        window.scrollTo(0, targetScroll);
        ScrollTrigger.update();
        const scrubTween = journeyST.getTween();
        if (scrubTween) scrubTween.progress(1);
        if (journeyST.animation) journeyST.animation.progress(0.999);
      } else {
        lenis.scrollTo('bottom', { immediate: true });
        window.scrollTo(0, document.body.scrollHeight);
      }

      window.buildTransitionTriggered = false;
      window.reverseTransitionTriggered = false;
      window.contactUnlocked = false;

      lenis.start();
    });
  }
};
window.addEventListener('wheel', reverseHandler);

// --- Real Asset Preloading ---
const scene00Video = document.getElementById('scene00-video');

const loadVideo = new Promise((resolve) => {
  let isResolved = false;
  const finish = () => {
    if (isResolved) return;
    isResolved = true;
    resolve();
  };

  // Only wait for metadata (fraction of a second), not full buffering
  if (scene00Video.readyState >= 1) {
    finish();
  } else {
    scene00Video.addEventListener('loadedmetadata', finish, { once: true });
    scene00Video.addEventListener('error', finish, { once: true });
    setTimeout(finish, 1500); // 1.5s max wait for video init
  }
});

const loadWindow = new Promise((resolve) => {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    resolve();
  } else {
    document.addEventListener('DOMContentLoaded', resolve, { once: true });
  }
});

// We can also ensure fonts are loaded
const loadFonts = document.fonts ? document.fonts.ready : Promise.resolve();

let progress = 0;
const targetProgress = 100;
const increment = 10;

// Simulate progress until promises resolve
const loadingInterval = setInterval(() => {
  if (progress < 85) { // Cap artificial progress at 85%
    progress += increment;
    introScreen.updateProgress(progress);
  }
}, 150);

Promise.all([loadVideo, loadWindow, loadFonts]).then(() => {
  buildSequence.preloadImages();
  clearInterval(loadingInterval);
  // Fast forward to 100% smoothly
  const finishInterval = setInterval(() => {
    progress += 5;
    introScreen.updateProgress(progress);
    if (progress >= 100) {
      clearInterval(finishInterval);
    }
  }, 30);
});
