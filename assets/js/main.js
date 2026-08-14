/* ============================================================
   DJ DESAI PORTFOLIO — MAIN.JS
   Three.js · GSAP · IntersectionObserver · Typewriter
   ============================================================ */

/* ── Loader ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    initHeroAnimations();
  }, 1400);
});

/* ── Hero GSAP Animations ── */
function initHeroAnimations() {
  const els = document.querySelectorAll('.hero-text .fade-up');
  gsap.to(els, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    stagger: 0.14,
    ease: 'power3.out'
  });
}

/* ── Navbar scroll effect ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

/* ── Hamburger menu ── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── Typewriter Effect ── */
const roles = [
  'full-stack applications.',
  'intelligent AI agents.',
  '.NET & cloud systems.',
  'real-time web apps.',
  'scalable backends.',
];
let roleIndex = 0, charIndex = 0, isDeleting = false;
const typeEl = document.getElementById('typewriter');

function typeWriter() {
  const current = roles[roleIndex];
  if (isDeleting) {
    typeEl.textContent = current.slice(0, --charIndex);
  } else {
    typeEl.textContent = current.slice(0, ++charIndex);
  }
  let delay = isDeleting ? 45 : 90;
  if (!isDeleting && charIndex === current.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 400;
  }
  setTimeout(typeWriter, delay);
}
setTimeout(typeWriter, 2000);

/* ── IntersectionObserver for Reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-item').forEach(el => {
  revealObserver.observe(el);
});

/* ── Skill Bars ── */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillBarsSection = document.querySelector('.skill-bars-section');
if (skillBarsSection) barObserver.observe(skillBarsSection);

/* ── 3D Tilt Cards (CSS perspective) ── */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rx = (-y / rect.height) * 12;
    const ry = (x / rect.width) * 12;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
  });
});

/* ── Terminal Code Animation ── */
const terminalEl = document.getElementById('terminalCode');
const codeLines = [
  '<span style="color:#c678dd">import</span> <span style="color:#e06c75">anthropic</span>',
  '<span style="color:#c678dd">from</span> <span style="color:#e06c75">langchain.agents</span> <span style="color:#c678dd">import</span> AgentExecutor',
  '',
  '<span style="color:#61afef">client</span> = anthropic.Anthropic()',
  '',
  '<span style="color:#5c6370"># Score job for H1B + interview fit</span>',
  '<span style="color:#61afef">def</span> <span style="color:#e5c07b">score_job</span>(job_description):',
  '  response = client.messages.create(',
  '    model=<span style="color:#98c379">"claude-sonnet-4-6"</span>,',
  '    max_tokens=<span style="color:#d19a66">512</span>,',
  '    messages=[{<span style="color:#98c379">"role"</span>: <span style="color:#98c379">"user"</span>,',
  '      <span style="color:#98c379">"content"</span>: f<span style="color:#98c379">"Score this job: {job_description}"</span>}]',
  '  )',
  '  <span style="color:#c678dd">return</span> response.content[<span style="color:#d19a66">0</span>].text',
  '',
  '<span style="color:#5c6370"># Autonomous job hunting loop</span>',
  '<span style="color:#61afef">agent</span> = AgentExecutor(tools=[',
  '  find_jobs, score_fit,',
  '  tailor_resume, apply_job',
  '])',
];

let lineIdx = 0;
function revealTerminal(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && lineIdx === 0) {
      animateTerminal();
      terminalObs.unobserve(entry.target);
    }
  });
}

function animateTerminal() {
  if (lineIdx >= codeLines.length) return;
  terminalEl.innerHTML += codeLines[lineIdx] + '\n';
  lineIdx++;
  terminalEl.scrollTop = terminalEl.scrollHeight;
  setTimeout(animateTerminal, lineIdx <= 2 ? 120 : 90);
}

const terminalObs = new IntersectionObserver(revealTerminal, { threshold: 0.4 });
const aiSection = document.getElementById('ai');
if (aiSection) terminalObs.observe(aiSection);

/* ============================================================
   THREE.JS HERO CANVAS — Particle Network + 3D Shape
   ============================================================ */
