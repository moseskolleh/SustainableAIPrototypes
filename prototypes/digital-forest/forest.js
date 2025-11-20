// Digital Carbon Forest - JavaScript

class Tree {
  constructor(x, y, department, health = 100) {
    this.x = x;
    this.y = y;
    this.department = department;
    this.health = Math.max(0, Math.min(100, health));
    this.size = (this.health / 100) * 80 + 20;
    this.swayOffset = Math.random() * Math.PI * 2;
    this.leaves = [];
    this.generateLeaves();
  }

  generateLeaves() {
    const leafCount = Math.floor((this.health / 100) * 30) + 5;
    this.leaves = [];
    for (let i = 0; i < leafCount; i++) {
      this.leaves.push({
        x: (Math.random() - 0.5) * this.size,
        y: -Math.random() * this.size,
        size: Math.random() * 8 + 4,
        angle: Math.random() * Math.PI * 2
      });
    }
  }

  update(time) {
    // Gentle swaying animation
    this.swayOffset = Math.sin(time / 1000 + this.x) * 2;
  }

  draw(ctx, time) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.swayOffset * 0.01);

    // Trunk
    const trunkHeight = this.size;
    const trunkWidth = this.size * 0.2;

    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-trunkWidth / 2, 0, trunkWidth, trunkHeight);

    // Leaves/Crown
    ctx.translate(0, -trunkHeight * 0.3);

    this.leaves.forEach(leaf => {
      const healthColor = this.getHealthColor();
      ctx.fillStyle = healthColor;
      ctx.beginPath();
      ctx.arc(
        leaf.x + Math.sin(time / 500 + leaf.angle) * 2,
        leaf.y + Math.cos(time / 700 + leaf.angle) * 2,
        leaf.size,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });

    ctx.restore();
  }

  getHealthColor() {
    if (this.health > 80) return '#4A7C2F'; // Healthy green
    if (this.health > 60) return '#7EC850'; // Light green
    if (this.health > 40) return '#F5A623'; // Yellow/Orange
    return '#8B4513'; // Brown (unhealthy)
  }

  getInfo() {
    return {
      department: this.department,
      health: Math.round(this.health),
      status: this.health > 80 ? 'Thriving' : this.health > 60 ? 'Healthy' : this.health > 40 ? 'Moderate' : 'Needs Care'
    };
  }
}

class DigitalForest {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.trees = [];
    this.time = 0;
    this.hoveredTree = null;

