document.addEventListener('DOMContentLoaded', () => {
  console.log('Fog animation script loaded');
  
  // Check if VANTA is available
  if (typeof VANTA === 'undefined') {
    console.error('VANTA is not defined. Make sure vanta.fog.min.js is loaded correctly.');
    return;
  }
  
  // Check if the fog element exists
  const fogElement = document.getElementById('vanta-fog');
  if (!fogElement) {
    console.error('Fog element not found. Make sure the element with id "vanta-fog" exists.');
    return;
  }
  
  console.log('Initializing VANTA.FOG effect');
  
  // Initialize vanta.js fog effect with depth parameters
  const fogEffect = VANTA.FOG({
    el: fogElement,
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    highlightColor: 0xd8e1e9, // Light blue-white
    midtoneColor: 0xb8c6d1,   // Medium gray-blue
    lowlightColor: 0x8fa3b0,  // Darker gray-blue
    baseColor: 0xffffff,      // White base
    blurFactor: 0.4,          // Reduced blur for more visibility at the top
    speed: 0.3,               // Slower speed for subtle movement
    zoom: 1.2,                // Increased zoom for more visibility
    density: 0.7,             // Increased density for more visible fog
    amplitudeFactor: 2.0,     // Increased amplitude for more vertical movement
    speedFactor: 1.5          // Varied speed for depth perception
  });
  
  console.log('VANTA.FOG effect initialized');

  // Scroll persistence
  const main = document.querySelector('main');
  main.addEventListener('scroll', () => {
    const scrollPos = main.scrollTop;
    const pageHeight = document.getElementById('landing').offsetHeight;
    const fog = document.getElementById('vanta-fog');
    
    if (scrollPos < pageHeight * 2) {
      fog.style.opacity = Math.max(0, 1 - scrollPos / (pageHeight * 2));
    } else {
      fog.style.opacity = 0;
    }
  });

  // Mouse interaction - brushing away fog
  let mouseTrail = [];
  const trailLength = 10;
  let isInteracting = false;
  let resetTimeout;

  // Detect if device might struggle with performance
  const isLowPerfDevice = () => {
    return window.navigator.userAgent.indexOf('Mobile') !== -1 || 
           window.navigator.userAgent.indexOf('Android') !== -1;
  };

  const simplifiedInteraction = isLowPerfDevice();
  
  // Default mask
  const defaultMask = 'radial-gradient(circle at 50% 40%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.7) 45%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.7) 80%)';
  fogElement.style.maskImage = defaultMask;
  fogElement.style.webkitMaskImage = defaultMask;

  // Function to update mask based on mouse/touch position
  const updateMask = (x, y) => {
    isInteracting = true;
    clearTimeout(resetTimeout);
    
    // Add current position to trail
    mouseTrail.push({x, y});
    
    // Keep trail at fixed length
    if (mouseTrail.length > trailLength) {
      mouseTrail.shift();
    }
    
    // Create dynamic mask based on trail
    if (mouseTrail.length > 1) {
      if (simplifiedInteraction) {
        // Simpler interaction for lower-performance devices
        const point = mouseTrail[mouseTrail.length - 1];
        const mask = `radial-gradient(circle at ${point.x * 100}% ${point.y * 100}%, rgba(0,0,0,0) 20%, rgba(0,0,0,1) 30%)`;
        fogElement.style.maskImage = mask;
        fogElement.style.webkitMaskImage = mask;
      } else {
        // Full trail effect for higher-performance devices
        const gradients = mouseTrail.map((point, index) => {
          const size = 15 * (index / trailLength); // Smaller at the end of trail
          return `radial-gradient(circle at ${point.x * 100}% ${point.y * 100}%, rgba(0,0,0,0) ${size}%, rgba(0,0,0,1) ${size + 5}%)`;
        });
        
        fogElement.style.maskImage = gradients.join(', ');
        fogElement.style.webkitMaskImage = gradients.join(', ');
      }
    }
  };

  // Function to reset mask to default
  const resetMask = () => {
    resetTimeout = setTimeout(() => {
      fogElement.style.maskImage = defaultMask;
      fogElement.style.webkitMaskImage = defaultMask;
      mouseTrail = [];
      isInteracting = false;
    }, 1000);
  };

  // Mouse events
  fogElement.addEventListener('mousemove', (e) => {
    const rect = fogElement.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    updateMask(x, y);
  });

  fogElement.addEventListener('mouseleave', resetMask);

  // Touch events for mobile
  fogElement.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent scrolling while interacting with fog
    
    const rect = fogElement.getBoundingClientRect();
    const touch = e.touches[0];
    const x = (touch.clientX - rect.left) / rect.width;
    const y = (touch.clientY - rect.top) / rect.height;
    
    updateMask(x, y);
  });

  fogElement.addEventListener('touchend', resetMask);
});
