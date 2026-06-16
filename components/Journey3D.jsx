import React, { useLayoutEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { SoftShadows, SpotLight, MeshReflectorMaterial } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const RUST = '#8B2500';
const CREAM = '#F5F0E8';
const CHARCOAL = '#1A1A1A';
const COPPER = '#C4845B';
const WOOD = '#4A3525';

const ConceptPillar = ({ position, baseRef, objsRef }) => {
  const [lightTarget] = useState(() => new THREE.Object3D());
  return (
  <group position={position}>
    <primitive object={lightTarget} position={[0, 0, 0]} />
    <SpotLight position={[-2, 12, 3]} target={lightTarget} angle={0.5} penumbra={1} intensity={12} color="#FFDAB9" castShadow shadow-mapSize={[1024, 1024]} opacity={0.2} distance={30} anglePower={4} />
    <group ref={baseRef}>
      {/* Asymmetric intersecting blocks for a modern sculpture look */}
      <mesh castShadow receiveShadow position={[0, 1, 0]}>
        <boxGeometry args={[3, 2, 2]} />
        <meshStandardMaterial color={CREAM} roughness={0.7} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.5, 3, -0.5]}>
        <boxGeometry args={[1.5, 4, 1.5]} />
        <meshStandardMaterial color={CHARCOAL} roughness={0.4} />
      </mesh>
      {/* A slanted, angled stone slab resting against it */}
      <mesh castShadow receiveShadow position={[-0.5, 4, 0.5]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[1, 5, 1]} />
        <meshStandardMaterial color={RUST} roughness={0.6} />
      </mesh>
    </group>

    <group ref={objsRef}>
      {/* Floating Sketch Panel */}
      <mesh position={[-1.8, 5, 1.5]} rotation={[0, 0.2, -0.05]} castShadow>
        <planeGeometry args={[2, 2.5]} />
        <meshStandardMaterial color={CHARCOAL} roughness={0.8} />
      </mesh>

      {/* Material Swatches */}
      <mesh position={[1.5, 4.5, 1.5]} rotation={[0, -0.3, 0.05]} castShadow>
        <boxGeometry args={[1.5, 1.5, 0.05]} />
        <meshStandardMaterial color={WOOD} roughness={0.6} />
      </mesh>
      <mesh position={[1.2, 3.8, 1.6]} rotation={[0, -0.2, -0.1]} castShadow>
        <boxGeometry args={[1.2, 1.2, 0.05]} />
        <meshStandardMaterial color={COPPER} metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Rust Paint Stroke Simulation (Cylinder intersection) */}
      <mesh position={[0, 6, 1]} rotation={[0, 0, 0.5]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 3]} />
        <meshStandardMaterial color={CREAM} roughness={0.4} />
      </mesh>
    </group>
  </group>
  );
};

const CostPillar = ({ position, baseRef, objsRef }) => {
  const [lightTarget] = useState(() => new THREE.Object3D());
  return (
  <group position={position}>
    <primitive object={lightTarget} position={[0, 0, 0]} />
    <SpotLight position={[0, 15, 2]} target={lightTarget} angle={0.3} penumbra={0.1} intensity={15} color="#E0F7FA" castShadow shadow-mapSize={[1024, 1024]} opacity={0.2} distance={30} anglePower={4} />
    <group ref={baseRef}>
      {/* Stack of glass layers intersecting and stacking */}
      <mesh castShadow receiveShadow position={[0, 1, 0]}>
        <boxGeometry args={[2.5, 2, 2.5]} />
        <meshPhysicalMaterial color={CREAM} transparent opacity={0.3} roughness={0.1} transmission={1} thickness={2} />
      </mesh>
      <mesh castShadow position={[0, 3, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshPhysicalMaterial color={CREAM} transparent opacity={0.5} roughness={0.1} transmission={0.9} thickness={1} />
      </mesh>
      {/* Solid Dark Block */}
      <mesh castShadow position={[0, 5, 0]}>
        <boxGeometry args={[1.5, 2, 1.5]} />
        <meshStandardMaterial color={CHARCOAL} roughness={0.4} />
      </mesh>
    </group>
    
    <group ref={objsRef}>
      {/* Rust floating separators */}
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[2.8, 0.05, 2.8]} />
        <meshStandardMaterial color={RUST} />
      </mesh>
      <mesh position={[0, 4, 0]} castShadow>
        <boxGeometry args={[2.3, 0.05, 2.3]} />
        <meshStandardMaterial color={RUST} />
      </mesh>
      <mesh position={[0, 6, 0]} castShadow>
        <boxGeometry args={[1.8, 0.05, 1.8]} />
        <meshStandardMaterial color={RUST} />
      </mesh>

      {/* Floating Budget Slabs */}
      <mesh position={[-1.8, 3, 1]} rotation={[0.2, 0.3, 0]} castShadow>
        <boxGeometry args={[1, 1.5, 0.1]} />
        <meshStandardMaterial color={COPPER} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[1.8, 5, -1]} rotation={[-0.2, 0.5, 0.1]} castShadow>
        <boxGeometry args={[1.2, 0.8, 0.1]} />
        <meshPhysicalMaterial color={CREAM} transparent opacity={0.4} transmission={1} />
      </mesh>
    </group>
  </group>
  );
};