    this.init();
    this.setupEventListeners();
    this.animate();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Create initial forest
    this.generateForest();
  }

  resizeCanvas() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  generateForest() {
    const departments = ['IT', 'Finance', 'HR', 'Legal', 'Operations'];
    const healthLevels = [85, 78, 65, 45, 72];

    const width = this.canvas.width;
    const height = this.canvas.height;

    // Create trees in a grid pattern with some randomness
    const treesPerRow = 8;
    const rows = 4;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < treesPerRow; col++) {
        const x = (width / (treesPerRow + 1)) * (col + 1) + (Math.random() - 0.5) * 30;
        const y = height - 100 - (row * 120) + (Math.random() - 0.5) * 20;
        const deptIndex = Math.floor(Math.random() * departments.length);

        this.trees.push(new Tree(x, y, departments[deptIndex], healthLevels[deptIndex]));
      }
    }
  }

  setupEventListeners() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let foundTree = null;
      for (const tree of this.trees) {
        const dx = mouseX - tree.x;
        const dy = mouseY - tree.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < tree.size / 2) {
          foundTree = tree;
          break;
        }
      }

      if (foundTree !== this.hoveredTree) {
        this.hoveredTree = foundTree;
        if (foundTree) {
          this.showTooltip(foundTree, mouseX, mouseY);
        } else {
          this.hideTooltip();
        }
      }
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.hoveredTree = null;
      this.hideTooltip();
    });
  }

  showTooltip(tree, x, y) {
    const tooltip = document.getElementById('tooltip');
    const info = tree.getInfo();

    document.getElementById('tooltipTitle').textContent = `${info.department} Department`;
    document.getElementById('tooltipText').textContent = `Health: ${info.health}% • Status: ${info.status}`;

    tooltip.style.display = 'block';
    tooltip.style.left = `${x + 20}px`;
    tooltip.style.top = `${y - 60}px`;
  }

  hideTooltip() {
    document.getElementById('tooltip').style.display = 'none';
  }

  update(deltaTime) {
    this.time += deltaTime;

    this.trees.forEach(tree => tree.update(this.time));

    // Randomly update tree health (simulate activity)
    if (Math.random() < 0.01) {
      const randomTree = this.trees[Math.floor(Math.random() * this.trees.length)];
      randomTree.health = Math.min(100, randomTree.health + (Math.random() - 0.3) * 2);
      randomTree.generateLeaves();
    }
  }

  draw() {
    // Clear canvas with gradient sky
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.5, '#E0F6FF');
    gradient.addColorStop(1, '#7EC850');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw ground
    this.ctx.fillStyle = '#8B7355';
    this.ctx.fillRect(0, this.canvas.height - 50, this.canvas.width, 50);

    // Draw trees (sorted by y position for proper layering)
    const sortedTrees = [...this.trees].sort((a, b) => a.y - b.y);
    sortedTrees.forEach(tree => tree.draw(this.ctx, this.time));

    // Draw hovered tree highlight
    if (this.hoveredTree) {
      this.ctx.save();
      this.ctx.globalAlpha = 0.3;
      this.ctx.fillStyle = '#FFD700';
      this.ctx.beginPath();
      this.ctx.arc(this.hoveredTree.x, this.hoveredTree.y - this.hoveredTree.size / 2, this.hoveredTree.size / 2 + 10, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  animate(currentTime = 0) {
    const deltaTime = currentTime - (this.lastTime || currentTime);
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.draw();

    requestAnimationFrame((time) => this.animate(time));
  }

  // Public methods to interact with forest
  plantTree(department, x, y, health = 100) {
    this.trees.push(new Tree(x || Math.random() * this.canvas.width, y || this.canvas.height - 150, department, health));
  }

  getForestHealth() {
    const totalHealth = this.trees.reduce((sum, tree) => sum + tree.health, 0);
    return Math.round(totalHealth / this.trees.length);
  }
}

// Initialize forest
let forest;
document.addEventListener('DOMContentLoaded', () => {
  forest = new DigitalForest('forestCanvas');

  // Setup button interactions
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const text = e.currentTarget.textContent.trim();

      if (text.includes('Plant a Tree')) {
        const x = Math.random() * forest.canvas.width;
        const y = forest.canvas.height - 100 - Math.random() * 200;
        forest.plantTree('New', x, y, 100);
        showNotification('Tree planted! 🌱', 'success');
      } else if (text.includes('Take Quiz')) {
        showNotification('Quiz coming soon!', 'info');
      } else if (text.includes('View Details')) {
        const health = forest.getForestHealth();
        showNotification(`Forest Health: ${health}%`, 'info');
      }
    });
  });

  // Update weather based on overall forest health
  setInterval(() => {
    const health = forest.getForestHealth();
    const weatherDiv = document.getElementById('weather');
    const icon = weatherDiv.querySelector('.weather-icon');
    const text = weatherDiv.querySelector('.weather-text');

    if (health > 80) {
      icon.textContent = '☀️';
      text.textContent = 'Thriving Forest';
      weatherDiv.style.background = 'rgba(232, 245, 224, 0.9)';
    } else if (health > 60) {
      icon.textContent = '⛅';
      text.textContent = 'Healthy Forest';
      weatherDiv.style.background = 'rgba(255, 249, 230, 0.9)';
    } else if (health > 40) {
      icon.textContent = '🌧️';
      text.textContent = 'Needs Care';
      weatherDiv.style.background = 'rgba(255, 230, 230, 0.9)';
    } else {
      icon.textContent = '⛈️';
      text.textContent = 'Critical';
      weatherDiv.style.background = 'rgba(255, 200, 200, 0.9)';
    }
  }, 5000);
});

// Utility function for notifications
function showNotification(message, type = 'info') {
  const colors = {
    success: '#27AE60',
    info: '#4A90E2',
    warning: '#F5A623',
    error: '#E74C3C'
  };

  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    padding: 16px 24px;
    background: ${colors[type]};
    color: white;
    border-radius: 12px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    animation: slideInRight 0.3s ease-out;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
