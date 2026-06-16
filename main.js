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

// --- Initialize Lenis Smooth Scrolling ---
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

// Synchronize Lenis with GSAP ScrollTrigger for stable 60fps
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Lock scroll initially during intro
lenis.stop();
document.body.classList.add('intro-active');

// --- Initialize Architecture Components ---
const navbar = new Navbar();
const pixelTransition = new PixelTransition('pixel-reveal-container');
const customCursor = new CustomCursor(); // Initialize Custom Cursor
const foundersSection = new FoundersSection('founders-section');
const buildSequence = new BuildSequence('build-sequence-section');
const chaosScore = new ChaosScore('chaos-score-section');
const contactSection = new ContactSection('contact-section');

const chaosMessages = new ChaosMessages('chaos-container', () => {
  // Callback when chaos resolution has fully completed its hold state
  pixelTransition.triggerPageTransition(() => {
    // Midpoint: Screen is fully covered by pixels
    document.getElementById('scene00-section').style.display = 'none';
    foundersSection.start();
    const journeyRoot = document.getElementById('journey-react-root');
    if (journeyRoot) {
      journeyRoot.style.display = 'block';
      const root = createRoot(journeyRoot);
      root.render(React.createElement(Journey3D));
    }
    
    // Unlock scrolling
    document.body.classList.remove('intro-active');
    lenis.start();
  });
});

const introScreen = new IntroScreen(() => {
  // Reveal underlying content
  document.getElementById('main-content').classList.add('visible');
  
  const scene00Video = document.getElementById('scene00-video');
  scene00Video.play().catch(e => console.warn("Video autoplay failed:", e));
  
  // Trigger cinematic pixel reveal
  pixelTransition.trigger(() => {
    chaosMessages.start();
  });

  scene00Video.addEventListener('ended', () => {
    chaosMessages.freeze();
  });
});

// Listen for the end of the 3D Journey
window.addEventListener('journeyComplete', () => {
  if (window.buildTransitionTriggered) return;
  window.buildTransitionTriggered = true;

  // Lock scroll during transition
  lenis.stop();

  pixelTransition.triggerPageTransition(() => {
    // Hide 3D Canvas and Founders section, show Build Sequence
    document.getElementById('journey-react-root').style.display = 'none';
    const foundersSectionEl = document.getElementById('founders-section');
    if (foundersSectionEl) {
      foundersSectionEl.style.display = 'none';
    }
    const buildSection = document.getElementById('build-sequence-section');
    buildSection.style.display = 'block';
    
    const chaosScoreSection = document.getElementById('chaos-score-section');
    if (chaosScoreSection) {
      chaosScoreSection.style.display = 'block';
    }
    
    const contactSectionEl = document.getElementById('contact-section');
    if (contactSectionEl) {
      contactSectionEl.style.display = 'none'; // Keep hidden until quiz is completed
    }
    
    // Scroll to the top of the new section naturally
    window.scrollTo(0, 0);

    // Initialize the canvas animation timeline
    buildSequence.start();
    
    // Unlock scroll
    lenis.start();
  }, "Our Process");
});

// Reveal Contact Section ONLY when the Chaos Quiz is completed
window.addEventListener('quizCompleted', () => {
  const contactSectionEl = document.getElementById('contact-section');
  if (contactSectionEl) {
    contactSectionEl.style.display = 'block';
    // Mount the React component to trigger its physics and animations from scratch
    contactSection.play();
    ScrollTrigger.refresh();
  }
});

// Handle reverse transition (scrolling UP from the start of Build Sequence)
window.addEventListener('wheel', (e) => {
  if (window.buildTransitionTriggered && window.scrollY <= 0 && e.deltaY < 0 && !window.reverseTransitionTriggered) {
    window.reverseTransitionTriggered = true;
    
    lenis.stop();

    pixelTransition.triggerPageTransition(() => {
      // Hide Build Sequence and Chaos Score
      document.getElementById('build-sequence-section').style.display = 'none';
      const chaosScoreSection = document.getElementById('chaos-score-section');
      if (chaosScoreSection) {
        chaosScoreSection.style.display = 'none';
      }
      
      const contactSectionEl = document.getElementById('contact-section');
      if (contactSectionEl) {
        contactSectionEl.style.display = 'none';
      }
      
      // Show Journey3D and Founders
      document.getElementById('journey-react-root').style.display = 'block';
      const foundersSectionEl = document.getElementById('founders-section');
      if (foundersSectionEl) {
        foundersSectionEl.style.display = 'flex'; // Restore founders
      }
      
      // Force GSAP to recalculate positions now that elements are visible
      ScrollTrigger.refresh();

      // Scroll to the end of Journey3D
      const journeyST = ScrollTrigger.getById('journeyTrigger');
      if (journeyST) {
        // Calculate the target scroll position (just before the end)
        const targetScroll = journeyST.end - 10;
        
        // Use Lenis for an immediate jump
        lenis.scrollTo(targetScroll, { immediate: true });
        // Also set window scroll as a fallback
        window.scrollTo(0, targetScroll);
        
        // Force GSAP to update its triggers based on the new scroll
        ScrollTrigger.update();
        
        // If there's a scrub tween lagging behind, force it to complete
        const scrubTween = journeyST.getTween();
        if (scrubTween) {
          scrubTween.progress(1);
        }
        // Force the main animation timeline to the end (99.9% to stay within the trigger)
        if (journeyST.animation) {
          journeyST.animation.progress(0.999);
        }
      } else {
        lenis.scrollTo('bottom', { immediate: true });
        window.scrollTo(0, document.body.scrollHeight);
      }

      // Reset transition flags
      window.buildTransitionTriggered = false;
      window.reverseTransitionTriggered = false;

      lenis.start();
    });
  }
});

// --- Fake Asset Preloading (as Hero sequence is removed) ---
let loadProgress = 0;
const fakeLoader = setInterval(() => {
  loadProgress += 5;
  introScreen.updateProgress(loadProgress);
  if (loadProgress >= 100) {
    clearInterval(fakeLoader);
  }
}, 50);
