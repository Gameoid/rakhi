// === PAGE NAVIGATION LOGIC ===
function goToSlide(slideId) {
  const slides = document.querySelectorAll('.slide');
  
  slides.forEach((slide) => {
    slide.classList.remove('active');
  });

  setTimeout(() => {
    const target = document.getElementById(slideId);
    if (target) {
      target.classList.add('active');
      
      // CONFETTI CANNON FOR THE AWARD SLIDE
      if(slideId === 'slide-gift-1-award') {
        fireConfetti();
      }
    }
  }, 10);
}

// === CONFETTI CANNON ===
function fireConfetti() {
  var duration = 3 * 1000;
  var end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#ff6b81']
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#ff6b81']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}

// === MUSIC PLAYER LOGIC ===
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
let isPlaying = false;

musicToggle.addEventListener('click', () => {
  if (!isPlaying) {
    bgMusic.play().then(() => {
      isPlaying = true;
      musicToggle.innerText = '⏸ Pause Song';
      musicToggle.style.background = '#2ed573';
    }).catch(err => {
      console.log('Audio playback prevented:', err);
    });
  } else {
    bgMusic.pause();
    isPlaying = false;
    musicToggle.innerText = '🎵 Play Song';
    musicToggle.style.background = '#ff4757';
  }
});

// === DRAGGABLE SCRAPBOOK PHOTOS ===
const draggables = document.querySelectorAll('.draggable');

draggables.forEach(item => {
  let isDragging = false;
  let startX, startY, initialX, initialY;
  
  item.style.position = 'relative'; 

  item.addEventListener('mousedown', dragStart);
  item.addEventListener('touchstart', dragStart, {passive: false});
  document.addEventListener('mousemove', drag);
  document.addEventListener('touchmove', drag, {passive: false});
  document.addEventListener('mouseup', dragEnd);
  document.addEventListener('touchend', dragEnd);

  function dragStart(e) {
    if (e.target !== item && !item.contains(e.target)) return;
    if (e.type === 'touchstart') e.preventDefault();
    
    initialX = item.offsetLeft;
    initialY = item.offsetTop;
    
    if (e.type === 'touchstart') {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    } else {
      startX = e.clientX;
      startY = e.clientY;
    }

    isDragging = true;
    item.classList.add('dragging'); 
  }

  function drag(e) {
    if (!isDragging) return;
    e.preventDefault();

    let currentX, currentY;
    if (e.type === 'touchmove') {
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
    } else {
      currentX = e.clientX;
      currentY = e.clientY;
    }

    let diffX = currentX - startX;
    let diffY = currentY - startY;

    item.style.left = initialX + diffX + 'px';
    item.style.top = initialY + diffY + 'px';
  }

  function dragEnd(e) {
    if (!isDragging) return;
    initialX = item.offsetLeft;
    initialY = item.offsetTop;
    isDragging = false;
    item.classList.remove('dragging');
  }
});

// === FLOATING PARTICLES LOGIC ===
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); 

const particlesArray = [];
const colors = ['rgba(255, 107, 129, 0.4)', 'rgba(255, 190, 118, 0.4)', 'rgba(235, 77, 75, 0.3)'];

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 5 + 2; 
    this.speedX = Math.random() * 1 - 0.5; 
    this.speedY = Math.random() * 1 - 0.5;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.type = Math.random() > 0.3 ? 'circle' : 'heart';
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
    if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    
    if (this.type === 'circle') {
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const x = this.x;
      const y = this.y;
      const s = this.size * 0.8;
      
      ctx.moveTo(x, y + s / 4);
      ctx.quadraticCurveTo(x, y, x - s / 2, y);
      ctx.quadraticCurveTo(x - s, y, x - s, y + s / 1.5);
      ctx.quadraticCurveTo(x - s, y + s * 1.5, x, y + s * 2.5);
      ctx.quadraticCurveTo(x + s, y + s * 1.5, x + s, y + s / 1.5);
      ctx.quadraticCurveTo(x + s, y, x + s / 2, y);
      ctx.quadraticCurveTo(x, y, x, y + s / 4);
      ctx.fill();
    }
  }
}

function initParticles() {
  for (let i = 0; i < 45; i++) {
    particlesArray.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();
  }
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();