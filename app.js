(function () {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const searchInput = document.querySelector('[data-site-search]');
  const searchableItems = document.querySelectorAll('[data-searchable]');
  const searchStatus = document.querySelector('[data-search-status]');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();
      let matches = 0;

      searchableItems.forEach((item) => {
        const text = (item.dataset.searchText ||= item.textContent || '');
        const isMatch = !query || text.toLowerCase().includes(query);
        item.classList.toggle('is-hidden', !isMatch);
        if (isMatch) {
          matches += 1;
        }
      });

      if (searchStatus) {
        if (!query) {
          searchStatus.textContent = 'Въведете дума за търсене.';
        } else if (matches === 0) {
          searchStatus.textContent = `Няма намерени резултати за „${searchInput.value}“.`;
        } else {
          searchStatus.textContent = `Намерени резултати: ${matches}.`;
        }
      }
    });
  }

  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImage = lightbox?.querySelector('[data-lightbox-image]');
  const lightboxCaption = lightbox?.querySelector('[data-lightbox-caption]');

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.classList.remove('is-visible');
  };

  if (lightbox) {
    document.querySelectorAll('[data-lightbox-trigger]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const full = trigger.getAttribute('data-full');
        const alt = trigger.getAttribute('data-alt') || '';
        const caption = trigger.getAttribute('data-caption') || '';

        if (lightboxImage instanceof HTMLImageElement) {
          lightboxImage.src = full || '';
          lightboxImage.alt = alt;
        }

        if (lightboxCaption) {
          lightboxCaption.textContent = caption;
        }

        lightbox.classList.add('is-visible');
        lightbox.setAttribute('aria-hidden', 'false');
        lightbox.querySelector('[data-close-lightbox]')?.focus();
      });
    });

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox || event.target.hasAttribute('data-close-lightbox')) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && lightbox.classList.contains('is-visible')) {
        closeLightbox();
      }
    });
  }

  const enrollmentForm = document.querySelector('#enrollment-form');

  if (enrollmentForm instanceof HTMLFormElement) {
    const steps = Array.from(enrollmentForm.querySelectorAll('[data-form-step]'));
    const indicator = enrollmentForm.querySelector('[data-step-indicator]');
    let currentStep = 0;

    const updateStepVisibility = () => {
      steps.forEach((step, index) => {
        step.hidden = index !== currentStep;
      });

      if (indicator) {
        indicator.textContent = `Стъпка ${currentStep + 1} от ${steps.length}`;
      }
    };

    const validateStep = (step) => {
      const fields = Array.from(step.querySelectorAll('input, select, textarea'));
      return fields.every((field) => {
        if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement) {
          if (!field.checkValidity()) {
            field.reportValidity();
            return false;
          }
        }
        return true;
      });
    };

    enrollmentForm.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      if (target.hasAttribute('data-next-step')) {
        event.preventDefault();
        const step = steps[currentStep];
        if (step && validateStep(step)) {
          currentStep = Math.min(currentStep + 1, steps.length - 1);
          updateStepVisibility();
        }
      }

      if (target.hasAttribute('data-prev-step')) {
        event.preventDefault();
        currentStep = Math.max(currentStep - 1, 0);
        updateStepVisibility();
      }
    });

    enrollmentForm.addEventListener('submit', (event) => {
      const step = steps[currentStep];
      if (step && !validateStep(step)) {
        event.preventDefault();
      }
    });

    updateStepVisibility();
  }
})();
