/**
 * main.js — ExpenseIQ
 * ────────────────────
 * Utility functions shared across all app pages.
 * 
 * Contents:
 *   1. Modal open/close
 *   2. Transaction type toggle (Expense / Income)
 *   3. Toast notifications
 *   4. Sidebar mobile toggle
 *   5. Number counter animation
 */


/* ════════════════════════════════════════════
   1. MODAL HELPERS
════════════════════════════════════════════ */

// Open the Add Transaction modal
function openModal() {
  const backdrop = document.getElementById('modalBackdrop');
  if (backdrop) {
    backdrop.classList.add('open');
    feather.replace();  // re-render feather icons inside modal
  }
}

// Close the modal
function closeModal() {
  const backdrop = document.getElementById('modalBackdrop');
  if (backdrop) backdrop.classList.remove('open');
}

// Close modal when clicking outside the box
function closeModalOutside(e) {
  if (e.target && e.target.id === 'modalBackdrop') closeModal();
}

// Close on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
    // Also close budget modal if open
    const budgetModal = document.getElementById('budgetModal');
    if (budgetModal) budgetModal.classList.remove('open');
  }
});


/* ════════════════════════════════════════════
   2. TRANSACTION TYPE TOGGLE
   Switches between Expense / Income in modal
════════════════════════════════════════════ */
function setType(type) {
  // Update hidden input value
  const typeInput = document.getElementById('txTypeInput');
  if (typeInput) typeInput.value = type;

  const expBtn = document.getElementById('expBtn');
  const incBtn = document.getElementById('incBtn');
  if (!expBtn || !incBtn) return;

  // Reset both buttons
  expBtn.className = 'type-btn';
  incBtn.className = 'type-btn';

  // Activate the selected one
  if (type === 'expense') {
    expBtn.classList.add('active-expense');
  } else {
    incBtn.classList.add('active-income');
  }
}


/* ════════════════════════════════════════════
   3. TOAST NOTIFICATIONS
   showToast(message, type)
   type: 'success' | 'error' | 'info'
════════════════════════════════════════════ */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  // Icons for each type
  const icons = {
    success: '✓',
    error:   '✗',
    info:    'ℹ',
  };

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-msg">${message}</span>
    <span class="toast-close" onclick="this.parentElement.remove()">×</span>
  `;

  container.appendChild(toast);

  // Auto remove after 3.5 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.animation = 'toastOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }
  }, 3500);
}


/* ════════════════════════════════════════════
   4. SIDEBAR MOBILE TOGGLE
   Used for small screens where sidebar is hidden
════════════════════════════════════════════ */
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


/* ════════════════════════════════════════════
   5. NUMBER COUNTER ANIMATION
   Animates numbers counting up on page load.
   Makes summary cards feel alive.
════════════════════════════════════════════ */
function animateCount(el, target, duration = 900) {
  if (!el) return;
  const start     = 0;
  const startTime = performance.now();

  function tick(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic curve
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(start + (target - start) * eased);
    el.textContent = '₹' + current.toLocaleString('en-IN');
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// Run counter animation on all summary card amounts
document.addEventListener('DOMContentLoaded', function() {
  const amountEls = document.querySelectorAll('.card-amount');
  amountEls.forEach(function(el) {
    // Extract number from text like "₹42,500" or "34%"
    const raw = el.textContent.replace(/[^0-9]/g, '');
    if (raw && !isNaN(raw) && parseInt(raw) > 100) {
      animateCount(el, parseInt(raw));
    }
  });
});


/* ════════════════════════════════════════════
   BONUS: Format rupee amounts
   Usage: formatINR(42500) → "₹42,500"
════════════════════════════════════════════ */
function formatINR(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}
