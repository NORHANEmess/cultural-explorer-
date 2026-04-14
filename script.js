// ===== زر "Explore Now" ينقلك بسلاسة لقسم الوجهات =====
document.querySelector('.btn').addEventListener('click', function (e) {
  e.preventDefault();
  document.querySelector('#destinations').scrollIntoView({ behavior: 'smooth' });
});

// ===== أنيميشن عند ظهور الأقسام أثناء التمرير =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.section').forEach(sec => observer.observe(sec));

// ===== تغيير لون شريط التنقل العلوي عند التمرير =====
// Change navbar background color on scroll
window.addEventListener('scroll', () => {
  const topbar = document.querySelector('.topbar');
  const heroHeight = document.querySelector('.hero').offsetHeight;
  const logo = document.querySelector('.logo-def');

  if (window.scrollY > heroHeight - 50) {
    topbar.classList.add('scrolled');
    logo.classList.add('logo');
  } else {
    topbar.classList.remove('scrolled');
    logo.classList.remove('logo');
  }
});
document.getElementById('booking-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const destination = document.getElementById('destination').value;
  const people = document.getElementById('people').value;
  const date = document.getElementById('date').value;

  const trip = { name, email, destination, people, date };

  // حفظ في LocalStorage
  const trips = JSON.parse(localStorage.getItem('cultural_trips')) || [];
  trips.push(trip);
  localStorage.setItem('cultural_trips', JSON.stringify(trips));

  // إخفاء النموذج، وإظهار تأكيد
  this.style.display = 'none';
  document.getElementById('confirmation').classList.remove('hidden');
});
