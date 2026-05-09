<template>
    <svg class="dashboard__circuit" :viewBox="`0 0 ${width} ${height}`" preserveAspectRatio="none">
      <defs>
        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
  
      <g stroke="#ff00a2" fill="none" stroke-width="2.5" filter="url(#neon-glow)" opacity="0.8">
        
        <!-- LÍNEA 1: SUPERIOR IZQUIERDA -->
        <path class="line-anim" :d="paths.L1" />
        <circle :cx="points.L1.x" :cy="points.L1.y" r="4" fill="#f472b6" />
  
        <!-- LÍNEA 2: INFERIOR IZQUIERDA -->
        <path class="line-anim line-anim--delayed" :d="paths.L2" />
        <circle :cx="points.L2.x" :cy="points.L2.y" r="4" fill="#f472b6" />
  
        <!-- LÍNEA 3: SUPERIOR DERECHA -->
        <path class="line-anim" :d="paths.L3" />
        <circle :cx="points.L3.x" :cy="points.L3.y" r="4" fill="#f472b6" />
  
        <!-- LÍNEA 4: INFERIOR DERECHA -->
        <path class="line-anim line-anim--delayed" :d="paths.L4" />
        <circle :cx="points.L4.x" :cy="points.L4.y" r="4" fill="#f472b6" />

        <!-- LÍNEA 5: CONECTA CON LA TARJETA IZQUIERDA-->
        <path class="line-anim" :d="paths.L5" />
        <circle :cx="points.L5.x" :cy="points.L5.y" r="4" fill="currentColor" />

        <!-- LÍNEA 6 (Esta termina fuera de la pantalla según tu dibujo) -->
        <path class="line-anim" :d="paths.L6" />
        <!-- Si quieres círculo al inicio de L6, agrégalo aquí -->
        <circle :cx="points.L6.x" :cy="points.L6.y" r="4" fill="currentColor" />
      </g>
    </svg>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, computed } from 'vue';
  
  const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1920);
  const height = ref(typeof window !== 'undefined' ? window.innerHeight : 1080);
  
  const updateDimensions = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  };
  
  onMounted(() => window.addEventListener('resize', updateDimensions));
  onUnmounted(() => window.removeEventListener('resize', updateDimensions));
  
  // Puntos finales donde termina cada línea (Nodos)
    const points = computed(() => {
        const isMobile = width.value < 768;
        const marginSide = isMobile ? width.value * 0.1 : width.value * 0.35;

        return {
            L1: { x: marginSide, y: height.value * 0.22 },
            L2: { x: marginSide - 100, y: height.value * 0.45 },
            L3: { x: width.value - marginSide, y: height.value * 0.22 },
            L4: { x: width.value - (marginSide - 100), y: height.value * 0.40 },
            // NUEVAS LÍNEAS
            L5: { x: marginSide - 50, y: height.value * 0.75 }, // Conecta con la tarjeta izquierda
            L6: { x: width.value - (marginSide - 50), y: height.value * 0.85 } // Baja hacia el lateral derecho
        };
    });
  
  // Dibujo de los caminos (Paths) basados en los puntos
    const paths = computed(() => {
        const p = points.value;
        const w = width.value;

        return {
            L1: `M -50,${p.L1.y - 30} L 100,${p.L1.y - 30} L 130,${p.L1.y} L ${p.L1.x},${p.L1.y}`,
            L2: `M -50,${p.L2.y - 120} L 80,${p.L2.y - 120} L 130,${p.L2.y} L ${p.L2.x},${p.L2.y}`,
            L3: `M ${w + 50},${p.L3.y - 30} L ${w - 100},${p.L3.y - 30} L ${w - 130},${p.L3.y} L ${p.L3.x},${p.L3.y}`,
            L4: `M ${w + 50},${p.L4.y - 120} L ${w - 80},${p.L4.y - 120} L ${w - 130},${p.L4.y} L ${p.L4.x},${p.L4.y}`,
            
            // NUEVA L5: Viene desde abajo a la izquierda y sube un poco hacia la tarjeta
            L5: `M -50,${p.L5.y + 50} L 50,${p.L5.y + 50} L 100,${p.L5.y} L ${p.L5.x},${p.L5.y}`,
            
            // NUEVA L6: Viene desde el centro-derecha y baja hacia el borde exterior
            L6: `M ${p.L6.x},${p.L6.y} L ${p.L6.x + 80},${p.L6.y} L ${p.L6.x + 130},${p.L6.y + 100} L ${w + 50},${p.L6.y + 100}`
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
    /* Desvanecimiento inferior para no ensuciar la siguiente sección */
    mask-image: linear-gradient(to bottom, black 0%, black 70%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, black 0%, black 70%, transparent 100%);
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
  