import gsap from 'gsap';

export class ChaosMessages {
  constructor(containerId, onResolved) {
    this.container = document.getElementById(containerId);
    this.onResolved = onResolved;
    
    this.messages = [
      "Contractor no-show again.", "Site inspection cancelled.", "Tiles delayed 6 weeks.", "Electrical drawings missing.", 
      "Need approval urgently.", "Budget revision issued.", "Joinery supplier unavailable.", "Client requested changes.", 
      "Material delivery delayed.", "Mechanical drawings revised.", "Structural issue discovered.", "Invoice updated.", 
      "Revised quotation attached.", "Plumbing conflict found.", "Ceiling dimensions incorrect.", "Contractor requesting variation.", 
      "Glass supplier postponed.", "Project timeline updated.", "Budget exceeded.", "Drawing package revised.", 
      "Site team awaiting approval.", "Procurement delayed.", "Installation postponed.", "Additional costs identified.", 
      "Final measurements incorrect.", "Emergency coordination meeting required.", "Municipality rejected the permit.", 
      "AC unit sizing is wrong.", "Waterproofing failed testing.", "Custom marble broke in transit.", 
      "Lighting control system incompatible.", "Fire safety inspection failed.", "Door frames arrived damaged.", 
      "Paint color doesn't match sample.", "Neighbor complained about noise.", "Power load exceeded limit."
    ];
    this.callers = ["Site Manager", "Contractor", "Supplier", "Consultant", "Procurement Team", "Client", "MEP Engineer"];
    this.timelineEvents = [
      { orig: "Week 4", new: "Week 8", desc: "Installation Delayed" },
      { orig: "Week 2", new: "Week 5", desc: "Material Delay" },
      { orig: "Day 12", new: "Day 20", desc: "Site Access Issue" },
      { orig: "Phase 1", new: "On Hold", desc: "Approval Pending" },
      { orig: "Handover", new: "TBD", desc: "Contractor Dispute" }
    ];
    this.budgetBase = 250000;
    
    this.revisions = ["REV A", "REV B", "REV C", "REV D", "REV E", "REV F (FINAL)", "REV G (ACTUAL FINAL)"];
    this.approvals = ["Awaiting Approval", "Client Approval Required", "Urgent Review Needed", "Pending Sign-Off", "Action Required"];

    this.activeElements = [];
    this.maxElements = 150; // Massively increased to handle all systems
    this.startTime = 0;
    this.isFrozen = false;
    
    this.timers = [];
  }

  start() {
    this.startTime = Date.now();
    this.loopMessages();
    this.loopCalls();
    this.loopTimelines();
    this.loopBudgets();
    this.loopRevisions();
    this.loopApprovals();
  }

  scheduleNext(type, baseDelayFunc) {
    if (this.isFrozen) return;
    const elapsed = (Date.now() - this.startTime) / 1000;
    const delay = baseDelayFunc(elapsed);
    if (delay === -1) {
      // not yet active
      this.timers.push(setTimeout(() => this.scheduleNext(type, baseDelayFunc), 500));
      return;
    }
    
    this.spawnElement(type);
    
    this.timers.push(setTimeout(() => {
      this.scheduleNext(type, baseDelayFunc);
    }, delay));
  }

  loopMessages() {
    this.scheduleNext('message', (e) => {
      if (e < 2) return gsap.utils.random(500, 900);
      if (e < 4) return gsap.utils.random(200, 400);
      if (e < 6) return gsap.utils.random(80, 150);
      return gsap.utils.random(20, 60);
    });
  }

  loopCalls() {
    this.scheduleNext('call', (e) => {
      if (e < 3) return -1; // Starts at 3s
      if (e < 6) return gsap.utils.random(1000, 2000);
      if (e < 8) return gsap.utils.random(500, 1000);
      return gsap.utils.random(100, 300);
    });
  }

  loopTimelines() {
    this.scheduleNext('timeline', (e) => {
      if (e < 2) return -1;
      if (e < 5) return gsap.utils.random(1500, 2500);
      if (e < 8) return gsap.utils.random(600, 1200);
      return gsap.utils.random(150, 400);
    });
  }

