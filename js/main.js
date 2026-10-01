/**
 * DAEvol Consulting Website - Core Interactivity
 * Pure Vanilla JavaScript (Zero External Dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initFaqAccordion();
  initTabs();
  initDiscoveryModal();
  initForms();
});

/* 1. Sticky Header with Scroll Shadow */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* 2. Mobile Menu Toggle */
function initMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!mobileToggle || !navMenu) return;

  mobileToggle.addEventListener('click', () => {
    const isExpanded = navMenu.classList.toggle('mobile-open');
    mobileToggle.setAttribute('aria-expanded', isExpanded);
    mobileToggle.innerHTML = isExpanded ? '✕' : '☰';
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('mobile-open')) {
      navMenu.classList.remove('mobile-open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.innerHTML = '☰';
    }
  });
}

/* 3. Accessible FAQ Accordion */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-button');
    if (!button) return;

    button.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Optional: Close other open FAQs
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          const btn = other.querySelector('.faq-button');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });

      if (isActive) {
        item.classList.remove('active');
        button.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* 4. Tab Switcher for Capabilities & Services */
function initTabs() {
  const tabContainers = document.querySelectorAll('[data-tabs]');
  if (!tabContainers.length) return;

  tabContainers.forEach((container) => {
    const buttons = container.querySelectorAll('.tab-btn');
    const targetGroup = container.getAttribute('data-tabs');
    const panels = document.querySelectorAll(`[data-tab-group="${targetGroup}"]`);

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tabTarget = btn.getAttribute('data-target');

        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        panels.forEach((panel) => {
          if (tabTarget === 'all' || panel.getAttribute('data-tab-name') === tabTarget) {
            panel.style.display = '';
          } else {
            panel.style.display = 'none';
          }
        });
      });
    });
  });
}

/* 5. 30-Minute Discovery Call Modal */
function initDiscoveryModal() {
  const modal = document.getElementById('discoveryModal');
  const openButtons = document.querySelectorAll('[data-open-modal="discovery"]');
  const closeButtons = document.querySelectorAll('[data-close-modal]');

  if (!modal) return;

  openButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      const firstInput = modal.querySelector('input');
      if (firstInput) firstInput.focus();
    });
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* 6. Form Handling & Interactive Feedback */
function initForms() {
  const forms = document.querySelectorAll('form[data-ajax-form]');

  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerText : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Processing...';
      }

      // Simulate instantaneous submission feedback
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = '✓ Success!';
        }
        form.reset();

        const successNotice = document.createElement('div');
        successNotice.style.cssText = `
          margin-top: 1rem;
          padding: 0.875rem 1.25rem;
          background-color: #ECFDF5;
          border: 1px solid #10B981;
          color: #065F46;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 600;
        `;
        successNotice.innerText = 'Thank you! Your request has been received. A senior DAEvol advisor will contact you within 1 business day.';
        form.appendChild(successNotice);

        setTimeout(() => {
          successNotice.remove();
          if (submitBtn) submitBtn.innerText = originalText;
          const modal = form.closest('.modal-overlay');
          if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
          }
        }, 3500);
      }, 700);
    });
  });
}
