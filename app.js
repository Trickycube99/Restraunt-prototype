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
    // Event delegation: capture clicks from any add-to-bag-trigger across the practical menu
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.add-to-bag-trigger');
      if (btn) {
        const name = btn.getAttribute('data-name');
        const price = parseFloat(btn.getAttribute('data-price'));
        const type = btn.getAttribute('data-type');
        if (name && !isNaN(price)) {
          addToCart(name, price, type || 'Café Item');
        }
      }
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
  // ==========================================================================
  // 9. Newsletter Handler, Hero Features & Navigation Spy
  // ==========================================================================
  window.handleNewsletter = function () {
    const input = document.getElementById('newsletter-input');
    const feedback = document.getElementById('newsletter-feedback');
    if (input && input.value) {
      feedback.textContent = `Thank you. ${input.value} is now registered for the Seasonal Dispatch.`;
      input.value = '';
    }
  };

  function initHeroFeatures() {
    // 1. Photo Perspective Switcher (Atelier Sanctuary vs Morning Spread)
    const perspectiveTabs = document.querySelectorAll('.perspective-tab');
    const photoPanes = document.querySelectorAll('.hero-photo-pane');

    perspectiveTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-target');
        perspectiveTabs.forEach((t) => {
          const isActive = t === tab;
          t.classList.toggle('active', isActive);
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        photoPanes.forEach((pane) => {
          const isTarget = pane.id === targetId;
          pane.classList.toggle('active', isTarget);
        });
      });
    });

    // 2. Obvious Action: View Menu CTA Smooth Scroll
    const heroMenuBtn = document.getElementById('hero-cta-menu');
    if (heroMenuBtn) {
      heroMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const menuSec = document.getElementById('menu-archive');
        if (menuSec) {
          const headerOffset = 68;
          const offsetPosition = menuSec.getBoundingClientRect().top + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      });
    }

    // 3. Scroll to Ritual sequence
    const ritualScrollBtn = document.getElementById('scroll-to-ritual-btn');
    if (ritualScrollBtn) {
      ritualScrollBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const ritualSec = document.getElementById('hero-track');
        if (ritualSec) {
          const headerOffset = 68;
          const offsetPosition = ritualSec.getBoundingClientRect().top + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      });
    }

    // 4. Obvious Action: Get Directions Modal
    const directionsModal = document.getElementById('directions-modal');
    const directionsBackdrop = document.getElementById('directions-backdrop');
    const directionsCloseBtn = document.getElementById('directions-close-btn');
    const heroDirectionsBtn = document.getElementById('hero-cta-directions');
    const headerDirectionsBtn = document.getElementById('header-directions-btn');
    const copyToast = document.getElementById('copy-toast');
    const cityTabs = document.querySelectorAll('.city-tab-btn');
    const cityPanels = document.querySelectorAll('.city-detail-panel');
    const copyButtons = document.querySelectorAll('.city-btn-copy');
    const modalJumpAteliers = document.getElementById('modal-jump-ateliers');

    function openDirectionsModal() {
      if (!directionsModal) return;
      directionsModal.classList.add('open');
      directionsModal.setAttribute('aria-hidden', 'false');
      if (heroDirectionsBtn) heroDirectionsBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeDirectionsModal() {
      if (!directionsModal) return;
      directionsModal.classList.remove('open');
      directionsModal.setAttribute('aria-hidden', 'true');
      if (heroDirectionsBtn) heroDirectionsBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    if (heroDirectionsBtn) heroDirectionsBtn.addEventListener('click', openDirectionsModal);
    if (headerDirectionsBtn) headerDirectionsBtn.addEventListener('click', openDirectionsModal);
    if (directionsCloseBtn) directionsCloseBtn.addEventListener('click', closeDirectionsModal);
    if (directionsBackdrop) directionsBackdrop.addEventListener('click', closeDirectionsModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && directionsModal && directionsModal.classList.contains('open')) {
        closeDirectionsModal();
      }
    });

    cityTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const city = tab.getAttribute('data-city');
        cityTabs.forEach((t) => {
          const isActive = t === tab;
          t.classList.toggle('active', isActive);
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        cityPanels.forEach((panel) => {
          panel.classList.toggle('active', panel.id === `panel-${city}`);
        });
      });
    });

    let toastTimeout = null;
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.city-btn-copy');
      if (btn) {
        const addr = btn.getAttribute('data-address');
        if (!addr) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(addr).then(() => {
            showCopyFeedback('Address copied to clipboard!');
          }).catch(() => {
            fallbackCopy(addr);
          });
        } else {
          fallbackCopy(addr);
        }
      }
    });

    function fallbackCopy(text) {
      const temp = document.createElement('textarea');
      temp.value = text;
      temp.style.position = 'fixed';
      temp.style.opacity = '0';
      document.body.appendChild(temp);
      temp.select();
      try {
        document.execCommand('copy');
        showCopyFeedback('Address copied to clipboard!');
      } catch (err) {
        showCopyFeedback('Press Ctrl+C to copy: ' + text);
      }
      document.body.removeChild(temp);
    }

    function showCopyFeedback(msg) {
      if (!copyToast) return;
      copyToast.textContent = msg;
      copyToast.style.opacity = '1';
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        copyToast.style.opacity = '0';
      }, 2500);
    }

    if (modalJumpAteliers) {
      modalJumpAteliers.addEventListener('click', (e) => {
        e.preventDefault();
        closeDirectionsModal();
        const ateliersSec = document.getElementById('ateliers');
        if (ateliersSec) {
          const headerOffset = 68;
          const offsetPosition = ateliersSec.getBoundingClientRect().top + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      });
    }
  }

  // ==========================================================================
  // Practical Menu Filtering, Search & Dietary Transparency System
  // ==========================================================================
  function initMenuFilters() {
    const categoryBtns = document.querySelectorAll('.menu-navigation-bar .menu-nav-btn');
    const dietPills = document.querySelectorAll('.dietary-filter-group .diet-filter-pill');
    const searchInput = document.getElementById('menu-search-input');
    const searchClearBtn = document.getElementById('menu-search-clear');
    const visibleCountEl = document.getElementById('visible-count');
    const noResultsEl = document.getElementById('menu-no-results');
    const resetBtn = document.getElementById('reset-menu-filters-btn');
    const menuCards = document.querySelectorAll('#menu-items-grid .menu-card');

    if (!menuCards.length) return;

    let activeCategory = 'all';
    let activeDiet = 'all';
    let searchQuery = '';

    function applyFilters() {
      let visibleCount = 0;

      menuCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category') || '';
        const cardDiets = (card.getAttribute('data-diets') || '').toLowerCase();
        const cardName = (card.getAttribute('data-name') || '').toLowerCase();
        const cardOrigin = (card.querySelector('.menu-card-origin')?.textContent || '').toLowerCase();
        const cardDesc = (card.querySelector('.menu-card-desc')?.textContent || '').toLowerCase();
        const cardTitle = (card.querySelector('.menu-card-title')?.textContent || '').toLowerCase();
        const cardBadges = (card.querySelector('.card-dietary-row')?.textContent || '').toLowerCase();

        // 1. Category Filter Matching
        const matchCategory = (activeCategory === 'all' || cardCategory === activeCategory);

        // 2. Dietary Filter Matching
        let matchDiet = false;
        if (activeDiet === 'all') {
          matchDiet = true;
        } else if (activeDiet === 'vegan') {
          matchDiet = cardDiets.includes('vegan');
        } else if (activeDiet === 'vegetarian') {
          // Plant-based / vegan items are also inherently vegetarian
          matchDiet = cardDiets.includes('vegetarian') || cardDiets.includes('vegan');
        } else if (activeDiet === 'gluten-free') {
          matchDiet = cardDiets.includes('gluten-free');
        } else if (activeDiet === 'nut-free') {
          matchDiet = cardDiets.includes('nut-free');
        }

        // 3. Search Query Matching (Name, Notes, Origin, Dietary Tags)
        let matchSearch = true;
        if (searchQuery) {
          const haystack = `${cardName} ${cardTitle} ${cardOrigin} ${cardDesc} ${cardBadges}`;
          matchSearch = haystack.includes(searchQuery);
        }

        // Apply visibility
        if (matchCategory && matchDiet && matchSearch) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Update active counter
      if (visibleCountEl) {
        visibleCountEl.textContent = visibleCount;
      }

      // Display empty state notice if no items match
      if (noResultsEl) {
        noResultsEl.style.display = visibleCount === 0 ? 'block' : 'none';
      }

      // Toggle search clear button visibility
      if (searchClearBtn) {
        searchClearBtn.style.opacity = searchQuery ? '1' : '0.3';
        searchClearBtn.style.pointerEvents = searchQuery ? 'auto' : 'none';
      }
    }

    // Category button click events
    categoryBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        activeCategory = btn.getAttribute('data-category') || 'all';
        categoryBtns.forEach((b) => {
          const isActive = b === btn;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        applyFilters();
      });
    });

    // Dietary pill click events
    dietPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        activeDiet = pill.getAttribute('data-diet') || 'all';
        dietPills.forEach((p) => {
          p.classList.toggle('active', p === pill);
        });
        applyFilters();
      });
    });

    // Live search input events
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        searchQuery = searchInput.value.trim().toLowerCase();
        applyFilters();
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          searchInput.value = '';
          searchQuery = '';
          applyFilters();
        }
      });
    }

    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchQuery = '';
          applyFilters();
          searchInput.focus();
        }
      });
    }

    // Reset filters handler
    function resetAllFilters() {
      activeCategory = 'all';
      activeDiet = 'all';
      searchQuery = '';

      if (searchInput) searchInput.value = '';

      categoryBtns.forEach((b) => {
        const isAll = b.getAttribute('data-category') === 'all';
        b.classList.toggle('active', isAll);
        b.setAttribute('aria-selected', isAll ? 'true' : 'false');
      });

      dietPills.forEach((p) => {
        const isAll = p.getAttribute('data-diet') === 'all';
        p.classList.toggle('active', isAll);
      });

      applyFilters();
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', resetAllFilters);
    }
  }

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
        setActiveLink('hero');
      });
    }

    // Header Quick Action "Menu" button smooth scroll
    const headerMenuLink = document.querySelector('.header-menu-link');
    if (headerMenuLink) {
      headerMenuLink.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = document.getElementById('menu-archive');
        if (targetSection) {
          const headerOffset = 68;
          const elementPosition = targetSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    }

    // Scroll spy updates underline automatically as user scrolls
    let scrollTimeout = null;
    function onScrollSpy() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollY < 180) {
        setActiveLink('hero');
        return;
      }

      const viewportOffset = scrollY + window.innerHeight * 0.35;
      let activeId = 'hero';

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

  // ==========================================================================
  // Real-Time Local Atelier Status (Open / Closed Hours)
  // ==========================================================================
  function initLiveStatus() {
    const statusPills = document.querySelectorAll('.live-status-pill');
    const heroEyebrowStatus = document.getElementById('hero-eyebrow-status');

    const citySchedules = {
      milan: {
        name: 'Milano',
        timeZone: 'Europe/Rome',
        check: (day, hour, min) => {
          const totalMin = hour * 60 + min;
          const isWeekend = (day === 0 || day === 6);
          const openMin = isWeekend ? 8 * 60 : 7 * 60;
          const closeMin = isWeekend ? 19 * 60 : 18 * 60;
          const isOpen = totalMin >= openMin && totalMin < closeMin;
          const closeStr = isWeekend ? '7:00 PM' : '6:00 PM';
          const openStr = isWeekend ? '8:00 AM' : '7:00 AM';
          return { isOpen, closeStr, openStr };
        }
      },
      kyoto: {
        name: 'Kyoto',
        timeZone: 'Asia/Tokyo',
        check: (day, hour, min) => {
          const totalMin = hour * 60 + min;
          if (day === 1) {
            return { isOpen: false, isClosedToday: true, openStr: 'Tue 7:30 AM' };
          }
          const openMin = 7 * 60 + 30;
          const closeMin = 17 * 60 + 30;
          const isOpen = totalMin >= openMin && totalMin < closeMin;
          return { isOpen, closeStr: '5:30 PM', openStr: '7:30 AM' };
        }
      },
      zurich: {
        name: 'Zürich',
        timeZone: 'Europe/Zurich',
        check: (day, hour, min) => {
          const totalMin = hour * 60 + min;
          if (day === 0) {
            return { isOpen: false, isClosedToday: true, openStr: 'Mon 7:30 AM' };
          }
          const openMin = 7 * 60 + 30;
          const closeMin = 17 * 60;
          const isOpen = totalMin >= openMin && totalMin < closeMin;
          return { isOpen, closeStr: '5:00 PM', openStr: '7:30 AM' };
        }
      },
      copenhagen: {
        name: 'København',
        timeZone: 'Europe/Copenhagen',
        check: (day, hour, min) => {
          const totalMin = hour * 60 + min;
          if (day === 1 || day === 2) {
            return { isOpen: false, isClosedToday: true, openStr: 'Wed 8:00 AM' };
          }
          const openMin = 8 * 60;
          const closeMin = 17 * 60 + 30;
          const isOpen = totalMin >= openMin && totalMin < closeMin;
          return { isOpen, closeStr: '5:30 PM', openStr: '8:00 AM' };
        }
      }
    };

    function updateStatus() {
      const now = new Date();

      statusPills.forEach((pill) => {
        const cityKey = pill.getAttribute('data-city');
        const config = citySchedules[cityKey];
        if (!config) return;

        try {
          const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: config.timeZone,
            weekday: 'short',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
          }).formatToParts(now);

          let localHour = 0;
          let localMin = 0;
          let weekdayStr = '';

          parts.forEach((p) => {
            if (p.type === 'hour') localHour = parseInt(p.value, 10);
            if (p.type === 'minute') localMin = parseInt(p.value, 10);
            if (p.type === 'weekday') weekdayStr = p.value;
          });

          const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
          const day = dayMap[weekdayStr] !== undefined ? dayMap[weekdayStr] : now.getDay();

          const res = config.check(day, localHour, localMin);
          const textSpan = pill.querySelector('.status-text') || pill;

          if (res.isOpen) {
            pill.classList.add('status-open');
            pill.classList.remove('status-closed');
            textSpan.textContent = `Open Now • Closes ${res.closeStr}`;
          } else {
            pill.classList.add('status-closed');
            pill.classList.remove('status-open');
            if (res.isClosedToday) {
              textSpan.textContent = `Closed Today • Opens ${res.openStr}`;
            } else {
              textSpan.textContent = `Closed • Opens at ${res.openStr}`;
            }
          }

          if (cityKey === 'milan' && heroEyebrowStatus) {
            if (res.isOpen) {
              heroEyebrowStatus.textContent = `Open Now until ${res.closeStr} • Flagship Atelier: Via Brera 14, Milan`;
            } else {
              heroEyebrowStatus.textContent = `Closed • Opens tomorrow at ${res.openStr} • Flagship Atelier: Via Brera 14, Milan`;
            }
          }
        } catch (err) {
          const textSpan = pill.querySelector('.status-text') || pill;
          textSpan.textContent = 'Open Today 7:00 AM – 6:00 PM';
        }
      });
    }

    updateStatus();
    setInterval(updateStatus, 60000);
  }

  // ==========================================================================
  // Atelier Location Filter Tabs
  // ==========================================================================
  function initAtelierTabs() {
    const tabBtns = document.querySelectorAll('.atelier-tab-btn');
    const atelierCards = document.querySelectorAll('.ateliers-comprehensive-grid .atelier-card');

    if (!tabBtns.length || !atelierCards.length) return;

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetCity = btn.getAttribute('data-target-city');
        tabBtns.forEach((b) => {
          const isActive = b === btn;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        atelierCards.forEach((card) => {
          const cardCity = card.getAttribute('data-city');
          if (targetCity === 'all' || cardCity === targetCity) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ==========================================================================
  // Interactive Reservation System (Cupping Workshops & Tasting Sessions)
  // ==========================================================================
  function initReservationModal() {
    const resModal = document.getElementById('reservation-modal');
    const resBackdrop = document.getElementById('reservation-backdrop');
    const resCloseBtn = document.getElementById('reservation-close-btn');
    const resForm = document.getElementById('reservation-form');
    const resConf = document.getElementById('reservation-confirmation');
    const resConfCloseBtn = document.getElementById('res-conf-close-btn');
    const citySelect = document.getElementById('res-city');
    const dateInput = document.getElementById('res-date');
    const heroReserveBtn = document.getElementById('hero-cta-reserve');
    const headerReserveBtn = document.getElementById('header-reserve-btn');

    if (dateInput) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.min = today.toISOString().split('T')[0];
      dateInput.value = tomorrow.toISOString().split('T')[0];
    }

    function openModal(preselectCity) {
      if (!resModal) return;
      if (preselectCity && citySelect) {
        citySelect.value = preselectCity;
      }
      if (resForm) resForm.style.display = '';
      if (resConf) resConf.style.display = 'none';

      resModal.classList.add('open');
      resModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      const firstInput = resForm ? resForm.querySelector('input, select') : null;
      if (firstInput) setTimeout(() => firstInput.focus(), 100);
    }

    function closeModal() {
      if (!resModal) return;
      resModal.classList.remove('open');
      resModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (resCloseBtn) resCloseBtn.addEventListener('click', closeModal);
    if (resBackdrop) resBackdrop.addEventListener('click', closeModal);
    if (resConfCloseBtn) resConfCloseBtn.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && resModal && resModal.classList.contains('open')) {
        closeModal();
      }
    });

    if (headerReserveBtn) {
      headerReserveBtn.addEventListener('click', () => openModal('milan'));
    }
    if (heroReserveBtn) {
      heroReserveBtn.addEventListener('click', () => openModal('milan'));
    }

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.atelier-reserve-trigger');
      if (trigger) {
        e.preventDefault();
        const city = trigger.getAttribute('data-city') || 'milan';
        openModal(city);
      }
    });

    if (resForm) {
      resForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('res-name');
        const emailInput = document.getElementById('res-email');
        const phoneInput = document.getElementById('res-phone');
        const expSelect = document.getElementById('res-experience');
        const timeSelect = document.getElementById('res-time');
        const guestsSelect = document.getElementById('res-guests');

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const cityVal = citySelect ? citySelect.value : 'milan';
        const expText = expSelect ? expSelect.options[expSelect.selectedIndex].text.split('(')[0].trim() : 'Guided Tasting Flight';
        const dateVal = dateInput ? dateInput.value : '';
        const timeText = timeSelect ? timeSelect.options[timeSelect.selectedIndex].text.split('(')[0].trim() : '02:00 PM';
        const guestsText = guestsSelect ? guestsSelect.options[guestsSelect.selectedIndex].text : '2 Guests';

        if (!name || !email || !phone) {
          alert('Please provide your name, email, and telephone number.');
          return;
        }

        const atelierCityMap = {
          milan: { name: 'Milano (Via Brera 14)', tel: '+39 02 8493 2140' },
          kyoto: { name: 'Kyoto (Kamogawa Sanjo)', tel: '+81 75 254 8831' },
          zurich: { name: 'Zürich (Augustinergasse 12)', tel: '+41 44 211 4050' },
          copenhagen: { name: 'København (Jægersborggade 41)', tel: '+45 32 18 90 22' }
        };

        const cityInfo = atelierCityMap[cityVal] || atelierCityMap.milan;
        const refCode = `#KAFFA-${cityVal.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

        const confRef = document.getElementById('conf-ref-code');
        const confAtelier = document.getElementById('conf-atelier-name');
        const confExp = document.getElementById('conf-exp-name');
        const confDatetime = document.getElementById('conf-datetime');
        const confParty = document.getElementById('conf-party');
        const confGuest = document.getElementById('conf-guest');
        const confTelLink = document.getElementById('conf-tel-link');

        if (confRef) confRef.textContent = refCode;
        if (confAtelier) confAtelier.textContent = cityInfo.name;
        if (confExp) confExp.textContent = expText;
        if (confDatetime) confDatetime.textContent = `${dateVal} at ${timeText}`;
        if (confParty) confParty.textContent = guestsText;
        if (confGuest) confGuest.textContent = `${name} (${email} • ${phone})`;
        if (confTelLink) {
          confTelLink.textContent = cityInfo.tel;
          confTelLink.href = `tel:${cityInfo.tel.replace(/\s+/g, '')}`;
        }

        resForm.style.display = 'none';
        if (resConf) resConf.style.display = 'flex';
      });
    }
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
    initHeroFeatures();
    initMenuFilters();
    initNavigationSpy();
    initLiveStatus();
    initAtelierTabs();
    initReservationModal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