(function initThreeHero() {
  if (typeof THREE === 'undefined') return;

  const canvas = document.getElementById('heroCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  /* ── Particle Network ── */
  const PARTICLE_COUNT = window.innerWidth < 768 ? 60 : 120;
  const positions = [];
  const velocities = [];
  const particleGeo = new THREE.BufferGeometry();
  const posArr = new Float32Array(PARTICLE_COUNT * 3);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const x = (Math.random() - 0.5) * 20;
    const y = (Math.random() - 0.5) * 12;
    const z = (Math.random() - 0.5) * 8;
    positions.push(new THREE.Vector3(x, y, z));
    velocities.push(new THREE.Vector3(
      (Math.random() - 0.5) * 0.012,
      (Math.random() - 0.5) * 0.008,
      0
    ));
    posArr[i * 3] = x;
    posArr[i * 3 + 1] = y;
    posArr[i * 3 + 2] = z;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x6c63ff,
    size: 0.04,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  /* ── Connection Lines (pre-allocated buffer — no per-frame GPU allocs) ── */
  const MAX_LINES = Math.floor(PARTICLE_COUNT * (PARTICLE_COUNT - 1) / 2);
  const linePositions = new Float32Array(MAX_LINES * 6);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  const lineMat = new THREE.LineBasicMaterial({ color: 0x6c63ff, transparent: true, opacity: 0.13 });
  const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lineSegments);

  function updateLines() {
    let idx = 0;
    const CONNECT_DIST = 3.2;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        if (idx >= MAX_LINES) break;
        const dist = positions[i].distanceTo(positions[j]);
        if (dist < CONNECT_DIST) {
          linePositions[idx * 6]     = positions[i].x;
          linePositions[idx * 6 + 1] = positions[i].y;
          linePositions[idx * 6 + 2] = positions[i].z;
          linePositions[idx * 6 + 3] = positions[j].x;
          linePositions[idx * 6 + 4] = positions[j].y;
          linePositions[idx * 6 + 5] = positions[j].z;
          idx++;
        }
      }
    }
    lineGeo.setDrawRange(0, idx * 2);
    lineGeo.attributes.position.needsUpdate = true;
  }

  /* ── 3D Icosahedron ── */
  const isMobile = window.innerWidth < 768;
  const icoX = isMobile ? 0 : 3.5;
  const icoScale = isMobile ? 0.65 : 1;

  const icoGeo = new THREE.IcosahedronGeometry(1.5, 1);
  const icoMat = new THREE.MeshBasicMaterial({
    color: 0x00d4ff,
    wireframe: true,
    transparent: true,
    opacity: isMobile ? 0.35 : 0.18,
  });
  const icosahedron = new THREE.Mesh(icoGeo, icoMat);
  icosahedron.position.set(icoX, isMobile ? 1.5 : 0, -1);
  icosahedron.scale.setScalar(icoScale);

  const innerGeo = new THREE.IcosahedronGeometry(1.0, 0);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0x6c63ff,
    wireframe: true,
    transparent: true,
    opacity: isMobile ? 0.22 : 0.1,
  });
  const innerIco = new THREE.Mesh(innerGeo, innerMat);
  innerIco.position.set(icoX, isMobile ? 1.5 : 0, -1);
  innerIco.scale.setScalar(icoScale);

  const torusGeo = new THREE.TorusGeometry(2.2, 0.015, 8, 60);
  const torusMat = new THREE.MeshBasicMaterial({
    color: 0x6c63ff,
    transparent: true,
    opacity: isMobile ? 0.22 : 0.12,
  });
  const torus = new THREE.Mesh(torusGeo, torusMat);
  torus.position.set(icoX, isMobile ? 1.5 : 0, -1);
  torus.scale.setScalar(icoScale);
  torus.rotation.x = Math.PI / 5;

  scene.add(icosahedron, innerIco, torus);

  /* ── Mouse + Scroll Parallax ── */
  let mouseX = 0, mouseY = 0, scrollProgress = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });
  window.addEventListener('scroll', () => {
    scrollProgress = Math.min(window.scrollY / window.innerHeight, 1);
    const fade = 1 - scrollProgress * 0.85;
    icoMat.opacity   = 0.18 * fade;
    innerMat.opacity = 0.10 * fade;
    torusMat.opacity = 0.12 * fade;
  }, { passive: true });

  /* ── WebGL context loss guard ── */
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); }, false);
  canvas.addEventListener('webglcontextrestored', () => { animate(); }, false);

  /* ── Pause when tab hidden ── */
  let running = true;
  document.addEventListener('visibilitychange', () => { running = !document.hidden; });

  /* ── Animate ── */
  let frameCount = 0;
  function animate() {
    if (!running) { requestAnimationFrame(animate); return; }
    requestAnimationFrame(animate);
    frameCount++;

    /* Move particles */
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i].add(velocities[i]);
      if (positions[i].x > 10 || positions[i].x < -10) velocities[i].x *= -1;
      if (positions[i].y > 6 || positions[i].y < -6) velocities[i].y *= -1;
      posArr[i * 3] = positions[i].x;
      posArr[i * 3 + 1] = positions[i].y;
      posArr[i * 3 + 2] = positions[i].z;
    }
    particles.geometry.attributes.position.needsUpdate = true;

    /* Rebuild lines every 4 frames for performance */
    if (frameCount % 4 === 0) updateLines();

    /* Rotate 3D shapes */
    icosahedron.rotation.x += 0.004;
    icosahedron.rotation.y += 0.006;
    innerIco.rotation.x -= 0.003;
    innerIco.rotation.y -= 0.007;
    torus.rotation.z += 0.003;
    torus.rotation.y += 0.002;

    /* Parallax on shapes — mouse + scroll drift */
    const scrollDrift = scrollProgress * 4;
    icosahedron.position.x = icoX + mouseX * (isMobile ? 0.1 : 0.4);
    icosahedron.position.y = (isMobile ? 1.5 : 0) + mouseY * -0.3 + scrollDrift;
    innerIco.position.x    = icoX + mouseX * (isMobile ? 0.1 : 0.4);
    innerIco.position.y    = (isMobile ? 1.5 : 0) + mouseY * -0.3 + scrollDrift;
    torus.position.x       = icoX + mouseX * (isMobile ? 0.08 : 0.3);
    torus.position.y       = (isMobile ? 1.5 : 0) + mouseY * -0.25 + scrollDrift * 0.8;

    /* Slight camera drift */
    camera.position.x += (mouseX * 0.2 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 0.1 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();

  /* ── Resize ── */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

/* ============================================================
   THREE.JS HERO-3D CONTAINER — second canvas (large device)
   ============================================================ */
(function initHero3DBox() {
  if (typeof THREE === 'undefined') return;
  if (window.innerWidth < 768) return;

  const container = document.getElementById('hero3d');
  if (!container) return;

  const w = container.clientWidth || 400;
  const h = container.clientHeight || 500;

  const renderer2 = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer2.setSize(w, h);
  renderer2.setClearColor(0x000000, 0);
  renderer2.domElement.id = 'threeCanvas';
  container.appendChild(renderer2.domElement);

  const scene2 = new THREE.Scene();
  const cam2 = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
  cam2.position.z = 4;

  /* Outer icosahedron */
  const geo1 = new THREE.IcosahedronGeometry(1.6, 1);
  const mat1 = new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true, transparent: true, opacity: 0.25 });
  const mesh1 = new THREE.Mesh(geo1, mat1);
  scene2.add(mesh1);

  /* Inner solid icosahedron */
  const geo2 = new THREE.IcosahedronGeometry(0.9, 0);
  const mat2 = new THREE.MeshBasicMaterial({ color: 0x6c63ff, wireframe: true, transparent: true, opacity: 0.35 });
  const mesh2 = new THREE.Mesh(geo2, mat2);
  scene2.add(mesh2);

  /* Rotating torus */
  const geo3 = new THREE.TorusGeometry(2.3, 0.02, 8, 80);
  const mat3 = new THREE.MeshBasicMaterial({ color: 0xff6b9d, transparent: true, opacity: 0.2 });
  const mesh3 = new THREE.Mesh(geo3, mat3);
  mesh3.rotation.x = 0.5;
  scene2.add(mesh3);

  /* Second torus offset */
  const geo4 = new THREE.TorusGeometry(1.8, 0.015, 8, 60);
  const mat4 = new THREE.MeshBasicMaterial({ color: 0x6c63ff, transparent: true, opacity: 0.15 });
  const mesh4 = new THREE.Mesh(geo4, mat4);
  mesh4.rotation.y = 0.8;
  scene2.add(mesh4);

  /* Small floating spheres */
  const spheres = [];
  for (let i = 0; i < 8; i++) {
    const sg = new THREE.SphereGeometry(0.04, 8, 8);
    const sm = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x6c63ff : 0x00d4ff });
    const s = new THREE.Mesh(sg, sm);
    const angle = (i / 8) * Math.PI * 2;
    s.position.set(Math.cos(angle) * 2.3, Math.sin(angle) * 2.3, 0);
    s.userData = { angle, speed: 0.006 + Math.random() * 0.004 };
    scene2.add(s);
    spheres.push(s);
  }

  let mx2 = 0, my2 = 0;
  document.addEventListener('mousemove', e => {
    mx2 = (e.clientX / window.innerWidth - 0.5) * 2;
    my2 = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animate2() {
    requestAnimationFrame(animate2);
    mesh1.rotation.x += 0.005;
    mesh1.rotation.y += 0.007;
    mesh2.rotation.x -= 0.006;
    mesh2.rotation.z += 0.004;
    mesh3.rotation.z += 0.004;
    mesh3.rotation.x += 0.002;
    mesh4.rotation.x += 0.003;
    mesh4.rotation.z -= 0.003;

    spheres.forEach(s => {
      s.userData.angle += s.userData.speed;
      s.position.x = Math.cos(s.userData.angle) * 2.3;
      s.position.y = Math.sin(s.userData.angle) * 2.3;
    });

    scene2.rotation.y += (mx2 * 0.3 - scene2.rotation.y) * 0.05;
    scene2.rotation.x += (-my2 * 0.2 - scene2.rotation.x) * 0.05;

    renderer2.render(scene2, cam2);
  }
  animate2();

  window.addEventListener('resize', () => {
    const nw = container.clientWidth;
    const nh = container.clientHeight;
    cam2.aspect = nw / nh;
    cam2.updateProjectionMatrix();
    renderer2.setSize(nw, nh);
  });
})();

