// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animate demon items on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all demon items
    const demonItems = document.querySelectorAll('.demon-item');
    demonItems.forEach(item => {
        observer.observe(item);
    });

    // Add hover effects and interactive features
    demonItems.forEach((item, index) => {
        // Add click event to open demon details in new tab
        item.addEventListener('click', function() {
            const levelId = this.getAttribute('data-level-id');
            const demonName = this.querySelector('.demon-name').textContent;
            const creator = this.querySelector('.creator').textContent.replace('Creator: ', '');
            const difficulty = this.querySelector('.difficulty').textContent.replace('Difficulty: ', '');
            const rank = this.querySelector('.rank').textContent;
            const thumbnailImg = this.querySelector('.demon-thumbnail img');
            const thumbnailSrc = thumbnailImg ? thumbnailImg.src : '';
            
            openDemonDetails(demonName, creator, difficulty, levelId, rank, thumbnailSrc);
        });

        // Add keyboard navigation support
        item.setAttribute('tabindex', '0');
        
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Search functionality (for future implementation)
    function initializeSearch() {
        // Create search input
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" id="searchInput" placeholder="Search demons...">
            </div>
        `;

        // Insert search box before the demon list
        const demonSection = document.querySelector('.demon-section');
        const demonList = document.querySelector('.demon-list');
        demonSection.insertBefore(searchContainer, demonList);

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const items = document.querySelectorAll('.demon-item');
            
            items.forEach(item => {
                const demonName = item.querySelector('.demon-name').textContent.toLowerCase();
                const creator = item.querySelector('.creator').textContent.toLowerCase();
                
                if (demonName.includes(searchTerm) || creator.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // Initialize search (uncomment when ready)
    // initializeSearch();

    // Theme toggle functionality (for future dark/light mode)
    function initializeThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.title = 'Toggle theme';
        
        // Insert in header
        const header = document.querySelector('.header .container');
        header.appendChild(themeToggle);
        
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-moon');
            icon.classList.toggle('fa-sun');
        });
    }

    // Initialize theme toggle (uncomment when ready)
    // initializeThemeToggle();

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Add scroll indicator
    function addScrollIndicator() {
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        scrollIndicator.innerHTML = '<i class="fas fa-chevron-down"></i>';
        document.body.appendChild(scrollIndicator);

        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });

        scrollIndicator.addEventListener('click', function() {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }

    // Initialize scroll indicator
    addScrollIndicator();

    // Open demon details in same tab
    function openDemonDetails(demonName, creator, difficulty, levelId, rank, thumbnailSrc) {
        const params = new URLSearchParams({
            name: demonName,
            creator: creator,
            difficulty: difficulty,
            levelId: levelId,
            rank: rank,
            thumbnail: thumbnailSrc
        });
        
        const detailUrl = `demon-detail.html?${params.toString()}`;
        window.location.href = detailUrl;
    }

    // Add statistics counter animation
    function animateCounters() {
        const totalDemons = document.querySelectorAll('.demon-item').length;
        
        const statsContainer = document.createElement('div');
        statsContainer.className = 'stats-container';
        statsContainer.innerHTML = `
            <div class="stat-item">
                <div class="stat-number" data-target="${totalDemons}">0</div>
                <div class="stat-label">Total Demons</div>
            </div>
        `;

        const header = document.querySelector('.header .container');
        header.insertBefore(statsContainer, header.firstChild);

        // Animate counter
        const counter = statsContainer.querySelector('.stat-number');
        const target = parseInt(counter.getAttribute('data-target'));
        let current = 0;
        const increment = target / 50;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 30);
    }

    // Initialize stats counter
    animateCounters();

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for search focus
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape to clear search
        if (e.key === 'Escape') {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
            }
        }
    });
});

// Utility functions for future features
const DemonListUtils = {
    // Sort demons by different criteria
    sortBy: function(criteria) {
        const items = Array.from(document.querySelectorAll('.demon-item'));
        const list = document.querySelector('.demon-list');
        
        items.sort((a, b) => {
            if (criteria === 'name') {
                const nameA = a.querySelector('.demon-name').textContent;
                const nameB = b.querySelector('.demon-name').textContent;
                return nameA.localeCompare(nameB);
            }
            // Add more sorting criteria as needed
        });
        
        items.forEach(item => list.appendChild(item));
    },
    
    // Filter demons by difficulty
    filterByDifficulty: function(difficulty) {
        const items = document.querySelectorAll('.demon-item');
        items.forEach(item => {
            const itemDifficulty = item.querySelector('.difficulty').textContent.toLowerCase();
            if (itemDifficulty.includes(difficulty.toLowerCase())) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    },
    
    // Export list data
    exportData: function() {
        const demons = Array.from(document.querySelectorAll('.demon-item')).map(item => ({
            rank: item.querySelector('.rank').textContent,
            name: item.querySelector('.demon-name').textContent,
            creator: item.querySelector('.creator').textContent,
            difficulty: item.querySelector('.difficulty').textContent
        }));
        
        return JSON.stringify(demons, null, 2);
    }
};

// Make utilities available globally for console access
window.DemonListUtils = DemonListUtils;
