<template>
    <svg class="dashboard__circuit" :viewBox="`0 0 ${width} ${height}`" preserveAspectRatio="none">
      <g stroke="#ff00a2" fill="none" stroke-width="2.5" opacity="0.8">

        <path class="line-anim" :d="paths.L1" />
        <circle :cx="points.L1.x" :cy="points.L1.y" r="4" fill="#f472b6" />
        <path class="line-anim line-anim--delayed" :d="paths.L2" />
        <circle :cx="points.L2.x" :cy="points.L2.y" r="4" fill="#f472b6" />
        <path class="line-anim" :d="paths.L3" />
        <circle :cx="points.L3.x" :cy="points.L3.y" r="4" fill="#f472b6" />
        <path class="line-anim line-anim--delayed" :d="paths.L4" />
        <circle :cx="points.L4.x" :cy="points.L4.y" r="4" fill="#f472b6" />
        <path class="line-anim" :d="paths.L5" />
        <circle :cx="points.L5.x" :cy="points.L5.y" r="4" fill="currentColor" />
        <path class="line-anim" :d="paths.L6" />
        <circle :cx="points.L6.x" :cy="points.L6.y" r="4" fill="currentColor" />
      </g>
    </svg>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, computed } from 'vue';
  
const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1920);
const height = ref(typeof window !== 'undefined' ? window.innerHeight : 1080);

let resizeTimer = null;
const updateDimensions = () => {
  if (resizeTimer) return;
  resizeTimer = setTimeout(() => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
    resizeTimer = null;
  }, 150);
};
  
  onMounted(() => window.addEventListener('resize', updateDimensions, { passive: true }));
  onUnmounted(() => {
    window.removeEventListener('resize', updateDimensions);
    if (resizeTimer) clearTimeout(resizeTimer);
  });
  
  const points = computed(() => {
    const w = width.value;
    const h = height.value;
    const isMobile = w < 768;
    const marginSide = isMobile ? w * 0.05 : w * 0.35;
    const offset = isMobile ? w * 0.08 : 100;

    return {
      L1: { x: marginSide, y: h * 0.22 },
      L2: { x: marginSide - offset, y: h * 0.45 },
      L3: { x: w - marginSide, y: h * 0.22 },
      L4: { x: w - (marginSide - offset), y: h * 0.40 },
      L5: { x: marginSide - offset * 0.5, y: h * 0.75 },
      L6: { x: w - (marginSide - offset * 0.5), y: h * 0.85 }
    };
  });

  const paths = computed(() => {
    const p = points.value;
    const w = width.value;
    const isMobile = w < 768;
    const o = isMobile ? w * 0.05 : 50;
    const o2 = o * 2;
    const o3 = o * 2.6;

    return {
      L1: `M ${-o},${p.L1.y - o * 0.6} L ${o2},${p.L1.y - o * 0.6} L ${o3},${p.L1.y} L ${p.L1.x},${p.L1.y}`,
      L2: `M ${-o},${p.L2.y - o * 2.4} L ${o * 1.6},${p.L2.y - o * 2.4} L ${o3},${p.L2.y} L ${p.L2.x},${p.L2.y}`,
      L3: `M ${w + o},${p.L3.y - o * 0.6} L ${w - o2},${p.L3.y - o * 0.6} L ${w - o3},${p.L3.y} L ${p.L3.x},${p.L3.y}`,
      L4: `M ${w + o},${p.L4.y - o * 2.4} L ${w - o * 1.6},${p.L4.y - o * 2.4} L ${w - o3},${p.L4.y} L ${p.L4.x},${p.L4.y}`,
      L5: `M ${-o},${p.L5.y + o} L ${o},${p.L5.y + o} L ${o2},${p.L5.y} L ${p.L5.x},${p.L5.y}`,
      L6: `M ${p.L6.x},${p.L6.y} L ${p.L6.x + o * 1.6},${p.L6.y} L ${p.L6.x + o3},${p.L6.y + o * 2} L ${w + o},${p.L6.y + o * 2}`
    };
  });
  </script>
  
  <style scoped>
  .dashboard__circuit {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    mask-image: linear-gradient(to bottom, black 0%, black 70%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, black 0%, black 70%, transparent 100%);
    filter: drop-shadow(0 0 4px rgba(255, 0, 162, 0.5));
  }
  
  .line-anim {
    stroke-dasharray: 1200;
    stroke-dashoffset: 1200;
    animation: flux 8s ease-in-out infinite;
  }
  
  .line-anim--delayed {
    animation-delay: 3s;
  }
  
  @keyframes flux {
    0% { stroke-dashoffset: 1200; opacity: 0; }
    15% { opacity: 0.6; }
    45%, 85% { stroke-dashoffset: 0; opacity: 0.6; }
    100% { stroke-dashoffset: 0; opacity: 0; }
  }
  </style>
  