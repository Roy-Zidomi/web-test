// Navbar functionality
const navbarNav = document.querySelector(".navbar-nav");
const hamburgerMenu = document.querySelector("#hamburger-menu");

// Toggle mobile menu
hamburgerMenu.onclick = () => {
  navbarNav.classList.toggle("active");
};

// Close mobile menu when clicking outside
document.addEventListener("click", function (e) {
  if (!hamburgerMenu.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
});

// Search functionality
const searchForm = document.querySelector('.search-form');
const searchBox = document.querySelector('#search-box');
const searchBtn = document.querySelector('#search');

searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  searchForm.classList.toggle('active');
  searchBox.focus();
});

// Close search form when clicking outside
document.addEventListener('click', (e) => {
  if (!searchForm.contains(e.target) && !searchBtn.contains(e.target)) {
    searchForm.classList.remove('active');
  }
});

// Search products functionality
searchBox.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const menuCards = document.querySelectorAll('.menu-card');
  
  menuCards.forEach(card => {
    const title = card.querySelector('.menu-card-title').textContent.toLowerCase();
    const description = card.querySelector('.menu-card-desc').textContent.toLowerCase();
    
    if (title.includes(searchTerm) || description.includes(searchTerm)) {
      card.style.display = 'block';
      card.style.animation = 'fadeInUp 0.5s ease';
    } else {
      card.style.display = searchTerm ? 'none' : 'block';
    }
  });
});

// Shopping cart functionality
const shoppingCart = document.querySelector('.shopping-cart');
const cartBtn = document.querySelector('#shopping-cart');
const cartItems = [];

cartBtn.addEventListener('click', (e) => {
  e.preventDefault();
  shoppingCart.classList.toggle('active');
});

// Close cart when clicking outside
document.addEventListener('click', (e) => {
  if (!shoppingCart.contains(e.target) && !cartBtn.contains(e.target)) {
    shoppingCart.classList.remove('active');
  }
});

// Add to cart functionality
const addToCartButtons = document.querySelectorAll('.menu-card-btn');

addToCartButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const productName = e.target.closest('button').getAttribute('data-product');
    const productPrice = e.target.closest('button').getAttribute('data-price');
    const productImage = e.target.closest('.menu-card').querySelector('.menu-card-img').src;
    
    // Add item to cart array
    const existingItem = cartItems.find(item => item.name === productName);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({
        name: productName,
        price: parseInt(productPrice),
        image: productImage,
        quantity: 1
      });
    }
    
    updateCartDisplay();
    showNotification(`${productName} berhasil ditambahkan ke keranjang!`, 'success');
    
    // Show cart briefly
    shoppingCart.classList.add('active');
    setTimeout(() => {
      shoppingCart.classList.remove('active');
    }, 2000);
  });
});

// Update cart display
function updateCartDisplay() {
  const cartContainer = document.querySelector('.shopping-cart');
  
  // Clear existing items except the static ones (keep first 2 items as examples)
  const dynamicItems = cartContainer.querySelectorAll('.cart-item.dynamic');
  dynamicItems.forEach(item => item.remove());
  
  // Add new items
  cartItems.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item dynamic';
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="item-detail">
        <h3>${item.name}</h3>
        <div class="item-price">Rp ${item.price.toLocaleString()} x ${item.quantity}</div>
      </div>
      <i data-feather="trash-2" class="remove-item" data-product="${item.name}"></i>
    `;
    
    cartContainer.appendChild(cartItem);
  });
  
  // Re-render feather icons
  feather.replace();
  
  // Add remove functionality to new items
  const removeButtons = document.querySelectorAll('.remove-item');
  removeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const productName = e.target.getAttribute('data-product');
      removeFromCart(productName);
    });
  });
}

// Remove from cart
function removeFromCart(productName) {
  const itemIndex = cartItems.findIndex(item => item.name === productName);
  if (itemIndex > -1) {
    cartItems.splice(itemIndex, 1);
    updateCartDisplay();
    showNotification(`${productName} dihapus dari keranjang`, 'error');
  }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      // Close mobile menu if open
      navbarNav.classList.remove('active');
    }
  });
});

// Contact form functionality
const contactForm = document.querySelector('#contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Get form data
  const formData = new FormData(contactForm);
  const formObject = {};
  
  formData.forEach((value, key) => {
    formObject[key] = value;
  });
  
  // Basic validation
  if (validateForm(formObject)) {
    // Simulate form submission
    submitContactForm(formObject);
  }
});

// Form validation
function validateForm(data) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9+\-\s()]+$/;
  
  if (!data.name || data.name.trim().length < 2) {
    showFormMessage('Nama harus diisi minimal 2 karakter', 'error');
    return false;
  }
  
  if (!emailRegex.test(data.email)) {
    showFormMessage('Format email tidak valid', 'error');
    return false;
  }
  
  if (!phoneRegex.test(data.phone)) {
    showFormMessage('Format nomor telepon tidak valid', 'error');
    return false;
  }
  
  if (!data.subject) {
    showFormMessage('Silakan pilih keperluan Anda', 'error');
    return false;
  }
  
  if (!data.message || data.message.trim().length < 10) {
    showFormMessage('Pesan harus diisi minimal 10 karakter', 'error');
    return false;
  }
  
  return true;
}

// Submit contact form (simulation)
function submitContactForm(data) {
  // Show loading state
  const submitButton = document.querySelector('.btn-submit');
  const originalText = submitButton.innerHTML;
  submitButton.innerHTML = '<i data-feather="loader"></i> Mengirim...';
  submitButton.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    // Reset button
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
    feather.replace();
    
    // Show success message
    showFormMessage('Pesan berhasil dikirim! Kami akan segera menghubungi Anda.', 'success');
    
    // Reset form
    contactForm.reset();
    
    // Log data (in real app, this would be sent to server)
    console.log('Form submitted:', data);
  }, 2000);
}

// Show form message
function showFormMessage(message, type) {
  // Remove existing message
  const existingMessage = document.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create new message
  const messageElement = document.createElement('div');
  messageElement.className = `form-message ${type}`;
  messageElement.textContent = message;
  messageElement.style.display = 'block';
  
  // Insert before form
  contactForm.parentNode.insertBefore(messageElement, contactForm);
  
  // Auto hide after 5 seconds
  setTimeout(() => {
    if (messageElement.parentNode) {
      messageElement.remove();
    }
  }, 5000);
}

// Notification system
function showNotification(message, type = 'success') {
  // Remove existing notification
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i data-feather="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
    color: ${type === 'success' ? '#155724' : '#721c24'};
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    border-left: 4px solid ${type === 'success' ? '#28a745' : '#dc3545'};
  `;
  
  document.body.appendChild(notification);
  feather.replace();
  
  // Show notification
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Hide notification
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 3000);
}

// Scroll animations
function animateOnScroll() {
  const elements = document.querySelectorAll('.menu-card, .feature-item, .contact-item');
  
  elements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    
    if (elementTop < window.innerHeight - elementVisible) {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }
  });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.menu-card, .feature-item, .contact-item');
  elements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s ease';
  });
});

window.addEventListener('scroll', animateOnScroll);

// Navbar background change on scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 100) {
    navbar.style.backgroundColor = 'rgba(33, 33, 33, 0.95)';
  } else {
    navbar.style.backgroundColor = 'rgba(33, 33, 33, 0.9)';
  }
});

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Initialize feather icons
  feather.replace();
  
  // Add loading animation
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
  
  // Initialize scroll animations
  animateOnScroll();
  
  console.log('ZidomsChickenEgg website loaded successfully!');
});