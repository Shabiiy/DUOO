import React, { useEffect, useRef, useState } from "react";
import gsap from 'gsap';

export default function ContactReact() {
  return (
    <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: '#F3F0EA', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      <CircleAnimation />
      <CharactersAnimation />
      <MessageDisplay />
    </div>
  );
}

// 1. Message Display Component
function MessageDisplay() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const items = containerRef.current.children;
      gsap.set(items, { opacity: 0, y: 30 });
      
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          gsap.to(items, 
            { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out' }
          );
          observer.disconnect();
        }
      }, { threshold: 0.2 });
      
      observer.observe(containerRef.current);
    }
  }, []);

  return (
    <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', justifyItems: 'center', alignItems: 'center', width: '90%', height: '90%', zIndex: 100 }}>
      <div 
        ref={containerRef}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          opacity: isVisible ? 1 : 0
        }}
      >
        <div style={{ fontSize: '10px', color: '#1B1B1B', letterSpacing: '6px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '3vh' }}>
          FINAL STEP
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3vh' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(40px, 6vw, 90px)', lineHeight: 0.9, color: '#F3F0EA', fontWeight: 300, margin: 0 }}>PRECISION.</h1>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(40px, 6vw, 90px)', lineHeight: 0.9, color: '#F3F0EA', fontWeight: 300, margin: 0 }}>PLANNING.</h1>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(40px, 6vw, 90px)', lineHeight: 0.9, color: '#F3F0EA', fontWeight: 300, margin: 0 }}>EXECUTION.</h1>
        </div>

        <div style={{ fontSize: '11px', color: '#1B1B1B', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4vh' }}>
          THIS IS WHAT CREATES LUXURY.
        </div>

        <div style={{ maxWidth: '550px', fontFamily: 'var(--font-serif)', fontSize: 'clamp(14px, 1.2vw, 18px)', lineHeight: 1.5, color: '#F3F0EA', fontWeight: 300, marginBottom: '4vh' }}>
          <p style={{ marginBottom: '12px' }}>At DUUO, we don't simply design interiors.</p>
          <p style={{ marginBottom: '12px' }}>We create clarity. We create accountability.</p>
          <p style={{ marginBottom: '12px' }}>We create systems that transform ideas into spaces that are delivered exactly as intended.</p>
          <p style={{ marginBottom: 0 }}>Because true luxury isn't expensive materials.<br/>It's precision, planning and execution.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <div style={{ fontSize: '9px', color: '#8B2500', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '15px' }}>
            START YOUR PROJECT
          </div>
          
          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap', justifyContent: 'center', fontSize: '12px', letterSpacing: '1px' }}>
            <a href="mailto:hello@duuo.ae" style={{ color: '#F3F0EA', textDecoration: 'none', borderBottom: '1px solid rgba(243,240,234,0.2)', paddingBottom: '4px' }}>hello@duuo.ae</a>
            <a href="tel:+971000000000" style={{ color: '#F3F0EA', textDecoration: 'none', borderBottom: '1px solid rgba(243,240,234,0.2)', paddingBottom: '4px' }}>+971 XX XXX XXXX</a>
            <a href="https://instagram.com/duuo.interiors" target="_blank" rel="noreferrer" style={{ color: '#F3F0EA', textDecoration: 'none', borderBottom: '1px solid rgba(243,240,234,0.2)', paddingBottom: '4px' }}>@duuo.interiors</a>
            <span style={{ color: '#F3F0EA', paddingBottom: '4px' }}>Dubai, UAE</span>
          </div>

          <button 
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(139,37,0,0.25)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
            style={{
              background: '#8B2500', color: '#FFFFFF', border: 'none', padding: '14px 36px', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600, borderRadius: '40px', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
            BUILD WITHOUT CHAOS
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. Characters Animation Component
function CharactersAnimation() {
  const charactersRef = useRef(null);

  useEffect(() => {
    // Define stick figures with their properties
    const stickFigures = [
      {
        top: '0%',
        src: 'https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick0.svg',
        transform: 'rotateZ(-90deg)',
        speedX: 1500,
      },
      {
        top: '10%',
        src: 'https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick1.svg',
        speedX: 3000,
        speedRotation: 2000,
      },
      {
        top: '20%',
        src: 'https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick2.svg',
        speedX: 5000,
        speedRotation: 1000,
      },
      {
        top: '25%',
        src: 'https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick0.svg',
        speedX: 2500,
        speedRotation: 1500,
      },
      {
        top: '35%',
        src: 'https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick0.svg',
        speedX: 2000,
        speedRotation: 300,
      },
      {
        bottom: '5%',
        src: 'https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick3.svg',
        speedX: 0, 
      },
    ];

    if (charactersRef.current) {
      charactersRef.current.innerHTML = '';
    }

    stickFigures.forEach((figure, index) => {
      const stick = document.createElement('img');
      stick.style.position = 'absolute';
      stick.style.width = '18%';
      stick.style.height = '18%';
      stick.style.opacity = '0.08'; // Very subtle to match luxury theme
      // Attempt to tint black SVG to DUUO Rust (#8C2803) via CSS filter
      stick.style.filter = 'invert(16%) sepia(80%) saturate(3015%) hue-rotate(352deg) brightness(91%) contrast(98%)';

      if (figure.top) stick.style.top = figure.top;
      if (figure.bottom) stick.style.bottom = figure.bottom;
      stick.src = figure.src;
      
      if (figure.transform) stick.style.transform = figure.transform;

      charactersRef.current?.appendChild(stick);

      if (index === 5) return;

      stick.animate(
        [{ left: '100%' }, { left: '-20%' }],
        { duration: figure.speedX, easing: 'linear', iterations: Infinity }
      );

      if (index === 0) return;

      if (figure.speedRotation) {
        stick.animate(
          [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-360deg)' }],
          { duration: figure.speedRotation, iterations: Infinity, easing: 'linear' }
        );
      }
    });

    return () => {
      if (charactersRef.current) {
        charactersRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div
      ref={charactersRef}
      style={{ position: 'absolute', width: '99%', height: '95%', zIndex: 10, pointerEvents: 'none' }}
    />
  );
}

// 3. Circle Animation Component
function CircleAnimation() {
  const canvasRef = useRef(null);
  const requestIdRef = useRef();
  const timerRef = useRef(0);
  const circulosRef = useRef([]);

  const initArr = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    circulosRef.current = [];
    
    for (let index = 0; index < 300; index++) {
      const randomX = Math.floor(
        Math.random() * ((canvas.width * 3) - (canvas.width * 1.2) + 1)
      ) + (canvas.width * 1.2);
      
      const randomY = Math.floor(
        Math.random() * ((canvas.height) - (canvas.height * (-0.2) + 1))
      ) + (canvas.height * (-0.2));
      
      const size = canvas.width / 1000;
      
      circulosRef.current.push({ x: randomX, y: randomY, size });
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    timerRef.current++;
    context.setTransform(1, 0, 0, 1, 0, 0);
    
    const distanceX = canvas.width / 80;
    const growthRate = canvas.width / 1000;
    
    // DUUO Rust color with opacity
    context.fillStyle = 'rgba(139, 37, 0, 0.15)';
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    circulosRef.current.forEach((circulo) => {
      context.beginPath();
      
      if (timerRef.current < 65) {
        circulo.x = circulo.x - distanceX;
        circulo.size = circulo.size + growthRate;
      }
      
      if (timerRef.current > 65 && timerRef.current < 500) {
        circulo.x = circulo.x - (distanceX * 0.02);
        circulo.size = circulo.size + (growthRate * 0.2);
      }
      
      context.arc(circulo.x, circulo.y, circulo.size, 0, 360);
      context.fill();
    });
    
    if (timerRef.current > 500) {
      timerRef.current = 0;
      initArr();
    }
    
    requestIdRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    timerRef.current = 0;
    initArr();
    draw();
    
    const handleResize = () => {
      if (!canvas) return;
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      timerRef.current = 0;
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
      
      const context = canvas.getContext('2d');
      if (context) {
        context.reset();
      }
      
      initArr();
      draw();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1, pointerEvents: 'none' }} />;
}
