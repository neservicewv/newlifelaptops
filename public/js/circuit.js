// circuit.js – Animated circuit board canvas background
// New Life Laptops

class CircuitBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.animFrameId = null;
    this.config = {
      nodeCount: 60,
      maxDistance: 180,
      speed: 0.4,
    };
    this.resize();
    this.init();
    this.animate();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.config.nodeCount = Math.max(30, Math.min(80, Math.floor(window.innerWidth * window.innerHeight / 14000)));
    if (this.nodes && this.nodes.length > 0) {
      this.nodes.forEach(node => {
        if (node.x > this.canvas.width) node.x = Math.random() * this.canvas.width;
        if (node.y > this.canvas.height) node.y = Math.random() * this.canvas.height;
      });
    }
  }

  init() {
    this.nodes = [];
    for (let i = 0; i < this.config.nodeCount; i++) {
      this.nodes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.config.speed,
        vy: (Math.random() - 0.5) * this.config.speed,
        radius: Math.random() * 1.5 + 1,
        pulseRadius: 0,
        pulseSpeed: Math.random() * 0.25 + 0.1,
        pulsing: Math.random() < 0.25,
        brightness: Math.random() * 0.5 + 0.5,
      });
    }
  }

  drawGrid() {
    const { ctx, canvas } = this;
    const gridSize = 60;
    ctx.strokeStyle = 'rgba(0,168,255,0.03)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
  }

  drawConnections() {
    const { ctx, nodes, config } = this;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < config.maxDistance) {
          const opacity = (1 - dist / config.maxDistance) * 0.35;
          const midX = a.x + dx / 2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(midX, a.y);
          ctx.lineTo(midX, b.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0,168,255,${opacity})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(midX, a.y, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,168,255,${opacity * 1.8})`;
          ctx.fill();
        }
      }
    }
  }

  drawNodes() {
    const { ctx, nodes } = this;
    nodes.forEach(node => {
      const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 5);
      grad.addColorStop(0, `rgba(0,168,255,${node.brightness * 0.5})`);
      grad.addColorStop(1, 'rgba(0,168,255,0)');
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * 5, 0, Math.PI * 2);
      ctx.fillStyle = grad; ctx.fill();
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,168,255,${node.brightness})`;
      ctx.fill();
      if (node.pulsing) {
        node.pulseRadius += node.pulseSpeed;
        if (node.pulseRadius > 22) node.pulseRadius = 0;
        if (node.pulseRadius > 0) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.pulseRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0,168,255,${(1 - node.pulseRadius / 22) * 0.45})`;
          ctx.lineWidth = 1; ctx.stroke();
        }
      }
    });
  }

  updateNodes() {
    const { nodes, canvas } = this;
    nodes.forEach(node => {
      node.x += node.vx; node.y += node.vy;
      if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      node.x = Math.max(0, Math.min(canvas.width, node.x));
      node.y = Math.max(0, Math.min(canvas.height, node.y));
    });
  }

  animate() {
    if (!this.canvas || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();
    this.drawConnections();
    this.updateNodes();
    this.drawNodes();
    this.animFrameId = requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CircuitBackground('circuit-bg');
});