  loopBudgets() {
    this.scheduleNext('budget', (e) => {
      if (e < 4) return -1;
      if (e < 7) return gsap.utils.random(800, 1500);
      return gsap.utils.random(100, 300);
    });
  }

  loopRevisions() {
    this.scheduleNext('revision', (e) => {
      if (e < 5) return -1;
      if (e < 8) return gsap.utils.random(600, 1000);
      return gsap.utils.random(50, 150);
    });
  }

  loopApprovals() {
    this.scheduleNext('approval', (e) => {
      if (e < 6) return -1;
      if (e < 8) return gsap.utils.random(400, 800);
      return gsap.utils.random(40, 100);
    });
  }

  spawnElement(type) {
    if (this.isFrozen) return;
    
    const el = document.createElement('div');
    el.classList.add('chaos-card'); // base glassmorphism card
    
    let left = gsap.utils.random(-5, 85);
    let top = gsap.utils.random(5, 85);
    
    if (type === 'message') {
      el.classList.remove('chaos-card'); // Use original bubble styling
      el.classList.add('chaos-bubble');
      const msgText = this.messages[Math.floor(Math.random() * this.messages.length)];
      el.innerHTML = `
        <div class="ios-wa-icon">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        </div>
        <div class="ios-content">
          <div class="ios-header">
            <span class="ios-sender">WhatsApp</span>
            <span class="ios-time">now</span>
          </div>
          <div class="ios-message">${msgText}</div>
        </div>
      `;
    } 
    else if (type === 'call') {
      el.classList.add('chaos-call');
      const caller = this.callers[Math.floor(Math.random() * this.callers.length)];
      el.innerHTML = `<div class="caller">${caller} Calling...</div><div class="status">Ringing</div>`;
      
      // Vibrate animation
      const vib = gsap.to(el, {
        x: "random(-3, 3)",
        y: "random(-3, 3)",
        duration: 0.05,
        repeat: -1,
        yoyo: true
      });
      
      // Turn to missed call
      this.timers.push(setTimeout(() => {
        if (this.isFrozen) return;
        vib.kill();
        gsap.set(el, { x: 0, y: 0 });
        el.classList.add('missed');
        el.querySelector('.caller').innerText = caller;
        el.querySelector('.status').innerText = "Missed Call";
      }, gsap.utils.random(2000, 4000)));
    }
    else if (type === 'timeline') {
      el.classList.add('chaos-timeline');
      const ev = this.timelineEvents[Math.floor(Math.random() * this.timelineEvents.length)];
      el.innerHTML = `
        <div><span class="orig">${ev.orig}</span> &rarr; <span class="new">${ev.new}</span></div>
        <div class="desc">${ev.desc}</div>
      `;
    }
    else if (type === 'budget') {
      el.classList.add('chaos-budget');
      const currentVal = this.budgetBase;
      this.budgetBase += gsap.utils.random(15000, 60000);
      el.innerText = `AED ${currentVal.toLocaleString()}`;
    }
    else if (type === 'revision') {
      el.classList.add('chaos-revision');
      const rev = this.revisions[Math.floor(Math.random() * this.revisions.length)];
      el.innerHTML = `
        <div class="doc-name">Architectural Drawing Sheet</div>
        <div class="stamp">${rev}</div>
      `;
    }
    else if (type === 'approval') {
      el.classList.add('chaos-approval');
      el.innerText = this.approvals[Math.floor(Math.random() * this.approvals.length)];
    }

    el.style.left = `${left}vw`;
    el.style.top = `${top}vh`;
    
    const transformOrigins = ['bottom left', 'bottom right', 'top left', 'top right'];
    el.style.transformOrigin = transformOrigins[Math.floor(Math.random() * transformOrigins.length)];

    this.container.appendChild(el);
    this.activeElements.push(el);

    // Fade out older elements
    if (this.activeElements.length > this.maxElements) {
      const older = this.activeElements[this.activeElements.length - this.maxElements - 1];
      if (older && older.parentNode) {
        gsap.to(older, { opacity: 0.3, duration: 2, ease: "power2.out" });
      }
    }
    
    // Remove extremely old elements to prevent crash
    if (this.activeElements.length > this.maxElements + 50) {
      const veryOld = this.activeElements.shift();
      if (veryOld && veryOld.parentNode) {
        gsap.to(veryOld, { 
          opacity: 0, 
          duration: 1, 
          onComplete: () => {
            if (veryOld.parentNode) veryOld.parentNode.removeChild(veryOld);
          }
        });
      }
    }

    // Spawn Animation
    gsap.fromTo(el, 
      { opacity: 0, scale: 0.8, y: 20 },
      { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        duration: 0.8, 
        ease: "back.out(1.2)"
      }
    );
  }

