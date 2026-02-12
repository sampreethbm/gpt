document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const servicesGrid = document.getElementById('servicesGrid');
    const searchInput = document.getElementById('searchInput');
    const noResults = document.getElementById('noResults');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Modal Elements
    const getStartedBtn = document.getElementById('getStartedBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModal = document.getElementById('closeModal');
    const signupForm = document.getElementById('signupForm');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');

    // State
    let services = [];

    // --- 1. Fetch & Render Data ---
    async function loadServices() {
        try {
            const response = await fetch('data/data.json');
            if (!response.ok) throw new Error('Failed to load data');
            services = await response.json();
            renderServices(services);
        } catch (error) {
            console.error('Error:', error);
            // Fallback data if fetch fails (e.g. file protocol without local server)
            servicesGrid.innerHTML = '<p style="color:#ff6b6b">Please run on a local server to see data, or check console.</p>';
        }
    }

    function renderServices(data) {
        servicesGrid.innerHTML = ''; // Clear loading state
        
        if (data.length === 0) {
            noResults.classList.remove('hidden');
            return;
        } else {
            noResults.classList.add('hidden');
        }

        data.forEach(service => {
            const card = document.createElement('div');
            card.className = 'service-card fade-in';
            card.setAttribute('role', 'article');
            card.setAttribute('tabindex', '0');
            
            card.innerHTML = `
                <img src="${service.image}" alt="${service.title} service" loading="lazy">
                <div class="card-overlay">
                    <span class="card-title">${service.title}</span>
                    <span class="card-arrow">&rarr;</span>
                </div>
            `;
            
            // Add click interaction
            card.addEventListener('click', () => {
                alert(`You selected the ${service.title} service!`);
            });

            servicesGrid.appendChild(card);
        });
    }

    // --- 2. Search Functionality ---
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = services.filter(service => 
            service.title.toLowerCase().includes(searchTerm) ||
            service.category.toLowerCase().includes(searchTerm)
        );
        renderServices(filtered);
    });

    // --- 3. Mobile Menu Toggle ---
    mobileToggle.addEventListener('click', () => {
        const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        mobileToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        
        // Toggle Hamburger animation
        const bars = mobileToggle.querySelectorAll('.bar');
        if (!isExpanded) {
            bars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
        } else {
            bars.forEach(bar => bar.style.transform = 'none');
            bars[1].style.opacity = '1';
        }
    });

    // --- 4. Modal & Form Validation ---
    
    // Open Modal
    getStartedBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('hidden');
        modalOverlay.setAttribute('aria-hidden', 'false');
        emailInput.focus();
    });

    // Close Modal
    function closeModalFunc() {
        modalOverlay.classList.add('hidden');
        modalOverlay.setAttribute('aria-hidden', 'true');
        emailError.textContent = '';
        signupForm.reset();
    }

    closeModal.addEventListener('click', closeModalFunc);
    
    // Close on click outside
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModalFunc();
    });

    // Form Validation
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            emailError.textContent = 'Please enter a valid email address.';
            emailInput.style.borderColor = '#ff6b6b';
        } else {
            emailError.textContent = '';
            emailInput.style.borderColor = '#333';
            // Simulate API call
            const btn = signupForm.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'Joining...';
            
            setTimeout(() => {
                alert('Welcome to HandyHub! We will contact you shortly.');
                closeModalFunc();
                btn.textContent = originalText;
            }, 1000);
        }
    });

    // Initialize
    loadServices();
});
