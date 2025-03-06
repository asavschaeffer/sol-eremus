const header = document.getElementById('main-header');
const main = document.querySelector('main');
let currentSection = '';
let isScrolling = false;
let scrollTimeout;

function updateHeaderPosition() {
  const scrollPosition = main.scrollTop;
  const windowHeight = window.innerHeight;
  const currentSectionIndex = Math.floor(scrollPosition / windowHeight);
  const sections = ['sky-islands', 'magical-forest', 'coastal-kingdom', 'desert-oasis'];
  currentSection = sections[currentSectionIndex];

  if (currentSection === 'sky-islands') {
    header.style.top = 'auto';
    header.style.bottom = '5rem';
  } else {
    header.style.top = '0';
    header.style.bottom = 'auto';
  }

  // Hide header while scrolling
  if (isScrolling) {
    header.classList.remove('fade-in');
    header.classList.add('fade-out');
  }
}

function showHeader() {
  header.classList.remove('fade-out');
  header.classList.add('fade-in');
}

function handleScroll() {
  isScrolling = true;
  updateHeaderPosition();

  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    isScrolling = false;
    showHeader();
  }, 50); // Reduced delay to make the header appear sooner after scrolling stops
}

main.addEventListener('scroll', handleScroll);
window.addEventListener('resize', updateHeaderPosition);

// Initial position update
updateHeaderPosition();
showHeader(); // Show header initially

// Add this to handle the case when the page is refreshed while not at the top
window.addEventListener('load', () => {
  if (main.scrollTop > 0) {
    handleScroll();
  }
});