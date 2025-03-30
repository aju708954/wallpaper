// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference
if (localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
    themeToggle.innerHTML = '<i class="fas fa-sun dark:text-gray-300"></i>';
}

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.innerHTML = isDark ? 
        '<i class="fas fa-sun dark:text-gray-300"></i>' : 
        '<i class="fas fa-moon dark:text-gray-300"></i>';
});

// Mobile menu functionality
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Function to create category cards
function createCategoryCards() {
    const categories = window.dataManager.getAllCategories();
    const categoryGrid = document.querySelector('.grid.grid-cols-2');
    
    categoryGrid.innerHTML = categories.map(category => `
        <div class="category-card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow">
            <div class="aspect-w-16 aspect-h-9 mb-2">
                <img src="${category.image}" alt="${category.name}" class="rounded object-cover w-full h-32 lazy-image">
            </div>
            <h3 class="text-center text-gray-800 dark:text-gray-200">${category.name}</h3>
            <p class="text-center text-sm text-gray-600 dark:text-gray-400">${category.count} wallpapers</p>
        </div>
    `).join('');

    // Add click event listeners to category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.querySelector('h3').textContent;
            filterWallpapersByCategory(category);
        });
    });
}

// Function to filter wallpapers by category
function filterWallpapersByCategory(category) {
    const wallpapers = window.dataManager.getAllWallpapers();
    const filtered = category === 'All' ? 
        wallpapers : 
        wallpapers.filter(w => w.category === category);
    populateWallpapers(filtered);
    
    showToast(`Showing ${category} wallpapers`);
}

// Function to create wallpaper card
function createWallpaperCard(wallpaper) {
    return `
        <div class="wallpaper-card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow" data-wallpaper-id="${wallpaper.id}">
            <div class="relative group">
                <img src="${wallpaper.thumbnail}" alt="${wallpaper.title}" class="w-full h-48 object-cover lazy-image">
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button class="download-btn bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-600">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="like-btn bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">${wallpaper.title}</h3>
                <div class="flex justify-between items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span class="category-badge">${wallpaper.category}</span>
                    <div class="flex items-center space-x-4">
                        <span><i class="fas fa-download"></i> <span class="download-count">${wallpaper.downloads}</span></span>
                        <span><i class="fas fa-heart"></i> <span class="like-count">${wallpaper.likes}</span></span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Function to populate wallpapers
function populateWallpapers(wallpapers = window.dataManager.getAllWallpapers()) {
    const wallpaperGrid = document.getElementById('wallpaperGrid');
    if (!wallpaperGrid) return;
    
    wallpaperGrid.innerHTML = wallpapers.map(wallpaper => createWallpaperCard(wallpaper)).join('');
    initializeLazyLoading();
}

// Function to handle wallpaper download
async function handleDownload(wallpaper) {
    try {
        showToast('Preparing download...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const link = document.createElement('a');
        link.href = wallpaper.thumbnail;
        link.download = `${wallpaper.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Update download count
        wallpaper.downloads++;
        window.dataManager.updateWallpaper(wallpaper.id, { downloads: wallpaper.downloads });
        
        showToast('Download started!');
        updateWallpaperStats(wallpaper);
    } catch (error) {
        showToast('Error downloading wallpaper');
    }
}

// Function to handle like action
function handleLike(wallpaper, likeBtn) {
    const isLiked = likeBtn.classList.contains('liked');
    
    if (isLiked) {
        wallpaper.likes--;
        likeBtn.classList.remove('liked', 'bg-red-600');
        likeBtn.classList.add('bg-red-500');
    } else {
        wallpaper.likes++;
        likeBtn.classList.add('liked', 'bg-red-600');
        likeBtn.classList.remove('bg-red-500');
    }
    
    // Update likes in storage
    window.dataManager.updateWallpaper(wallpaper.id, { likes: wallpaper.likes });
    updateWallpaperStats(wallpaper);
}

// Function to update wallpaper statistics display
function updateWallpaperStats(wallpaper) {
    const card = document.querySelector(`[data-wallpaper-id="${wallpaper.id}"]`);
    if (card) {
        card.querySelector('.download-count').textContent = wallpaper.downloads;
        card.querySelector('.like-count').textContent = wallpaper.likes;
    }
}

// Function to show toast notification
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Function to initialize lazy loading
function initializeLazyLoading() {
    const images = document.querySelectorAll('.lazy-image');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize the page
function init() {
    createCategoryCards();
    populateWallpapers();
    
    // Add search functionality
    const searchInputs = document.querySelectorAll('input[type="text"]');
    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const wallpapers = window.dataManager.getAllWallpapers();
            const filtered = wallpapers.filter(w => 
                w.title.toLowerCase().includes(searchTerm) || 
                w.category.toLowerCase().includes(searchTerm)
            );
            populateWallpapers(filtered);
        });
    });

    // Add wallpaper interaction listeners
    const wallpaperGrid = document.getElementById('wallpaperGrid');
    if (wallpaperGrid) {
        wallpaperGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.wallpaper-card');
            if (!card) return;
            
            const wallpaperId = parseInt(card.dataset.wallpaperId);
            const wallpaper = window.dataManager.getAllWallpapers().find(w => w.id === wallpaperId);
            
            if (!wallpaper) return;
            
            const downloadBtn = e.target.closest('.download-btn');
            const likeBtn = e.target.closest('.like-btn');
            
            if (downloadBtn) {
                handleDownload(wallpaper);
            }
            
            if (likeBtn) {
                handleLike(wallpaper, likeBtn);
            }
        });
    }
}

// Initialize the page
init(); 