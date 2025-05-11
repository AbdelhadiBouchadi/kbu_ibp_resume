document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  initTheme();

  // Initialize navigation
  initNavigation();

  // Initialize scroll animations
  initScrollAnimations();

  // Initialize contact form validation
  initContactForm();

  // Initialize skill bars animation
  initSkillBars();
});

// Theme Toggle
function initTheme() {
  const toggleSwitch = document.querySelector('#checkbox');
  const themeLabel = document.querySelector('.theme-label');

  // Check for saved theme preference or use prefer-color-scheme
  const currentTheme =
    localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light');

  // Set initial theme
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    toggleSwitch.checked = true;
    themeLabel.textContent = 'Light Mode';
  }

  // Listen for theme switch changes
  toggleSwitch.addEventListener('change', (e) => {
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      themeLabel.textContent = 'Light Mode';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      themeLabel.textContent = 'Dark Mode';
    }
  });
}

// Navigation
function initNavigation() {
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const primaryNav = document.querySelector('.primary-navigation');
  const navLinks = document.querySelectorAll('.nav-link');
  const header = document.querySelector('#header');

  // Mobile menu toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const visibility = primaryNav.getAttribute('data-visible');

      if (visibility === 'true') {
        primaryNav.setAttribute('data-visible', false);
        navToggle.setAttribute('aria-expanded', false);
      } else {
        primaryNav.setAttribute('data-visible', true);
        navToggle.setAttribute('aria-expanded', true);
      }
    });
  }

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      primaryNav.setAttribute('data-visible', false);
      if (navToggle) navToggle.setAttribute('aria-expanded', false);
    });
  });

  // Update active nav link on scroll
  window.addEventListener('scroll', () => {
    // Header shadow on scroll
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Update active nav link
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - header.offsetHeight - 10;
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  });
}

// Animations triggers
function initScrollAnimations() {
  // Elements to animate on scroll
  const animatables = [
    ...document.querySelectorAll('.timeline-item'),
    ...document.querySelectorAll('.project-card'),
    ...document.querySelectorAll('.skills-category'),
    ...document.querySelectorAll('.contact-info'),
    ...document.querySelectorAll('.contact-form'),
  ];

  // Observer options
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  // Intersection observer callback
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  // Observe each animatable element
  animatables.forEach((element) => {
    observer.observe(element);
  });
}

// Contact Form Validation
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);

      try {
        const response = await fetch('contact.php', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        formStatus.textContent = result.message;
        formStatus.className =
          result.status === 'success' ? 'success-message' : 'error-message';

        if (result.status === 'success') {
          contactForm.reset();
        }
      } catch (error) {
        formStatus.textContent = 'An error occurred. Please try again later.';
        formStatus.className = 'error-message';
      }
    });
  }
}

// Skills Section
function initSkillBars() {
  const skillLevels = document.querySelectorAll('.skill-level');

  // Observer options
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  };

  // Intersection observer callback
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Get the width from the inline style and apply it with transition
        const targetWidth = entry.target.style.width;

        // Reset width to 0 then animate to target
        entry.target.style.width = '0%';

        // Trigger reflow to ensure the animation works
        void entry.target.offsetWidth;

        // Set the final width (this will trigger the CSS transition)
        entry.target.style.width = targetWidth;

        // Unobserve after animation
        observer.unobserve(entry.target);
      }
    });
  }, options);

  // Observe each skill level element
  skillLevels.forEach((skill) => {
    observer.observe(skill);
  });
}

// Print Functionnality
document.querySelector('.resume-download')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.print();
});
