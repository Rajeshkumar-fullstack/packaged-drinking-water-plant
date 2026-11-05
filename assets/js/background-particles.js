/**
 * AQUAPURE - Premium Animated Floating Dot Particle & Water Bubble Background
 * Canvas 2D Engine with Connected Dots, Water Droplets, Micro-Bubbles & Ambient Aqua Glow
 * Full-Page Responsive, High-DPI, Dark/Light Mode Aware & Zero-Latency Performance
 */

(function () {
  'use strict';

  // Core Palette Configuration (Theme-aligned)
  const PALETTE = {
    aqua: '#12A9D6',
    cyan: '#24BDE8',
    deepBlue: '#087CA7',
    softHighlight: '#EAF8FC'
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isReducedMotion = prefersReducedMotion.matches;

  prefersReducedMotion.addEventListener('change', (e) => {
    isReducedMotion = e.matches;
    if (isReducedMotion) {
      stopAnimation();
      drawSingleStaticFrame();
    } else {
      startAnimation();
    }
  });

  // State Management
  let canvas = null;
  let ctx = null;
  let animationFrameId = null;
  let isRunning = false;
  let isDarkMode = false;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];
  let mouse = { x: -9999, y: -9999, active: false };

  // Responsive Configuration Matrix
  function getConfig() {
    const w = window.innerWidth;
    if (w < 480) {
      // 360px - 480px Mobile
      return {
        particleCount: 24,
        maxConnectDistance: 60,
        enableConnections: true,
        enableMouseInteraction: false,
        speedMultiplier: 0.65
      };
    } else if (w < 768) {
      // Small Tablet / Phablet
      return {
        particleCount: 40,
        maxConnectDistance: 75,
        enableConnections: true,
        enableMouseInteraction: false,
        speedMultiplier: 0.8
      };
    } else if (w < 1024) {
      // Tablet
      return {
        particleCount: 56,
        maxConnectDistance: 95,
        enableConnections: true,
        enableMouseInteraction: true,
        speedMultiplier: 0.95
      };
    } else {
      // Desktop / 4K
      return {
        particleCount: 82,
        maxConnectDistance: 118,
        enableConnections: true,
        enableMouseInteraction: true,
        speedMultiplier: 1.05
      };
    }
  }

  // Theme Detection
  function updateThemeState() {
    const themeAttr = document.documentElement.getAttribute('data-theme');
    isDarkMode = themeAttr === 'dark';
  }

  // Particle Constructor
  function createParticle(w, h, config) {
    const types = ['dot', 'dot', 'dot', 'droplet', 'bubble'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    // Choose color from brand palette
    const colors = [PALETTE.aqua, PALETTE.cyan, PALETTE.deepBlue, PALETTE.softHighlight];
    const color = colors[Math.floor(Math.random() * colors.length)];

    let baseRadius;
    if (type === 'bubble') {
      baseRadius = 3.2 + Math.random() * 2.4; // Slightly larger hollow bubble
    } else if (type === 'droplet') {
      baseRadius = 2.0 + Math.random() * 1.8;
    } else {
      baseRadius = 1.0 + Math.random() * 1.8; // Floating glowing dot
    }

    return {
      type: type,
      color: color,
      x: Math.random() * w,
      y: Math.random() * h,
      radius: baseRadius,
      baseRadius: baseRadius,
      // Slow upward natural buoyancy
      vy: -(0.18 + Math.random() * 0.42) * config.speedMultiplier,
      // Horizontal drift parameters
      vx: (Math.random() - 0.5) * 0.22 * config.speedMultiplier,
      waveOffset: Math.random() * Math.PI * 2,
      waveFrequency: 0.008 + Math.random() * 0.014,
      waveAmplitude: 0.35 + Math.random() * 0.65,
      // Opacity breathing
      alpha: 0.15 + Math.random() * 0.55,
      baseAlpha: 0.15 + Math.random() * 0.55,
      alphaSpeed: 0.008 + Math.random() * 0.016,
      alphaDirection: Math.random() > 0.5 ? 1 : -1
    };
  }

  // Initialize Particles Array
  function initParticles() {
    const config = getConfig();
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
      particles.push(createParticle(width, height, config));
    }
  }

  // Canvas Sizing with Retina / High-DPI Support
  function resizeCanvas() {
    if (!canvas) return;
    
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    initParticles();
  }

  // Render Loop
  let lastTime = 0;
  function render(time) {
    if (!isRunning) return;

    ctx.clearRect(0, 0, width, height);

    const config = getConfig();
    const lineAlphaMultiplier = isDarkMode ? 0.22 : 0.12;

    // 1. Draw Connected Lines Between Nearby Particles
    if (config.enableConnections) {
      const maxDist = config.maxConnectDistance;
      const maxDistSq = maxDist * maxDist;

      ctx.lineWidth = 0.75;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / maxDist) * lineAlphaMultiplier * Math.min(p1.alpha, p2.alpha);
            
            ctx.beginPath();
            ctx.strokeStyle = isDarkMode 
              ? `rgba(36, 189, 232, ${lineAlpha.toFixed(3)})` 
              : `rgba(18, 169, 214, ${lineAlpha.toFixed(3)})`;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    }

    // 2. Update and Draw Particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Subtle breathing opacity pulse
      p.alpha += p.alphaSpeed * p.alphaDirection;
      if (p.alpha > p.baseAlpha + 0.25 || p.alpha > 0.85) {
        p.alphaDirection = -1;
      } else if (p.alpha < p.baseAlpha - 0.2 || p.alpha < 0.1) {
        p.alphaDirection = 1;
      }

      // Sinusoidal floating drift
      p.y += p.vy;
      p.x += p.vx + Math.sin(time * p.waveFrequency + p.waveOffset) * (p.waveAmplitude * 0.4);

      // Mouse Gentle Water Disturbance (Desktop)
      if (config.enableMouseInteraction && mouse.active) {
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mDistSq = mdx * mdx + mdy * mdy;
        const influenceRadius = 110;
        if (mDistSq < influenceRadius * influenceRadius && mDistSq > 0) {
          const mDist = Math.sqrt(mDistSq);
          const force = (1 - mDist / influenceRadius) * 1.4;
          p.x += (mdx / mDist) * force;
          p.y += (mdy / mDist) * force;
        }
      }

      // Screen Boundary Wrap (Infinite Seamless Field)
      if (p.y < -15) {
        p.y = height + 15;
        p.x = Math.random() * width;
      } else if (p.y > height + 15) {
        p.y = -15;
        p.x = Math.random() * width;
      }

      if (p.x < -15) {
        p.x = width + 15;
      } else if (p.x > width + 15) {
        p.x = -15;
      }

      // Drawing Logic According to Type
      const currentAlpha = Math.max(0.06, Math.min(0.9, isDarkMode ? p.alpha * 1.15 : p.alpha * 0.85));

      if (p.type === 'bubble') {
        // Hollow micro water bubble with translucent rim & highlight
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = isDarkMode 
          ? `rgba(36, 189, 232, ${(currentAlpha * 0.8).toFixed(3)})` 
          : `rgba(18, 169, 214, ${(currentAlpha * 0.75).toFixed(3)})`;
        ctx.lineWidth = 1.1;
        ctx.stroke();

        // Tiny inner specular reflection gleam
        ctx.beginPath();
        ctx.arc(p.x - p.radius * 0.35, p.y - p.radius * 0.35, p.radius * 0.28, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${(currentAlpha * 0.95).toFixed(3)})`;
        ctx.fill();

      } else if (p.type === 'droplet') {
        // Soft aqua glowing droplet
        const glowRadius = p.radius * 2.8;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
        grad.addColorStop(0, `rgba(36, 189, 232, ${currentAlpha.toFixed(3)})`);
        grad.addColorStop(0.4, `rgba(18, 169, 214, ${(currentAlpha * 0.45).toFixed(3)})`);
        grad.addColorStop(1, 'rgba(18, 169, 214, 0)');

        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(234, 248, 252, ${(currentAlpha * 0.95).toFixed(3)})`;
        ctx.fill();

      } else {
        // Standard tiny floating aqua dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color === PALETTE.softHighlight
          ? `rgba(234, 248, 252, ${currentAlpha.toFixed(3)})`
          : p.color === PALETTE.cyan
            ? `rgba(36, 189, 232, ${currentAlpha.toFixed(3)})`
            : `rgba(18, 169, 214, ${currentAlpha.toFixed(3)})`;
        ctx.fill();
      }
    }

    animationFrameId = requestAnimationFrame(render);
  }

  // Draw a static frame for reduced motion mode
  function drawSingleStaticFrame() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(18, 169, 214, 0.2)';
      ctx.fill();
    }
  }

  // Start / Stop Animation Loop
  function startAnimation() {
    if (isRunning || isReducedMotion) return;
    isRunning = true;
    animationFrameId = requestAnimationFrame(render);
  }

  function stopAnimation() {
    isRunning = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  // Page Visibility Listener (Pause when tab is hidden to save CPU/GPU)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAnimation();
    } else {
      if (!isReducedMotion) {
        startAnimation();
      }
    }
  });

  // Mouse Disturbance Tracking (Passive, Desktop Only)
  if (!window.matchMedia('(pointer: coarse)').matches) {
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.active = false;
    });
  }

  // Theme Change Observer
  const themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        updateThemeState();
      }
    });
  });

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });

  // Debounced Window Resize Handler
  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
    }, 180);
  }, { passive: true });

  // DOM Initialization
  function init() {
    // Check if canvas already exists or create dynamically
    canvas = document.getElementById('bgParticlesCanvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'bgParticlesCanvas';
      canvas.className = 'bg-particles-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.prepend(canvas);
    }

    updateThemeState();
    resizeCanvas();

    if (isReducedMotion) {
      drawSingleStaticFrame();
    } else {
      startAnimation();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
