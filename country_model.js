document.addEventListener('DOMContentLoaded', function() {
  // Country data (unchanged)
  const countries = {
    'algiers': {
      name: 'Algiers, Algeria',
      code: '🇩🇿 DZ',
      landmarks: [
        {img: './assets/images/download (3).jpeg', desc: 'Casbah of Algiers - UNESCO World Heritage Site'},
        {img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Alger_%D8%A7%D9%84%D8%AC%D8%B2%D8%A7%D8%A6%D8%B1_centre_ville.jpg/800px-Alger_%D8%A7%D9%84%D8%AC%D8%B2%D8%A7%D8%A6%D8%B1_centre_ville.jpg', desc: 'The Grand Post Office of Algiers'}
      ],
      nature: [
        {img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Jardin_d%27essai_du_Hamma_%28Alger%29.jpg/800px-Jardin_d%27essai_du_Hamma_%28Alger%29.jpg', desc: 'Jardin d\'Essai du Hamma - Botanical Gardens'},
        {img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Alger_-_Baie_d%27Alger.jpg/800px-Alger_-_Baie_d%27Alger.jpg', desc: 'Bay of Algiers'}
      ],
      dishes: [
        {img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Tunisian_couscous.jpg/800px-Tunisian_couscous.jpg', desc: 'Traditional Algerian Couscous'},
        {img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Chorba_frik_%28Algeria%29.jpg/800px-Chorba_frik_%28Algeria%29.jpg', desc: 'Chorba Frik - Traditional Soup'}
      ]
    },
    // ... (keep other countries as is)
  };

  // Modal elements (unchanged)
  const modal = document.getElementById('country-modal');
  const closeBtn = document.querySelector('.close-modal');
  const countryName = document.getElementById('modal-country-name');
  const countryCode = document.getElementById('modal-country-code');
  const modalSections = document.querySelector('.modal-sections');
  
  // Current section tracking
  let currentSectionIndex = 0;
  let totalSections = 0;
  
  // Make destination cards clickable (unchanged)
  document.querySelectorAll('.dest-card, .top-dest-card').forEach(card => {
    card.addEventListener('click', function() {
      const countryText = this.querySelector('h3').textContent.toLowerCase();
      let countryKey;
      
      if (countryText.includes('algiers')) countryKey = 'algiers';
      else if (countryText.includes('tunis')) countryKey = 'tunis';
      else if (countryText.includes('marrakech')) countryKey = 'marrakech';
      
      if (countries[countryKey]) {
        openModal(countries[countryKey]);
      }
    });
  });

  // Close modal (unchanged)
  closeBtn.addEventListener('click', closeModal);
  window.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
  });

  function openModal(data) {
    countryName.textContent = data.name;
    countryCode.textContent = data.code;
    modalSections.innerHTML = '';
    currentSectionIndex = 0;
    
    // Create sections
    const sections = [
      { title: 'Top Historical Landmarks', titleAr: 'أبرز المعالم التاريخية', items: data.landmarks },
      { title: 'Natural Wonders', titleAr: 'معالم طبيعية', items: data.nature },
      { title: 'Famous Dishes', titleAr: 'أطباق مشهورة', items: data.dishes },
      { title: 'Book Your Trip', titleAr: 'احجز رحلتك', isBooking: true }
    ];
    
    totalSections = sections.length;
    
    sections.forEach((section, index) => {
      const sectionEl = document.createElement('section');
      sectionEl.className = `modal-section ${index === 0 ? 'active' : ''}`;
      
      if (section.isBooking) {
        // Booking section (unchanged)
        sectionEl.innerHTML = `
          <div class="booking-section">
            <h3>${section.title}<br><small>${section.titleAr}</small></h3>
            <p>Ready to experience ${data.name}?</p>
            <button class="book-now-btn">Book Now</button>
          </div>
        `;
      } else {
        // Regular section with swipe cards and arrows
        sectionEl.innerHTML = `
          <h3 class="section-title">${section.title}<br><small>${section.titleAr}</small></h3>
          <div class="swipe-wrapper">
            <div class="swipe-container">
              ${section.items.map(item => `
                <div class="swipe-card">
                  <img src="${item.img}" alt="${item.desc}" loading="lazy">
                  <p class="caption">${item.desc}</p>
                </div>
              `).join('')}
            </div>
            <button class="swipe-arrow left" aria-label="Previous">&#10094;</button>
            <button class="swipe-arrow right" aria-label="Next">&#10095;</button>
          </div>
        `;

        // Initialize swipe arrows for this section
        const initSwipeArrows = () => {
          const container = sectionEl.querySelector('.swipe-container');
          const leftArrow = sectionEl.querySelector('.swipe-arrow.left');
          const rightArrow = sectionEl.querySelector('.swipe-arrow.right');

          const updateArrows = () => {
            leftArrow.style.visibility = container.scrollLeft <= 10 ? 'hidden' : 'visible';
            rightArrow.style.visibility = container.scrollLeft >= container.scrollWidth - container.clientWidth - 10 ? 'hidden' : 'visible';
          };

          container.addEventListener('scroll', updateArrows);
          updateArrows();

          leftArrow.addEventListener('click', () => {
            container.scrollBy({ left: -300, behavior: 'smooth' });
          });

          rightArrow.addEventListener('click', () => {
            container.scrollBy({ left: 300, behavior: 'smooth' });
          });
        };

        // Initialize arrows when section becomes active
        const observer = new MutationObserver((mutations) => {
          if (sectionEl.classList.contains('active')) {
            initSwipeArrows();
            observer.disconnect();
          }
        });
        observer.observe(sectionEl, { attributes: true });
      }
      
      modalSections.appendChild(sectionEl);
    });
    
    // Create navigation dots (unchanged)
    const dotsContainer = document.querySelector('.dots-container');
    dotsContainer.innerHTML = '';
    sections.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = `dot-nav ${index === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => navigateToSection(index));
      dotsContainer.appendChild(dot);
    });
    
    // Update navigation buttons (unchanged)
    updateNavigationButtons();
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  // Rest of the functions remain unchanged
  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
  
  function navigateToSection(index) {
    if (index < 0 || index >= totalSections) return;
    
    document.querySelectorAll('.modal-section').forEach(section => {
      section.classList.remove('active');
    });
    
    document.querySelectorAll('.dot-nav').forEach(dot => {
      dot.classList.remove('active');
    });
    
    document.querySelectorAll('.modal-section')[index].classList.add('active');
    document.querySelectorAll('.dot-nav')[index].classList.add('active');
    
    currentSectionIndex = index;
    updateNavigationButtons();
  }
  
  function updateNavigationButtons() {
    const prevBtn = document.querySelector('.prev-section');
    const nextBtn = document.querySelector('.next-section');
    
    prevBtn.disabled = currentSectionIndex === 0;
    nextBtn.disabled = currentSectionIndex === totalSections - 1;
    
    if (currentSectionIndex === totalSections - 1) {
      nextBtn.textContent = 'Finish';
    } else {
      nextBtn.textContent = 'Next';
    }
  }
  
  // Navigation button events (unchanged)
  document.querySelector('.prev-section')?.addEventListener('click', () => {
    navigateToSection(currentSectionIndex - 1);
  });
  
  document.querySelector('.next-section')?.addEventListener('click', () => {
    if (currentSectionIndex === totalSections - 1) {
      closeModal();
    } else {
      navigateToSection(currentSectionIndex + 1);
    }
  });
});