const BlueprintPillar = ({ position, baseRef, objsRef }) => {
  const [lightTarget] = useState(() => new THREE.Object3D());
  return (
  <group position={position}>
    <primitive object={lightTarget} position={[0, 0, 0]} />
    <SpotLight position={[4, 12, 4]} target={lightTarget} angle={0.6} penumbra={0} intensity={10} color="#E8E2D9" castShadow shadow-mapSize={[1024, 1024]} opacity={0.2} distance={30} anglePower={4} />
    <group ref={baseRef}>
      {/* Technical Frame (Wireframe Lattice) */}
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[2.5, 8, 2.5]} />
        <meshBasicMaterial color={RUST} wireframe={true} transparent opacity={0.3} />
      </mesh>
      {/* Core solid rod inside the frame */}
      <mesh castShadow receiveShadow position={[0, 4, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 8, 16]} />
        <meshStandardMaterial color={CHARCOAL} metalness={0.8} roughness={0.3} />
      </mesh>
    </group>

    <group ref={objsRef}>
      {/* Dimension Rods */}
      <mesh position={[1.5, 5, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 4]} />
        <meshBasicMaterial color={RUST} />
      </mesh>
      <mesh position={[1.5, 7, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.4]} />
        <meshBasicMaterial color={RUST} />
      </mesh>
      <mesh position={[1.5, 3, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.4]} />
        <meshBasicMaterial color={RUST} />
      </mesh>

      {/* Blueprint flat planes */}
      <mesh position={[-1.2, 5, 1]} rotation={[0, 0.2, 0]} castShadow>
        <planeGeometry args={[1.5, 3]} />
        <meshStandardMaterial color={WOOD} roughness={0.7} />
      </mesh>
      <mesh position={[0, 3, 1.5]} rotation={[0, 0, Math.PI/2]} castShadow>
        <planeGeometry args={[1.5, 3]} />
        <meshStandardMaterial color={CHARCOAL} roughness={0.9} />
      </mesh>
    </group>
  </group>
  );
};