  freeze() {
    this.isFrozen = true;
    this.timers.forEach(t => clearTimeout(t));
    
    const allElements = this.container.querySelectorAll('.chaos-card, .chaos-bubble');
    gsap.killTweensOf(allElements);

    // Hold frozen state briefly, then intervene
    setTimeout(() => {
      this.intervene();
    }, 2000);
  }

  intervene() {
    const duuoBubble = document.createElement('div');
    duuoBubble.classList.add('duuo-giant-bubble');
    duuoBubble.innerHTML = `
      <div class="duuo-wa-icon">
        <svg viewBox="0 0 24 24" width="55" height="55" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      </div>
      <div class="duuo-wa-content">
        <div class="duuo-wa-header">
          <span class="duuo-wa-sender">DUUO</span>
          <span class="duuo-wa-time">now</span>
        </div>
        <div class="duuo-wa-message">Without Chaos.</div>
      </div>
    `;
    this.container.appendChild(duuoBubble);

    gsap.set(duuoBubble, { left: "50%", top: "50%", xPercent: -50, yPercent: -50 });
    
    gsap.fromTo(duuoBubble, 
      { opacity: 0, yPercent: -40, scale: 0.95 },
      { 
        opacity: 1, 
        yPercent: -50, 
        scale: 1, 
        duration: 2.0, 
        ease: "power2.out", 
        onComplete: () => this.startResolution() 
      }
    );
  }

  startResolution() {
    let visible = this.activeElements.filter(el => el.parentNode);
    
    // Sort elements from top to bottom
    visible.sort((a, b) => {
      const rectA = a.getBoundingClientRect();
      const rectB = b.getBoundingClientRect();
      return rectA.top - rectB.top;
    });
    
    const keepElements = new Set();
    const seenTypes = new Set();
    
    // Shuffle visible to pick random items from different types
    const randomized = [...visible].sort(() => Math.random() - 0.5);
    
    for (const el of randomized) {
      let type = '';
      if (el.classList.contains('chaos-bubble')) type = 'message';
      else if (el.classList.contains('chaos-call')) type = 'call';
      else if (el.classList.contains('chaos-timeline')) type = 'timeline';
      else if (el.classList.contains('chaos-budget')) type = 'budget';
      else if (el.classList.contains('chaos-revision')) type = 'revision';
      else if (el.classList.contains('chaos-approval')) type = 'approval';
      
      if (type && !seenTypes.has(type)) {
        seenTypes.add(type);
        keepElements.add(el);
      }
      // Stop once we have 6 unique types framing the screen
      if (seenTypes.size >= 6) break;
    }
    
    let keptSoFar = 0;
    let completedCount = 0;

    visible.forEach((el, index) => {
      setTimeout(() => {
        const keep = keepElements.has(el);
        this.resolveElement(el, keep, keptSoFar);
        if (keep) keptSoFar++;
        
        completedCount++;
        if (completedCount === visible.length) {
          // After the final element finishes its 1.5s animation, hold briefly, then transition
          setTimeout(() => {
            if (this.onResolved) this.onResolved();
          }, 3000); 
        }
      }, index * 80); // Systematically resolve
    });
  }

