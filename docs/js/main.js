document.addEventListener('DOMContentLoaded', function() {
    // Set the current year in the footer
    document.getElementById("currentYear").textContent = new Date().getFullYear();
    // Get the current page slug from the URL
    const currentPath = window.location.pathname;
    const currentSlug = currentPath === '/' ? 'home' : currentPath.replace('/', '').toLowerCase();
    // Find the menu item with the matching slug and add the 'active' class
    const menuItems = document.querySelectorAll('.nav-menu a');
    menuItems.forEach(item => {
      if (item.getAttribute('data-slug') === currentSlug) {
        item.classList.add('active');
      }
    });
  });
  