const ReportingPillar = ({ position, baseRef, objsRef }) => {
  const [lightTarget] = useState(() => new THREE.Object3D());
  const sheetColors = [CREAM, CREAM, RUST, CREAM, CHARCOAL, CREAM, CREAM, COPPER, CREAM, WOOD, CREAM, CHARCOAL];
  
  return (
  <group position={position}>
    <primitive object={lightTarget} position={[0, 0, 0]} />
    <SpotLight position={[0, 10, 0]} target={lightTarget} angle={0.9} penumbra={1} intensity={10} color="#FFFFFF" castShadow shadow-mapSize={[1024, 1024]} opacity={0.2} distance={30} anglePower={4} />
    <group ref={baseRef}>
      {/* A twisting stack of colored sheets */}
      {sheetColors.map((color, i) => (
        <mesh key={i} castShadow receiveShadow position={[0, i * 0.5 + 0.25, 0]} rotation={[0, i * 0.15, 0]}>
          <boxGeometry args={[2.5, 0.1, 3.5]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      ))}
    </group>

    <group ref={objsRef}>
      {/* Progress Rings */}
      <mesh position={[0, 7, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <torusGeometry args={[2, 0.05, 16, 64, Math.PI * 1.5]} />
        <meshStandardMaterial color={RUST} />
      </mesh>
      <mesh position={[0, 7.5, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <torusGeometry args={[1.5, 0.02, 16, 64]} />
        <meshStandardMaterial color={CHARCOAL} />
      </mesh>
      
      {/* Floating Docs */}
      <mesh position={[-2, 4, 1]} rotation={[-0.2, 0.3, 0.1]} castShadow>
        <boxGeometry args={[1.5, 2, 0.05]} />
        <meshStandardMaterial color={WOOD} />
      </mesh>
      <mesh position={[2, 5, 0.5]} rotation={[0.1, -0.2, -0.1]} castShadow>
        <boxGeometry args={[1.5, 2, 0.05]} />
        <meshStandardMaterial color={COPPER} metalness={0.6} />
      </mesh>
    </group>
  </group>
  );
};

const TimelinePillar = ({ position, baseRef, objsRef }) => {
  const [lightTarget] = useState(() => new THREE.Object3D());
  return (
  <group position={position}>
    <primitive object={lightTarget} position={[0, 5, 0]} />
    <SpotLight position={[-8, 6, -2]} target={lightTarget} angle={0.2} penumbra={0.5} intensity={18} color="#FFF3E0" castShadow shadow-mapSize={[1024, 1024]} opacity={0.2} distance={30} anglePower={4} />
    <group ref={baseRef}>
      {/* Three thin staggered slabs (Charcoal, Rust, Cream) */}
      <mesh castShadow receiveShadow position={[-0.5, 4, 0]}>
        <boxGeometry args={[0.2, 8, 1.5]} />
        <meshStandardMaterial color={CHARCOAL} roughness={0.6} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 5, 0.5]}>
        <boxGeometry args={[0.2, 10, 1.5]} />
        <meshStandardMaterial color={RUST} roughness={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.5, 3, -0.5]}>
        <boxGeometry args={[0.2, 6, 1.5]} />
        <meshStandardMaterial color={CREAM} roughness={0.9} />
      </mesh>
    </group>
    
    <group ref={objsRef}>
      {/* Horizontal timeline rings */}
      <mesh position={[0, 3, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <torusGeometry args={[1.8, 0.05, 16, 64]} />
        <meshStandardMaterial color={COPPER} metalness={0.6} />
      </mesh>
      <mesh position={[0, 6, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <torusGeometry args={[2.2, 0.05, 16, 64]} />
        <meshStandardMaterial color={COPPER} metalness={0.6} />
      </mesh>
      <mesh position={[0, 9, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <torusGeometry args={[1.8, 0.05, 16, 64]} />
        <meshStandardMaterial color={COPPER} metalness={0.6} />
      </mesh>
      
      {/* Milestone Discs */}
      <mesh position={[1.8, 3, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
        <meshStandardMaterial color={CHARCOAL} />
      </mesh>
      <mesh position={[-2.2, 6, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
        <meshStandardMaterial color={CHARCOAL} />
      </mesh>
      <mesh position={[1.8, 9, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
        <meshStandardMaterial color={CHARCOAL} />
      </mesh>
    </group>
  </group>
  );
};
const Scene = ({ timeline, refs, setActivePillar }) => {
  const { camera } = useThree();
  const cameraGroup = useRef();

  useLayoutEffect(() => {
    if (!timeline.current) return;
    const tl = timeline.current;

    // Reset Pillar positions and scales
    const pillars = [
      { base: refs.p1Base, objs: refs.p1Objs, z: 0 },
      { base: refs.p2Base, objs: refs.p2Objs, z: -25 },
      { base: refs.p3Base, objs: refs.p3Objs, z: -50 },
      { base: refs.p4Base, objs: refs.p4Objs, z: -75 },
      { base: refs.p5Base, objs: refs.p5Objs, z: -100 }
    ];

    pillars.forEach(p => {
      gsap.set(p.base.current.position, { y: -20 });
      // We no longer set object scales to 0 here because tl.from() will handle the dormant states automatically
    });

    // Intro state
    gsap.set(cameraGroup.current.position, { y: 20, z: 20 });
    gsap.set(cameraGroup.current.rotation, { x: -0.15 });

    let t = 0;

    // Intro Sequence: Camera zooms downward, floor appears
    tl.to(cameraGroup.current.position, { y: 4, z: 12, duration: 2, ease: "power2.inOut" }, t);
    tl.to(cameraGroup.current.rotation, { x: 0, duration: 2, ease: "power2.inOut" }, t);
    tl.to('.intro-text', { opacity: 0, y: -100, duration: 1.5, ease: "power2.in" }, t);
    t += 2;

    pillars.forEach((p, index) => {
      // 1. APPROACH & 2. PAUSE
      // Move camera towards the pillar with an elegant ease, slowing down to a pause
      tl.to(cameraGroup.current.position, { z: p.z + 12, duration: 4, ease: "power2.inOut" }, t);
      
      // Allow camera to slow down before starting the reveal
      t += 3;

      // 3. REVEAL
      // Pillar rises slowly from the ground. No bounce, premium museum-quality movement
      tl.to(p.base.current.position, { y: 0, duration: 1.5, ease: "power2.out" }, t);
      
      // Storytelling: Floating objects unfold and organize themselves
      const objChildren = p.objs.current.children;
      if (objChildren.length > 0) {
        tl.from(objChildren.map(c => c.position), {
          y: "+=3",
          stagger: 0.1,
          duration: 2,
          ease: "power3.out"
        }, t + 0.5);

        tl.from(objChildren.map(c => c.scale), {
          x: 0, y: 0, z: 0,
          stagger: 0.1,
          duration: 2,
          ease: "power3.out"
        }, t + 0.5);
      }

      // Trigger the UI Progress Indicator update just as the objects finish revealing
      tl.call(() => {
        setActivePillar(index);
      }, undefined, t + 1);

      // Wait for pillar to finish rising before showing text
      t += 1.5;

      // TEXT APPEARANCE
      // Pillar name fades in -> Description fades upward
      tl.fromTo(`.monument-text-${index} h3`, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power3.out" }, t);
      tl.fromTo(`.monument-text-${index} p`, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, t + 0.3);
      
      // 4. DEPART
      // Let the user admire the pillar for a moment before moving on
      t += 3.5;

      // Clean up text as camera leaves (if there is a next pillar)
      if (index < pillars.length - 1) {
        tl.to(`.monument-text-${index}`, { opacity: 0, duration: 0.6, ease: "power2.inOut" }, t);
      } else {
        // For the last pillar, add a subtle camera push to create a "hold" area.
        // This gives the user time to see the fully formed 5th pillar before transitioning.
        tl.to(cameraGroup.current.position, { z: p.z + 10, duration: 3, ease: "power1.inOut" }, t);
        
        // Add a 6-second dead zone (about 1000px of scroll space) at the very end.
        // This absorbs the 1-second GSAP scrub lag and ensures the pillar is fully formed
        // and clearly visible before the ScrollTrigger hits the bottom of the page and fires onLeave.
        tl.to({}, { duration: 6 }, t + 3);
      }
    });

  }, [timeline, refs]);

  return (
    <>
      <group ref={cameraGroup} position={[0, 4, 10]}>
        <primitive object={camera} />
      </group>
      
      {/* Architectural Floor with DUUO Grid and Soft Reflections */}
      <group position={[0, 0, 0]}>
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[300, 300]} />
          <MeshReflectorMaterial 
            blur={[300, 100]}
            resolution={1024}
            mixBlur={1}
            mixStrength={15}
            roughness={0.8}
            depthScale={1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color={CREAM}
            metalness={0.1}
          />
        </mesh>
        <gridHelper args={[300, 100, RUST, RUST]} position={[0, 0.01, 0]} material-opacity={0.15} material-transparent />
      </group>

      <ConceptPillar position={[-3, 0, 0]} baseRef={refs.p1Base} objsRef={refs.p1Objs} />
      <CostPillar position={[3, 0, -25]} baseRef={refs.p2Base} objsRef={refs.p2Objs} />
      <BlueprintPillar position={[-3, 0, -50]} baseRef={refs.p3Base} objsRef={refs.p3Objs} />
      <ReportingPillar position={[3, 0, -75]} baseRef={refs.p4Base} objsRef={refs.p4Objs} />
      <TimelinePillar position={[0, 0, -100]} baseRef={refs.p5Base} objsRef={refs.p5Objs} />
    </>
  );
};

export default function Journey3D() {
  const containerRef = useRef();
  const tl = useRef(null);
  const [timelineReady, setTimelineReady] = useState(false);
  const [activePillar, setActivePillar] = useState(0);

  const pillarNames = [
    "01/05 CONCEPT", 
    "02/05 COST PLANNING", 
    "03/05 TECHNICAL DESIGN", 
    "04/05 REPORTING", 
    "05/05 TIMELINES"
  ];

  const pillarTexts = [
    {
      name: "01 — CONCEPT",
      desc: "Every project begins with intent.<br/>We transform ideas, inspirations and requirements into a clear design direction.<br/>This foundation guides every decision that follows.<br/>It ensures the project moves with purpose from day one.",
      side: "right"
    },
    {
      name: "02 — COST PLANNING",
      desc: "Luxury should never come with uncertainty.<br/>We establish realistic budgets and align expectations early.<br/>Every investment is planned before commitments are made.<br/>This creates complete financial transparency.",
      side: "left"
    },
    {
      name: "03 — TECHNICAL DESIGN",
      desc: "Beautiful spaces are built through precision.<br/>We convert concepts into detailed technical documentation.<br/>Every drawing allows teams to coordinate seamlessly.<br/>Nothing is left open to interpretation.",
      side: "right"
    },
    {
      name: "04 — REPORTING",
      desc: "Transparency is embedded into every stage.<br/>We provide structured updates and documented progress.<br/>Every stakeholder stays informed throughout the journey.<br/>Clarity replaces uncertainty.",
      side: "left"
    },
    {
      name: "05 — TIMELINES",
      desc: "Exceptional projects rely on structure.<br/>We create realistic schedules and monitor milestones.<br/>Every phase progresses with accountability and purpose.<br/>Projects move forward without unnecessary delays.",
      side: "left"
    }
  ];

  const refs = {
    p1Base: useRef(), p1Objs: useRef(),
    p2Base: useRef(), p2Objs: useRef(),
    p3Base: useRef(), p3Objs: useRef(),
    p4Base: useRef(), p4Objs: useRef(),
    p5Base: useRef(), p5Objs: useRef()
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      tl.current = gsap.timeline({
        scrollTrigger: {
          id: "journeyTrigger",
          trigger: containerRef.current,
          start: "top top",
          end: "+=15000", // Full 5-pillar cinematic length
          scrub: 1,
          pin: true,
          onLeave: () => {
            window.dispatchEvent(new CustomEvent('journeyComplete'));
          }
        }
      });
      
      setTimelineReady(true);
      
      // Ensure Lenis and GSAP recognize the newly added 12000px scroll height
      setTimeout(() => ScrollTrigger.refresh(), 100);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100vw', height: '100vh', position: 'relative', background: CREAM, overflow: 'hidden' }}>
      
      {/* Intro Huge Typography */}
      <div className="intro-text" style={{ position: 'absolute', top: '20%', width: '100%', textAlign: 'center', zIndex: 10 }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(2.5rem, 7vw, 7rem)', color: RUST, margin: 0, lineHeight: 1.1, fontWeight: 300, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Our 5 Pillars<br/>of Creation
        </h1>
      </div>

      {timelineReady && (
        <Canvas shadows camera={{ position: [0, 0, 0], fov: 45 }}>
        <color attach="background" args={[CREAM]} />
        <fog attach="fog" args={[CREAM, 10, 45]} />
        <ambientLight intensity={0.3} color={CREAM} />
        <directionalLight 
          castShadow 
          position={[10, 30, 10]} 
          intensity={0.5} 
          color={'#ffffff'}
          shadow-mapSize={[2048, 2048]}
        />
        <SoftShadows size={15} samples={10} focus={0.5} />
        
        <Scene timeline={tl} refs={refs} setActivePillar={setActivePillar} />
      </Canvas>
      )}

      {/* HTML OVERLAYS */}
      {timelineReady && (
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
        
        {/* Progress Tracker */}
        <div style={{ position: 'fixed', top: '3rem', right: '4rem', zIndex: 100 }}>
           <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', letterSpacing: '0.2em', color: RUST, textTransform: 'uppercase', margin: 0, fontWeight: 600, opacity: 0.8 }}>
              {pillarNames[activePillar]}
           </p>
        </div>
        
        {pillarTexts.map((pt, index) => (
          <div key={index} className={`monument-text-${index}`} style={{ position: 'absolute', top: '50%', [pt.side]: '10%', transform: 'translateY(-50%)', textAlign: 'left' }}>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '18px', fontWeight: 500, letterSpacing: '6px', color: '#B84020', textTransform: 'uppercase', margin: 0, opacity: 0 }}>{pt.name}</h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '22px', color: '#444444', lineHeight: 1.7, marginTop: '20px', maxWidth: '420px', opacity: 0 }} dangerouslySetInnerHTML={{ __html: pt.desc }}></p>
          </div>
        ))}

      </div>
      )}
    </div>
  );
}