  resolveElement(el, keep, slotIndex) {
    this.transformElementToPositive(el);
    
    if (keep) {
      // 6 Safe zones distributed around the screen, strictly avoiding the center (DUUO bubble)
      const zones = [
        { lMin: 5, lMax: 20, tMin: 5, tMax: 25 },   // Top Left
        { lMin: 65, lMax: 80, tMin: 5, tMax: 25 },  // Top Right
        { lMin: 5, lMax: 20, tMin: 65, tMax: 80 },  // Bottom Left
        { lMin: 65, lMax: 80, tMin: 65, tMax: 80 }, // Bottom Right
        { lMin: 2, lMax: 15, tMin: 35, tMax: 60 },  // Mid Left
        { lMin: 70, lMax: 85, tMin: 35, tMax: 60 }  // Mid Right
      ];
      
      const zone = zones[slotIndex % zones.length];
      const targetLeft = gsap.utils.random(zone.lMin, zone.lMax);
      const targetTop = gsap.utils.random(zone.tMin, zone.tMax);
      const targetRotation = gsap.utils.random(-12, 12);
      const targetScale = gsap.utils.random(0.9, 1.05);
      
      gsap.to(el, {
        left: `${targetLeft}vw`,
        top: `${targetTop}vh`,
        rotation: targetRotation,
        opacity: 1,
        scale: targetScale,
        duration: 1.5,
        ease: "power3.inOut"
      });
    } else {
      gsap.to(el, {
        opacity: 0,
        duration: 1.5,
        delay: 0.5, 
        onComplete: () => {
          if (el.parentNode) el.parentNode.removeChild(el);
        }
      });
    }
  }

  transformElementToPositive(el) {
    // Elegant flash to signify resolution
    gsap.fromTo(el, 
      { boxShadow: "0 0 30px rgba(245, 240, 232, 0.8)" },
      { boxShadow: "0 8px 32px rgba(0,0,0,0.2)", duration: 1.5 }
    );

    if (el.classList.contains('chaos-bubble')) {
      const positiveMessages = ["Site team confirmed.", "Delivery confirmed.", "Approved.", "Drawing package complete.", "Budget approved.", "Schedule aligned."];
      const newMsg = positiveMessages[Math.floor(Math.random() * positiveMessages.length)];
      const msgEl = el.querySelector('.ios-message');
      if (msgEl) {
        msgEl.innerText = newMsg;
      } else {
        el.innerText = newMsg; // fallback
      }
      el.style.borderColor = "rgba(40, 167, 69, 0.4)";
    } 
    else if (el.classList.contains('chaos-call')) {
      el.classList.remove('missed');
      el.style.borderLeftColor = "#888780"; // Calm warm gray instead of green/red
      const statusEl = el.querySelector('.status');
      if (statusEl) {
        statusEl.innerText = "Resolved";
        statusEl.style.color = "#888780";
      }
    }
    else if (el.classList.contains('chaos-timeline')) {
      el.style.borderLeftColor = "#888780";
      const newEl = el.querySelector('.new');
      if (newEl) {
        newEl.style.color = "var(--charcoal)";
        newEl.innerText = "On Track";
      }
      const origEl = el.querySelector('.orig');
      if (origEl) origEl.style.textDecoration = "none";
      const descEl = el.querySelector('.desc');
      if (descEl) descEl.innerText = "Schedule Aligned";
    }
    else if (el.classList.contains('chaos-budget')) {
      el.style.borderLeftColor = "#888780";
      el.style.color = "var(--charcoal)";
    }
    else if (el.classList.contains('chaos-revision')) {
      el.style.borderColor = "#ddd";
      const stamp = el.querySelector('.stamp');
      if (stamp) {
        stamp.innerText = "APPROVED";
        stamp.style.color = "#888780";
        stamp.style.borderColor = "#888780";
        gsap.to(stamp, { rotation: 0, duration: 0.8, ease: "power2.out" }); 
      }
    }
    else if (el.classList.contains('chaos-approval')) {
      el.style.borderColor = "transparent";
      el.style.backgroundColor = "rgba(245, 240, 232, 0.95)";
      el.style.color = "var(--charcoal)";
      el.innerText = "Signed Off";
    }
  }
}
