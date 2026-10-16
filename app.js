/**
 * KAFFA STUDIOS — THE POETRY OF EXTRACTION
 * High-Performance Hero Sequencer & 6 Interactive Canvas Studies
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. Hero Canvas Image Sequence (192 Frames)
  // ==========================================================================
  const TOTAL_FRAMES = 192;
  const FRAME_PREFIX = './frames/frame_';
  const FRAME_PAD = 6;
  const FRAME_EXT = '.jpg';

  const heroCanvas = document.getElementById('hero-canvas');
  const heroCtx = heroCanvas.getContext('2d');
  const heroTrack = document.getElementById('hero-track');
  const storyStanzas = document.querySelectorAll('.story-stanza');

  const frameImages = new Array(TOTAL_FRAMES);
  let targetProgress = 0;
  let currentProgress = 0;
  let lastDrawnFrame = -1;

  function getFrameUrl(index) {
    const numStr = String(index).padStart(FRAME_PAD, '0');
    return `${FRAME_PREFIX}${numStr}${FRAME_EXT}`;
  }

  function getNearestLoadedFrame(targetIdx) {
    if (frameImages[targetIdx] && frameImages[targetIdx].complete && frameImages[targetIdx].naturalWidth > 0) {
      return frameImages[targetIdx];
    }
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = targetIdx - offset;
      if (prev >= 0 && frameImages[prev] && frameImages[prev].complete && frameImages[prev].naturalWidth > 0) {
        return frameImages[prev];
      }
      const next = targetIdx + offset;
      if (next < TOTAL_FRAMES && frameImages[next] && frameImages[next].complete && frameImages[next].naturalWidth > 0) {
        return frameImages[next];
      }
    }
    return null;
  }

  function preloadHeroFrames() {
    const img0 = new Image();
    img0.src = getFrameUrl(0);
    img0.onload = () => {
      frameImages[0] = img0;
      renderHeroCanvas(0);
    };

    for (let i = 8; i < TOTAL_FRAMES; i += 8) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        frameImages[i] = img;
      };
    }

    let currentIdx = 1;
    function loadRemainingBatch() {
      let count = 0;
      while (currentIdx < TOTAL_FRAMES && count < 14) {
        if (!frameImages[currentIdx]) {
          const idx = currentIdx;
          const img = new Image();
          img.src = getFrameUrl(idx);
          img.onload = () => {
            frameImages[idx] = img;
          };
          count++;
        }
        currentIdx++;
      }
      if (currentIdx < TOTAL_FRAMES) {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(loadRemainingBatch, { timeout: 100 });
        } else {
          setTimeout(loadRemainingBatch, 25);
        }
      }
    }
    setTimeout(loadRemainingBatch, 40);
  }

  function resizeHeroCanvas() {
    if (!heroCanvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = heroCanvas.getBoundingClientRect();
    heroCanvas.width = rect.width * dpr;
    heroCanvas.height = rect.height * dpr;
    heroCtx.scale(dpr, dpr);

    const frameIdx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentProgress * (TOTAL_FRAMES - 1))));
    renderHeroCanvas(frameIdx);
  }

  function renderHeroCanvas(frameIndex) {
    const img = getNearestLoadedFrame(frameIndex);
    if (!img) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const viewW = heroCanvas.width / dpr;
    const viewH = heroCanvas.height / dpr;

    heroCtx.fillStyle = '#FFFFFF';
    heroCtx.fillRect(0, 0, viewW, viewH);

    // Crop 4px letterbox bar from top and bottom
    const sx = 0;
    const sy = 4;
    const sw = img.naturalWidth || 1280;
    const sh = Math.max(10, (img.naturalHeight || 720) - 8);

    const maxW = viewW * 0.92;
    const maxH = viewH * 0.88;
    const scale = Math.min(maxW / sw, maxH / sh);

    const dw = sw * scale;
    const dh = sh * scale;
    const dx = (viewW - dw) / 2;
    const dy = (viewH - dh) / 2;

    heroCtx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
  }

  function updateStanzas(progress) {
    let activeId = 'stanza-1';
    if (progress >= 0.24 && progress < 0.50) {
      activeId = 'stanza-2';
    } else if (progress >= 0.50 && progress < 0.76) {
      activeId = 'stanza-3';
    } else if (progress >= 0.76) {
      activeId = 'stanza-4';
    }

    storyStanzas.forEach((stanza) => {
      if (stanza.id === activeId) {
        stanza.classList.add('active');
      } else {
        stanza.classList.remove('active');
      }
    });
  }

  function calculateScrollProgress() {
    if (!heroTrack) return 0;
    const rect = heroTrack.getBoundingClientRect();
    const trackHeight = heroTrack.offsetHeight;
    const windowH = window.innerHeight;
    const scrollDist = -rect.top;
    const maxScroll = trackHeight - windowH;
    if (maxScroll <= 0) return 0;
    return Math.max(0, Math.min(1, scrollDist / maxScroll));
  }

  function heroAnimationLoop() {
    targetProgress = calculateScrollProgress();
    currentProgress += (targetProgress - currentProgress) * 0.12;

    const frameIdx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentProgress * (TOTAL_FRAMES - 1))));

    if (frameIdx !== lastDrawnFrame) {
      renderHeroCanvas(frameIdx);
      updateStanzas(currentProgress);
      lastDrawnFrame = frameIdx;
    }

    requestAnimationFrame(heroAnimationLoop);
  }

  // ==========================================================================
  // 2. Study 1: Wide Panoramic Coffee Grounds Wave Canvas
  // ==========================================================================
  const groundsCanvas = document.getElementById('grounds-canvas');
  let groundsCtx = null;
  const groundsImg = new Image();
  groundsImg.src = './assets/grounds.jpg';
  let groundsDustParticles = [];

  for (let i = 0; i < 40; i++) {
    groundsDustParticles.push({
      x: Math.random(),
      y: 0.35 + Math.random() * 0.3,
      baseY: 0.35 + Math.random() * 0.3,
      size: 1.2 + Math.random() * 2.5,
      alpha: 0.2 + Math.random() * 0.5,
      drift: (Math.random() - 0.5) * 0.002
    });
  }

  function initGroundsCanvas() {
    if (!groundsCanvas) return;
    groundsCtx = groundsCanvas.getContext('2d');

    function renderGrounds() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = groundsCanvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      if (groundsCanvas.width !== rect.width * dpr) {
        groundsCanvas.width = rect.width * dpr;
        groundsCanvas.height = rect.height * dpr;
      }

      groundsCtx.save();
      groundsCtx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;

      groundsCtx.fillStyle = '#FFFFFF';
      groundsCtx.fillRect(0, 0, w, h);

      if (groundsImg.complete && groundsImg.naturalWidth > 0) {
        const sw = groundsImg.naturalWidth;
        const sh = groundsImg.naturalHeight;
        const scale = Math.min(w * 0.98 / sw, h * 0.94 / sh);
        const dw = sw * scale;
        const dh = sh * scale;
        const dx = (w - dw) / 2;
        const dy = (h - dh) / 2;

        groundsCtx.drawImage(groundsImg, dx, dy, dw, dh);

        // Render ambient floating espresso speckles
        groundsDustParticles.forEach((p) => {
          groundsCtx.fillStyle = `rgba(50, 30, 20, ${p.alpha})`;
          groundsCtx.beginPath();
          groundsCtx.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2);
          groundsCtx.fill();
        });
      }

      groundsCtx.restore();
    }

    groundsImg.onload = renderGrounds;
    window.addEventListener('resize', renderGrounds);

    // Interactive cursor wave dispersal
    groundsCanvas.addEventListener('mousemove', (e) => {
      const rect = groundsCanvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / rect.width;
      const mouseY = (e.clientY - rect.top) / rect.height;

      groundsDustParticles.forEach((p) => {
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.18) {
          const force = (0.18 - dist) * 0.08;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        } else {
          p.y += (p.baseY - p.y) * 0.04;
        }
      });
      renderGrounds();
    });
  }

  // ==========================================================================
  // 3. Study 2: Botanical Coffee Branch Canvas (Dynamic Cherry & Jasmine Blossom)
  // ==========================================================================
  const branchCanvas = document.getElementById('branch-canvas');
  let branchCtx = null;
  const branchImg = new Image();
  branchImg.src = './assets/branch.jpg';

  let branchHover = {
    active: false,
    x: 0.5,
    y: 0.5,
    currentScale: 1.0,
    currentDx: 0,
    currentDy: 0,
    rippleRadius: 0,
    rippleAlpha: 0,
    rippleX: 0.5,
    rippleY: 0.5
  };

  // Drifting jasmine petals & golden mist motes
  const botanicalParticles = [];
  for (let i = 0; i < 28; i++) {
    botanicalParticles.push({
      x: Math.random(),
      y: Math.random(),
      size: i % 2 === 0 ? 3.5 + Math.random() * 4.5 : 1.2 + Math.random() * 2.2,
      isPetal: i % 2 === 0,
      angle: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      speedX: 0.0004 + Math.random() * 0.0008,
      speedY: (Math.random() - 0.5) * 0.0004,
      wobbleSpeed: 0.01 + Math.random() * 0.02,
      wobbleOffset: Math.random() * Math.PI * 2,
      opacity: i % 2 === 0 ? 0.35 + Math.random() * 0.45 : 0.2 + Math.random() * 0.45
    });
  }

  function initBranchCanvas() {
    if (!branchCanvas) return;
    branchCtx = branchCanvas.getContext('2d');

    let animFrameId = null;
    let time = 0;

    function animateBranch() {
      time += 0.02;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = branchCanvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        animFrameId = requestAnimationFrame(animateBranch);
        return;
      }

      if (branchCanvas.width !== rect.width * dpr) {
        branchCanvas.width = rect.width * dpr;
        branchCanvas.height = rect.height * dpr;
      }

      branchCtx.save();
      branchCtx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;

      branchCtx.fillStyle = '#FFFFFF';
      branchCtx.fillRect(0, 0, w, h);

      if (branchImg.complete && branchImg.naturalWidth > 0) {
        const sw = branchImg.naturalWidth;
        const sh = branchImg.naturalHeight;
        const baseScale = Math.min(w * 0.95 / sw, h * 0.95 / sh);

        // Smooth interactive sway and scale
        const targetScale = branchHover.active ? 1.05 : 1.0;
        const targetDx = branchHover.active ? (0.5 - branchHover.x) * 26 : Math.sin(time * 0.5) * 4;
        const targetDy = branchHover.active ? (0.5 - branchHover.y) * 18 : Math.cos(time * 0.4) * 3;

        branchHover.currentScale += (targetScale - branchHover.currentScale) * 0.08;
        branchHover.currentDx += (targetDx - branchHover.currentDx) * 0.08;
        branchHover.currentDy += (targetDy - branchHover.currentDy) * 0.08;

        const scale = baseScale * branchHover.currentScale;
        const dw = sw * scale;
        const dh = sh * scale;
        const dx = (w - dw) / 2 + branchHover.currentDx;
        const dy = (h - dh) / 2 + branchHover.currentDy;

        branchCtx.drawImage(branchImg, dx, dy, dw, dh);

        // Interactive morning sunbeam highlight over cherries
        if (branchHover.active) {
          const sunGrad = branchCtx.createRadialGradient(
            branchHover.x * w, branchHover.y * h, 12,
            branchHover.x * w, branchHover.y * h, 260
          );
          sunGrad.addColorStop(0, 'rgba(255, 248, 230, 0.42)');
          sunGrad.addColorStop(0.4, 'rgba(255, 235, 215, 0.18)');
          sunGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          branchCtx.fillStyle = sunGrad;
          branchCtx.fillRect(0, 0, w, h);
        }

        // Click Dew Ripple across cherries
        if (branchHover.rippleAlpha > 0.01) {
          branchHover.rippleRadius += 4.5;
          branchHover.rippleAlpha *= 0.93;

          branchCtx.strokeStyle = `rgba(180, 40, 50, ${branchHover.rippleAlpha * 0.55})`;
          branchCtx.lineWidth = 1.8;
          branchCtx.beginPath();
          branchCtx.arc(branchHover.rippleX * w, branchHover.rippleY * h, branchHover.rippleRadius, 0, Math.PI * 2);
          branchCtx.stroke();

          branchCtx.strokeStyle = `rgba(255, 255, 255, ${branchHover.rippleAlpha * 0.8})`;
          branchCtx.lineWidth = 1.2;
          branchCtx.beginPath();
          branchCtx.arc(branchHover.rippleX * w, branchHover.rippleY * h, Math.max(0, branchHover.rippleRadius - 6), 0, Math.PI * 2);
          branchCtx.stroke();
        }

        // Render ambient floating petals and dewy pollen
        botanicalParticles.forEach((p) => {
          p.x += p.speedX;
          p.y += p.speedY + Math.sin(time * p.wobbleSpeed + p.wobbleOffset) * 0.0003;
          p.angle += p.rotationSpeed;

          // Wrap around canvas
          if (p.x > 1.05) p.x = -0.05;
          if (p.x < -0.05) p.x = 1.05;
          if (p.y > 1.05) p.y = -0.05;
          if (p.y < -0.05) p.y = 1.05;

          // Slight repulsion from cursor if nearby
          if (branchHover.active) {
            const cdx = p.x - branchHover.x;
            const cdy = p.y - branchHover.y;
            const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
            if (cdist < 0.16 && cdist > 0.001) {
              p.x += (cdx / cdist) * 0.004;
              p.y += (cdy / cdist) * 0.004;
            }
          }

          const px = p.x * w;
          const py = p.y * h;

          branchCtx.save();
          branchCtx.translate(px, py);
          branchCtx.rotate(p.angle);

          if (p.isPetal) {
            // Translucent white jasmine blossom petal
            branchCtx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            branchCtx.beginPath();
            branchCtx.ellipse(0, 0, p.size * 1.5, p.size * 0.75, 0, 0, Math.PI * 2);
            branchCtx.fill();
            branchCtx.strokeStyle = `rgba(235, 220, 205, ${p.opacity * 0.6})`;
            branchCtx.lineWidth = 0.6;
            branchCtx.stroke();
          } else {
            // Golden morning mist / floral pollen mote
            branchCtx.fillStyle = `rgba(220, 180, 110, ${p.opacity})`;
            branchCtx.beginPath();
            branchCtx.arc(0, 0, p.size, 0, Math.PI * 2);
            branchCtx.fill();
          }

          branchCtx.restore();
        });
      }

      branchCtx.restore();
      animFrameId = requestAnimationFrame(animateBranch);
    }

    branchImg.onload = () => {
      if (!animFrameId) {
        animateBranch();
      }
    };
    if (branchImg.complete) {
      animateBranch();
    }

    branchCanvas.addEventListener('mouseenter', () => {
      branchHover.active = true;
    });

    branchCanvas.addEventListener('mousemove', (e) => {
      const rect = branchCanvas.getBoundingClientRect();
      branchHover.x = (e.clientX - rect.left) / rect.width;
      branchHover.y = (e.clientY - rect.top) / rect.height;
      branchHover.active = true;
    });

    branchCanvas.addEventListener('mouseleave', () => {
      branchHover.active = false;
    });

    branchCanvas.addEventListener('click', (e) => {
      const rect = branchCanvas.getBoundingClientRect();
      branchHover.rippleX = (e.clientX - rect.left) / rect.width;
      branchHover.rippleY = (e.clientY - rect.top) / rect.height;
      branchHover.rippleRadius = 14;
      branchHover.rippleAlpha = 0.9;
    });
  }

  // ==========================================================================
  // 4. Study 3: Spiral of Roasted Arabica Beans Canvas
  // ==========================================================================
  const beansCanvas = document.getElementById('beans-canvas');
  let beansCtx = null;
  const beansImg = new Image();
  beansImg.src = './assets/beans.jpg';
  let beansMouse = { x: 0.5, y: 0.5, isHovering: false };

  function initBeansCanvas() {
    if (!beansCanvas) return;
    beansCtx = beansCanvas.getContext('2d');

    function renderBeans() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = beansCanvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      if (beansCanvas.width !== rect.width * dpr) {
        beansCanvas.width = rect.width * dpr;
        beansCanvas.height = rect.height * dpr;
      }

      beansCtx.save();
      beansCtx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;

      beansCtx.fillStyle = '#FFFFFF';
      beansCtx.fillRect(0, 0, w, h);

      if (beansImg.complete && beansImg.naturalWidth > 0) {
        const sw = beansImg.naturalWidth;
        const sh = beansImg.naturalHeight;
        const scale = Math.min(w * 0.96 / sw, h * 0.94 / sh);
        const dw = sw * scale;
        const dh = sh * scale;
        const dx = (w - dw) / 2;
        const dy = (h - dh) / 2;

        beansCtx.drawImage(beansImg, dx, dy, dw, dh);

        if (beansMouse.isHovering) {
          const grad = beansCtx.createRadialGradient(
            beansMouse.x * w, beansMouse.y * h, 10,
            beansMouse.x * w, beansMouse.y * h, 240
          );
          grad.addColorStop(0, 'rgba(255, 246, 230, 0.4)');
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          beansCtx.fillStyle = grad;
          beansCtx.fillRect(0, 0, w, h);
        }
      }

      beansCtx.restore();
    }

    beansImg.onload = renderBeans;
    window.addEventListener('resize', renderBeans);

    beansCanvas.addEventListener('mousemove', (e) => {
      const rect = beansCanvas.getBoundingClientRect();
      beansMouse.x = (e.clientX - rect.left) / rect.width;
      beansMouse.y = (e.clientY - rect.top) / rect.height;
      beansMouse.isHovering = true;
      renderBeans();
    });

    beansCanvas.addEventListener('mouseleave', () => {
      beansMouse.isHovering = false;
      renderBeans();
    });
  }

  // ==========================================================================
  // 5. Study 4: Porcelain Pour-Over Dripper (Steam Canvas + Interactive Parallax)
  // ==========================================================================
  const dripperCanvas = document.getElementById('dripper-canvas');
  let dripperCtx = null;
  const dripperImg = new Image();
  dripperImg.src = './assets/dripper.jpg';
  let dripperHover = { active: false, x: 0.5, y: 0.5, currentScale: 1.0, currentDx: 0, currentDy: 0 };

  const steamParticles = [];
  for (let i = 0; i < 28; i++) {
    steamParticles.push({
      x: 0.5 + (Math.random() - 0.5) * 0.12,
      y: 0.45 + Math.random() * 0.28,
      radius: 9 + Math.random() * 18,
      opacity: 0.05 + Math.random() * 0.12,
      speedY: 0.001 + Math.random() * 0.0018,
      driftX: (Math.random() - 0.5) * 0.0006
    });
  }

  function initDripperCanvas() {
    if (!dripperCanvas) return;
    dripperCtx = dripperCanvas.getContext('2d');

    function animateDripper() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = dripperCanvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        requestAnimationFrame(animateDripper);
        return;
      }

      if (dripperCanvas.width !== rect.width * dpr) {
        dripperCanvas.width = rect.width * dpr;
        dripperCanvas.height = rect.height * dpr;
      }

      dripperCtx.save();
      dripperCtx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;

      dripperCtx.fillStyle = '#FFFFFF';
      dripperCtx.fillRect(0, 0, w, h);

      if (dripperImg.complete && dripperImg.naturalWidth > 0) {
        const sw = dripperImg.naturalWidth;
        const sh = dripperImg.naturalHeight;
        const baseScale = Math.min(w * 0.94 / sw, h * 0.94 / sh);

        // Same interactive hover zoom (1.07x) & magnetic parallax as croissant
        const targetScale = dripperHover.active ? 1.07 : 1.0;
        const targetDx = dripperHover.active ? (0.5 - dripperHover.x) * 28 : 0;
        const targetDy = dripperHover.active ? (0.5 - dripperHover.y) * 20 : 0;

        dripperHover.currentScale += (targetScale - dripperHover.currentScale) * 0.1;
        dripperHover.currentDx += (targetDx - dripperHover.currentDx) * 0.1;
        dripperHover.currentDy += (targetDy - dripperHover.currentDy) * 0.1;

        const scale = baseScale * dripperHover.currentScale;
        const dw = sw * scale;
        const dh = sh * scale;
        const dx = (w - dw) / 2 + dripperHover.currentDx;
        const dy = (h - dh) / 2 + dripperHover.currentDy;

        dripperCtx.drawImage(dripperImg, dx, dy, dw, dh);

        // Rising steam particles follow dripper position
        steamParticles.forEach((p) => {
          p.y -= p.speedY;
          p.x += p.driftX;
          p.radius += 0.05;
          p.opacity -= 0.0006;

          if (p.y < 0.08 || p.opacity <= 0) {
            p.y = 0.50 + Math.random() * 0.08;
            p.x = 0.5 + (Math.random() - 0.5) * 0.10;
            p.radius = 9 + Math.random() * 10;
            p.opacity = 0.06 + Math.random() * 0.12;
          }

          const steamCenterX = p.x * w + dripperHover.currentDx * 0.6;
          const steamCenterY = p.y * h + dripperHover.currentDy * 0.6;

          const grad = dripperCtx.createRadialGradient(
            steamCenterX, steamCenterY, 0,
            steamCenterX, steamCenterY, p.radius
          );
          grad.addColorStop(0, `rgba(255, 255, 255, ${Math.max(0, p.opacity)})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          dripperCtx.fillStyle = grad;
          dripperCtx.beginPath();
          dripperCtx.arc(steamCenterX, steamCenterY, p.radius, 0, Math.PI * 2);
          dripperCtx.fill();
        });
      }

      dripperCtx.restore();
      requestAnimationFrame(animateDripper);
    }

    dripperImg.onload = () => {
      animateDripper();
    };
    if (dripperImg.complete) {
      animateDripper();
    }

    dripperCanvas.addEventListener('mouseenter', () => {
      dripperHover.active = true;
    });

    dripperCanvas.addEventListener('mousemove', (e) => {
      const rect = dripperCanvas.getBoundingClientRect();
      dripperHover.x = (e.clientX - rect.left) / rect.width;
      dripperHover.y = (e.clientY - rect.top) / rect.height;
      dripperHover.active = true;
    });

    dripperCanvas.addEventListener('mouseleave', () => {
      dripperHover.active = false;
    });
  }

  // ==========================================================================
  // 6. Study 5: The Laminated Croissant Canvas
  // ==========================================================================
  const croissantCanvas = document.getElementById('croissant-canvas');
  let croissantCtx = null;
  const croissantImg = new Image();
  croissantImg.src = './assets/croissant.jpg';
  let croissantHover = { active: false, x: 0.5, y: 0.5, currentScale: 1.0, currentDx: 0, currentDy: 0 };

  function initCroissantCanvas() {
    if (!croissantCanvas) return;
    croissantCtx = croissantCanvas.getContext('2d');

    function animateCroissant() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = croissantCanvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        requestAnimationFrame(animateCroissant);
        return;
      }

      if (croissantCanvas.width !== rect.width * dpr) {
        croissantCanvas.width = rect.width * dpr;
        croissantCanvas.height = rect.height * dpr;
      }

      croissantCtx.save();
      croissantCtx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;

      croissantCtx.fillStyle = '#FFFFFF';
      croissantCtx.fillRect(0, 0, w, h);

      if (croissantImg.complete && croissantImg.naturalWidth > 0) {
        const sw = croissantImg.naturalWidth;
        const sh = croissantImg.naturalHeight;
        const baseScale = Math.min(w * 0.94 / sw, h * 0.94 / sh);

        const targetScale = croissantHover.active ? 1.07 : 1.0;
        const targetDx = croissantHover.active ? (0.5 - croissantHover.x) * 28 : 0;
        const targetDy = croissantHover.active ? (0.5 - croissantHover.y) * 20 : 0;

        croissantHover.currentScale += (targetScale - croissantHover.currentScale) * 0.1;
        croissantHover.currentDx += (targetDx - croissantHover.currentDx) * 0.1;
        croissantHover.currentDy += (targetDy - croissantHover.currentDy) * 0.1;

        const scale = baseScale * croissantHover.currentScale;
        const dw = sw * scale;
        const dh = sh * scale;
        const dx = (w - dw) / 2 + croissantHover.currentDx;
        const dy = (h - dh) / 2 + croissantHover.currentDy;

        croissantCtx.drawImage(croissantImg, dx, dy, dw, dh);
      }

      croissantCtx.restore();
      requestAnimationFrame(animateCroissant);
    }

    croissantImg.onload = animateCroissant;
    if (croissantImg.complete) {
      animateCroissant();
    }

    croissantCanvas.addEventListener('mouseenter', () => {
      croissantHover.active = true;
    });

    croissantCanvas.addEventListener('mousemove', (e) => {
      const rect = croissantCanvas.getBoundingClientRect();
      croissantHover.x = (e.clientX - rect.left) / rect.width;
      croissantHover.y = (e.clientY - rect.top) / rect.height;
      croissantHover.active = true;
    });

    croissantCanvas.addEventListener('mouseleave', () => {
      croissantHover.active = false;
    });
  }

  // ==========================================================================
  // 7. Study 6: The Overhead Latte Bloom Canvas (Concentric Ripples)
  // ==========================================================================
  const latteCanvas = document.getElementById('latte-canvas');
  let latteCtx = null;
  const latteImg = new Image();
  latteImg.src = './assets/latte_top.jpg';
  let rippleRadius = 0;
  let rippleAlpha = 0;

  function initLatteCanvas() {
    if (!latteCanvas) return;
    latteCtx = latteCanvas.getContext('2d');

    function animateLatte() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = latteCanvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        requestAnimationFrame(animateLatte);
        return;
      }

      if (latteCanvas.width !== rect.width * dpr) {
        latteCanvas.width = rect.width * dpr;
        latteCanvas.height = rect.height * dpr;
      }

      latteCtx.save();
      latteCtx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;

      latteCtx.fillStyle = '#FFFFFF';
      latteCtx.fillRect(0, 0, w, h);

      if (latteImg.complete && latteImg.naturalWidth > 0) {
        const sw = latteImg.naturalWidth;
        const sh = latteImg.naturalHeight;
        const scale = Math.min(w * 0.90 / sw, h * 0.90 / sh);
        const dw = sw * scale;
        const dh = sh * scale;
        const dx = (w - dw) / 2;
        const dy = (h - dh) / 2;

        latteCtx.drawImage(latteImg, dx, dy, dw, dh);

        if (rippleAlpha > 0.01) {
          latteCtx.strokeStyle = `rgba(180, 130, 80, ${rippleAlpha})`;
          latteCtx.lineWidth = 1.5;
          latteCtx.beginPath();
          latteCtx.arc(w / 2, h / 2, rippleRadius, 0, Math.PI * 2);
          latteCtx.stroke();

          latteCtx.beginPath();
          latteCtx.arc(w / 2, h / 2, Math.max(0, rippleRadius - 38), 0, Math.PI * 2);
          latteCtx.stroke();

          rippleRadius += 1.3;
          rippleAlpha *= 0.97;
        }
      }

      latteCtx.restore();
      requestAnimationFrame(animateLatte);
    }

    latteImg.onload = animateLatte;

    latteCanvas.addEventListener('click', () => {
      rippleRadius = 45;
      rippleAlpha = 0.50;
    });

    latteCanvas.addEventListener('mouseenter', () => {
      if (rippleAlpha <= 0.05) {
        rippleRadius = 35;
        rippleAlpha = 0.38;
      }
    });
  }

  // ==========================================================================
  // 8. Wide Editorial Shopping Bag Experience
  // ==========================================================================
  const cart = [];
  const cartDrawer = document.getElementById('cart-drawer');
  const cartBackdrop = document.getElementById('cart-backdrop');
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const emptyCartMessage = document.getElementById('empty-cart-message');
  const cartSubtotalDisplay = document.getElementById('cart-subtotal-display');
  const checkoutBtn = document.getElementById('checkout-btn');
  const bagCountBadge = document.getElementById('bag-count-badge');

  function openCart() {
    cartDrawer.classList.add('open');
    cartDrawer.setAttribute('aria-hidden', 'false');
  }

  function closeCart() {
    cartDrawer.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden', 'true');
  }

  function renderCart() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    bagCountBadge.textContent = totalCount;

    if (cartToggleBtn) {
      cartToggleBtn.classList.add('bump');
      setTimeout(() => cartToggleBtn.classList.remove('bump'), 250);
    }

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '';
      cartItemsContainer.appendChild(emptyCartMessage);
      cartSubtotalDisplay.textContent = '$0.00';
      checkoutBtn.disabled = true;
      return;
    }

    let subtotal = 0;
    cartItemsContainer.innerHTML = '';

    cart.forEach((item, index) => {
      subtotal += item.price * item.qty;
      const row = document.createElement('div');
      row.className = 'cart-item-row';
      row.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name} (${item.qty})</div>
          <div class="cart-item-type">${item.type}</div>
          <button class="cart-item-remove" data-index="${index}">Remove</button>
        </div>
        <div class="cart-item-price-val">$${(item.price * item.qty).toFixed(2)}</div>
      `;
      cartItemsContainer.appendChild(row);
    });

    cartSubtotalDisplay.textContent = `$${subtotal.toFixed(2)}`;
    checkoutBtn.disabled = false;
  }

  function addToCart(name, price, type) {
    const existing = cart.find((i) => i.name === name);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name, price, type, qty: 1 });
    }
    renderCart();
    openCart();
  }

  function initCart() {
    document.querySelectorAll('.add-to-bag-trigger').forEach((btn) => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        const price = parseFloat(btn.getAttribute('data-price'));
        const type = btn.getAttribute('data-type');
        addToCart(name, price, type);
      });
    });

    cartToggleBtn.addEventListener('click', openCart);
    cartCloseBtn.addEventListener('click', closeCart);
    cartBackdrop.addEventListener('click', closeCart);

    cartItemsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('cart-item-remove')) {
        const idx = parseInt(e.target.getAttribute('data-index'), 10);
        cart.splice(idx, 1);
        renderCart();
      }
    });

    checkoutBtn.addEventListener('click', () => {
      alert('Kaffa Studios Checkout\n\nThank you for exploring our minimalist coffee studies.');
    });

    document.getElementById('back-to-top-btn').addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================================================
  // 9. Newsletter Handler & Navigation Spy
  // ==========================================================================
  window.handleNewsletter = function () {
    const input = document.getElementById('newsletter-input');
    const feedback = document.getElementById('newsletter-feedback');
    if (input && input.value) {
      feedback.textContent = `Thank you. ${input.value} is now registered for the Seasonal Dispatch.`;
      input.value = '';
    }
  };

  function initNavigationSpy() {
    const navLinks = document.querySelectorAll('.main-nav .nav-link');
    const sections = [];

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const el = document.querySelector(href);
        if (el) {
          sections.push({ id: href.replace('#', ''), element: el, link: link });
        }
      }
    });

    function setActiveLink(targetId) {
      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href === `#${targetId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').replace('#', '');
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          const headerOffset = 68;
          const elementPosition = targetSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          setActiveLink(targetId);

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    const brandLogo = document.getElementById('brand-logo');
    if (brandLogo) {
      brandLogo.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveLink('hero-track');
      });
    }

    // Scroll spy updates underline automatically as user scrolls
    let scrollTimeout = null;
    function onScrollSpy() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollY < 160) {
        setActiveLink('hero-track');
        return;
      }

      const viewportOffset = scrollY + window.innerHeight * 0.35;
      let activeId = 'hero-track';

      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i];
        const top = sec.element.offsetTop;
        const height = sec.element.offsetHeight;
        if (viewportOffset >= top && viewportOffset < top + height) {
          activeId = sec.id;
          break;
        }
      }

      setActiveLink(activeId);
    }

    window.addEventListener('scroll', () => {
      if (!scrollTimeout) {
        scrollTimeout = requestAnimationFrame(() => {
          onScrollSpy();
          scrollTimeout = null;
        });
      }
    }, { passive: true });

    onScrollSpy();
  }

  function init() {
    window.addEventListener('resize', resizeHeroCanvas);
    resizeHeroCanvas();
    preloadHeroFrames();
    heroAnimationLoop();

    initGroundsCanvas();
    initBranchCanvas();
    initBeansCanvas();
    initDripperCanvas();
    initCroissantCanvas();
    initLatteCanvas();

    initCart();
    initNavigationSpy();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
