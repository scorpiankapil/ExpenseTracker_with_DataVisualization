function openModal() {
  const backdrop = document.getElementById('modalBackdrop');
  if (backdrop) {
    backdrop.classList.add('open');
    feather.replace();
  }
}

function closeModal() {
  const backdrop = document.getElementById('modalBackdrop');
  if (backdrop) backdrop.classList.remove('open');
}

function closeModalOutside(e) {
  if (e.target && e.target.id === 'modalBackdrop') closeModal();
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
    const budgetModal = document.getElementById('budgetModal');
    if (budgetModal) budgetModal.classList.remove('open');
  }
});


function setType(type) {
  const typeInput = document.getElementById('txTypeInput');
  if (typeInput) typeInput.value = type;

  const expBtn = document.getElementById('expBtn');
  const incBtn = document.getElementById('incBtn');
  if (!expBtn || !incBtn) return;

  expBtn.className = 'type-btn';
  incBtn.className = 'type-btn';

  if (type === 'expense') {
    expBtn.classList.add('active-expense');
  } else {
    incBtn.classList.add('active-income');
  }
}


function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = {
    success: '✓',
    error:   '✗',
    info:    'ℹ',
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-msg">${message}</span>
    <span class="toast-close" onclick="this.parentElement.remove()">×</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.animation = 'toastOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }
  }, 3500);
}


const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar       = document.getElementById('sidebar');
const overlay       = document.getElementById('sidebarOverlay');

if (sidebarToggle) {
  sidebarToggle.addEventListener('click', function() {
    sidebar.classList.toggle('open');
    overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
  });
}

function closeSidebar() {
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.style.display = 'none';
}


function animateCount(el, target, duration = 900) {
  if (!el) return;
  const start     = 0;
  const startTime = performance.now();

  function tick(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(start + (target - start) * eased);
    el.textContent = '₹' + current.toLocaleString('en-IN');
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

document.addEventListener('DOMContentLoaded', function() {
  const amountEls = document.querySelectorAll('.card-amount');
  amountEls.forEach(function(el) {
    const raw = el.textContent.replace(/[^0-9]/g, '');
    if (raw && !isNaN(raw) && parseInt(raw) > 100) {
      animateCount(el, parseInt(raw));
    }
  });
});


function formatINR(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}
