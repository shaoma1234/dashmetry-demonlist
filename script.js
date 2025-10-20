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
            
            window.openDemonDetails(demonName, creator, difficulty, levelId, rank, thumbnailSrc);
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

    // Search functionality with difficulty filtering
    function initializeSearch() {
        // Create search container
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" id="searchInput" placeholder="Search demons by name, creator, or difficulty...">
            </div>
            <div class="difficulty-filters">
                <button class="filter-btn active" data-filter="all">All</button>
                <button class="filter-btn" data-filter="extreme">Extreme</button>
                <button class="filter-btn" data-filter="insane">Insane</button>
                <button class="filter-btn" data-filter="demon">Demon</button>
                <button class="filter-btn" data-filter="medium">Medium</button>
                <button class="filter-btn" data-filter="easy">Easy</button>
            </div>
        `;

        // Insert search container before the demon list
        const demonSection = document.querySelector('.demon-section');
        const demonList = document.querySelector('.demon-list');
        demonSection.insertBefore(searchContainer, demonList);

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const filterButtons = document.querySelectorAll('.filter-btn');
        let currentFilter = 'all';

        function filterDemons() {
            const searchTerm = searchInput.value.toLowerCase();
            const items = document.querySelectorAll('.demon-item');
            
            items.forEach(item => {
                const demonName = item.querySelector('.demon-name').textContent.toLowerCase();
                const creator = item.querySelector('.creator').textContent.toLowerCase();
                const difficulty = item.querySelector('.difficulty').textContent.toLowerCase();
                
                // Check search term match
                const matchesSearch = demonName.includes(searchTerm) || 
                                    creator.includes(searchTerm) || 
                                    difficulty.includes(searchTerm);
                
                // Check difficulty filter match with exact matching
                let matchesFilter = false;
                if (currentFilter === 'all') {
                    matchesFilter = true;
                } else {
                    if (currentFilter === 'demon') {
                        // For "Demon" filter, only show items that are exactly "Demon" difficulty
                        matchesFilter = difficulty === 'difficulty: demon';
                    } else if (currentFilter === 'easy') {
                        // For "Easy" filter, only show items that are exactly "Easy Demon"
                        matchesFilter = difficulty === 'difficulty: easy demon';
                    } else if (currentFilter === 'medium') {
                        // For "Medium" filter, only show items that are exactly "Medium Demon"
                        matchesFilter = difficulty === 'difficulty: medium demon';
                    } else if (currentFilter === 'insane') {
                        // For "Insane" filter, only show items that are exactly "Insane Demon"
                        matchesFilter = difficulty === 'difficulty: insane demon';
                    } else if (currentFilter === 'extreme') {
                        // For "Extreme" filter, only show items that are exactly "Extreme Demon"
                        matchesFilter = difficulty === 'difficulty: extreme demon';
                    }
                }
                
                if (matchesSearch && matchesFilter) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        // Search input event
        searchInput.addEventListener('input', filterDemons);

        // Filter button events
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Update current filter
                currentFilter = this.getAttribute('data-filter');
                
                // Filter demons
                filterDemons();
            });
        });

        // Add keyboard shortcut for clearing search
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                filterDemons();
            }
        });
    }

    // Initialize search
    initializeSearch();

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
    window.openDemonDetails = function(demonName, creator, difficulty, levelId, rank, thumbnailSrc) {
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
    };

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

    // Load and display challenge list
    loadChallengeList();

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

// Load and display challenge list
function loadChallengeList() {
    // Challenge list data embedded directly to avoid CORS issues
    const challengeData = [
        'RUNAWAY;Hydrog;Insane Demon;10400',
        'top 1 maybe idk;YomayoCB;Insane Demon;2095',
        'Theory of Nothing;Eclipsemay;Medium Demon;4337',
        'Oppression by Nightfall;Nightfall;Medium Demon;10364',
        'Ñ;Rift;Unrated;12695',
        'clssical vip;Thuan;Medium Demon;3691',
        'GD Player Challenge;Crystalgdvn;Medium Demon;3470',
        'Death Corridor;Kour_is_Good;Demon;12456',
        'Into Darkness;Asdoss;Medium Demon;11469',
        'Flaschy;Momedz;Easy Demon;10346',
        'TROC;Jasonee19;Demon;15947'
    ];
    
    const challengeSection = document.querySelector('#legacy');
    
    if (!challengeSection) return;
    
    // Clear the placeholder content
    challengeSection.innerHTML = '<h2 class="section-title">Challenge List</h2>';
    
    // Create challenge search container
    const challengeSearchContainer = document.createElement('div');
    challengeSearchContainer.className = 'search-container';
    challengeSearchContainer.innerHTML = `
        <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" id="challengeSearchInput" placeholder="Search challenges...">
        </div>
    `;
    
    challengeSection.appendChild(challengeSearchContainer);
    
    // Create challenge list container
    const challengeList = document.createElement('div');
    challengeList.className = 'demon-list';
    
    let rank = 1;
    
    challengeData.forEach(line => {
        line = line.trim();
        
        // Skip empty lines
        if (!line) return;
        
        // Parse the challenge data: demonName;creator;difficulty;levelId
        const parts = line.split(';');
        if (parts.length >= 4) {
            const demonName = parts[0].trim();
            const creator = parts[1].trim();
            const difficulty = parts[2].trim();
            const levelId = parts[3].trim();
            
            // Create challenge item
            const challengeItem = document.createElement('div');
            challengeItem.className = 'demon-item';
            challengeItem.setAttribute('data-level-id', levelId);
            challengeItem.innerHTML = `
                <div class="rank">#${rank}</div>
                <div class="demon-info">
                    <div class="demon-name">${demonName}</div>
                    <div class="creator">Creator: ${creator}</div>
                    <div class="difficulty">Difficulty: ${difficulty}</div>
                </div>
                <div class="demon-thumbnail">
                    <div class="placeholder-thumb">Challenge</div>
                </div>
            `;
            
            // Add click event to open challenge details
            challengeItem.addEventListener('click', function() {
                const levelId = this.getAttribute('data-level-id');
                const demonName = this.querySelector('.demon-name').textContent;
                const creator = this.querySelector('.creator').textContent.replace('Creator: ', '');
                const difficulty = this.querySelector('.difficulty').textContent.replace('Difficulty: ', '');
                const rank = this.querySelector('.rank').textContent;
                
                        window.openDemonDetails(demonName, creator, difficulty, levelId, rank, '');
            });
            
            // Add keyboard navigation support
            challengeItem.setAttribute('tabindex', '0');
            challengeItem.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
            
            challengeList.appendChild(challengeItem);
            rank++;
        }
    });
    
    challengeSection.appendChild(challengeList);
    
    // Add search functionality for challenges
    const challengeSearchInput = document.getElementById('challengeSearchInput');
    if (challengeSearchInput) {
        challengeSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const challengeItems = challengeList.querySelectorAll('.demon-item');
            
            challengeItems.forEach(item => {
                const demonName = item.querySelector('.demon-name').textContent.toLowerCase();
                const creator = item.querySelector('.creator').textContent.toLowerCase();
                const difficulty = item.querySelector('.difficulty').textContent.toLowerCase();
                
                if (demonName.includes(searchTerm) || creator.includes(searchTerm) || difficulty.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

// Make utilities available globally for console access
window.DemonListUtils = DemonListUtils;