/* ── Smooth scroll for nav links ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ============================================================
   AI CHAT WIDGET
   ============================================================ */
(function initChat() {
  const chatToggle = document.getElementById('chatToggle');
  const chatPanel = document.getElementById('chatPanel');
  const chatIcon = document.getElementById('chatIcon');
  const chatCloseIcon = document.getElementById('chatClose');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatSuggestions = document.getElementById('chatSuggestions');

  let chatOpen = false;
  let chatHistory = [];
  let isWaiting = false;

  chatToggle.addEventListener('click', () => {
    chatOpen = !chatOpen;
    chatPanel.classList.toggle('open', chatOpen);
    chatIcon.style.display = chatOpen ? 'none' : 'block';
    chatCloseIcon.style.display = chatOpen ? 'block' : 'none';
    if (chatOpen) chatInput.focus();
  });

  chatSuggestions.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chatSuggestions.style.display = 'none';
      sendMessage(chip.dataset.q);
    });
  });

  chatSend.addEventListener('click', () => {
    const msg = chatInput.value.trim();
    if (msg && !isWaiting) sendMessage(msg);
  });

  chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !isWaiting) {
      const msg = chatInput.value.trim();
      if (msg) sendMessage(msg);
    }
  });

  function appendMessage(role, text) {
    const div = document.createElement('div');
    div.className = `chat-message ${role === 'user' ? 'user-message' : 'bot-message'}`;
    div.innerHTML = `<div class="message-bubble">${text}</div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'chat-message chat-typing';
    div.id = 'typingIndicator';
    div.innerHTML = `<div class="message-bubble"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById('typingIndicator');
    if (t) t.remove();
  }

  async function sendMessage(text) {
    if (isWaiting) return;
    chatInput.value = '';
    isWaiting = true;
    chatSend.disabled = true;

    appendMessage('user', text);
    chatHistory.push({ role: 'user', content: text });
    showTyping();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: chatHistory.slice(-6) })
      });
      const data = await res.json();
      removeTyping();
      const reply = data.response || "Sorry, I had trouble with that. Try asking something else!";
      appendMessage('bot', reply);
      chatHistory.push({ role: 'assistant', content: reply });
    } catch (err) {
      removeTyping();
      appendMessage('bot', 'Oops! The AI service is temporarily unavailable. Reach DJ directly at <a href="mailto:dhananjaydesai162@gmail.com" style="color:#00d4ff">dhananjaydesai162@gmail.com</a>');
    }

    isWaiting = false;
    chatSend.disabled = false;
    chatInput.focus();
  }
})();
