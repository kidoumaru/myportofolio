
/**
 * Portfolio - Mahardika Bintang Ramadhan
 * Pure Vanilla JavaScript (No Frameworks)
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Mobile Menu Drawer Navigation ---
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const navToggleIcon = navToggle ? navToggle.querySelector('i') : null;

  function toggleMobileMenu() {
    if (!mobileMenu) return;
    const isOpen = mobileMenu.classList.contains('open');

    if (isOpen) {
      mobileMenu.classList.remove('open');
      if (navToggleIcon) {
        navToggleIcon.classList.remove('fa-xmark');
        navToggleIcon.classList.add('fa-bars');
      }
    } else {
      mobileMenu.classList.add('open');
      if (navToggleIcon) {
        navToggleIcon.classList.remove('fa-bars');
        navToggleIcon.classList.add('fa-xmark');
      }
    }
  }

  if (navToggle) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      if (
        !mobileMenu.contains(e.target) &&
        (!navToggle || !navToggle.contains(e.target))
      ) {
        toggleMobileMenu();
      }
    }
  });

  // Close mobile menu on clicking any navigation link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  // --- 2. Navbar Hide/Show On Scroll & Sticky Blur ---
  const header = document.querySelector('.header');
  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    const currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > 100) {
      if (currentScroll > lastScrollTop) {
        // Scrolling down -> hide header
        if (header) header.style.top = '-90px';
      } else {
        // Scrolling up -> show header
        if (header) header.style.top = '0';
      }
    } else {
      if (header) header.style.top = '0';
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;

    // --- 3. Active Nav Link on Scroll ---
    highlightActiveNavLink();
  }, { passive: true });

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  function highlightActiveNavLink() {
    const scrollY = window.pageYOffset + 180;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');

      if (
        scrollY > sectionTop &&
        scrollY <= sectionTop + sectionHeight
      ) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  // Initial highlight call
  highlightActiveNavLink();

  // --- 4. 3D Tilt Interaction for Hexagons ---
  const tiltHexagons = document.querySelectorAll('.hex-wrapper');

  tiltHexagons.forEach(wrapper => {
    const outer = wrapper.querySelector('.hex-outer');
    if (!outer) return;

    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const percentX = (x - centerX) / centerX;
      const percentY = (y - centerY) / centerY;

      const rotateX = -percentY * 12;
      const rotateY = percentX * 12;

      outer.style.transform =
        `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;

      outer.style.transition = 'none';
    });

    wrapper.addEventListener('mouseleave', () => {
      outer.style.transition =
        'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';

      outer.style.transform =
        'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // --- 5. Contact Form Submission Handler ---
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const messageInput = document.getElementById('contact-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !message) {
        showToast('Silakan lengkapi semua kolom formulir.');
        return;
      }

      // Format mailto link
      const subject = encodeURIComponent(
        `Pesan dari Portofolio - ${name}`
      );

      const body = encodeURIComponent(
        `Halo Mahardika,\n\nNama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`
      );

      const mailtoUrl =
        `mailto:mahardikabintang288@gmail.com?subject=${subject}&body=${body}`;

      showToast(
        'Pesan siap dikirim! Mengalihkan ke email client...'
      );

      setTimeout(() => {
        window.location.href = mailtoUrl;
        contactForm.reset();
      }, 1000);
    });
  }

  function showToast(text) {
    if (!toast) return;

    const toastMsg = toast.querySelector('.toast-msg');

    if (toastMsg) {
      toastMsg.innerText = text;
    }

    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // --- 6. Modal Close via Backdrop and Escape Key ---
  const modal = document.getElementById('project-modal');

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'Escape' &&
        modal.classList.contains('active')
      ) {
        closeModal();
      }
    });
  }
});

// --- 7. Global Modal Functions for Projects ---

function openModal(title, description, techStack) {
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalTechList = document.getElementById('modal-tech-list');

  if (!modal) return;

  if (modalTitle) {
    modalTitle.innerText = title;
  }

  if (modalDesc) {
    modalDesc.innerText = description;
  }

  if (modalTechList) {
    modalTechList.innerHTML = '';

    // Mendukung format array maupun string
    const techs = Array.isArray(techStack)
      ? techStack
      : (techStack || '').split(',');

    techs.forEach(tech => {
      const li = document.createElement('li');
      li.className = 'modal-tech-item';
      li.innerText = tech.trim();
      modalTechList.appendChild(li);
    });
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('project-modal');

  if (!modal) return;

  modal.classList.remove('active');
  document.body.style.overflow = '';
}
