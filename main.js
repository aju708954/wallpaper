// Sample wallpaper data (in a real application, this would come from a database)
const wallpapers = [
    {
        id: 1,
        title: "Mountain Landscape",
        category: "Nature",
        thumbnail: "https://via.placeholder.com/400x300",
        downloads: 1234,
        resolution: "3840x2160"
    },
    // More wallpapers will be added here
];

// Current page for pagination
let currentPage = 1;
const wallpapersPerPage = 12;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadWallpapers();
    setupSearchHandler();
    setupLoadMoreButton();
});

// Load wallpapers into the grid
function loadWallpapers(page = 1) {
    const wallpaperGrid = document.getElementById('wallpaperGrid');
    const startIndex = (page - 1) * wallpapersPerPage;
    const endIndex = startIndex + wallpapersPerPage;
    
    // In a real application, this would fetch from an API
    const wallpapersToShow = wallpapers.slice(startIndex, endIndex);
    
    wallpapersToShow.forEach(wallpaper => {
        const wallpaperCard = createWallpaperCard(wallpaper);
        wallpaperGrid.appendChild(wallpaperCard);
    });
}

// Create a wallpaper card element
function createWallpaperCard(wallpaper) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow';
    
    card.innerHTML = `
        <div class="relative group">
            <img src="${wallpaper.thumbnail}" alt="${wallpaper.title}" class="w-full h-48 object-cover">
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg mr-2" onclick="downloadWallpaper(${wallpaper.id})">
                    <i class="fas fa-download mr-2"></i>Download
                </button>
                <button class="bg-white text-indigo-600 px-4 py-2 rounded-lg" onclick="previewWallpaper(${wallpaper.id})">
                    <i class="fas fa-eye mr-2"></i>Preview
                </button>
            </div>
        </div>
        <div class="p-4">
            <h3 class="text-lg font-semibold mb-2">${wallpaper.title}</h3>
            <div class="flex justify-between text-sm text-gray-600">
                <span><i class="fas fa-download mr-1"></i>${wallpaper.downloads}</span>
                <span><i class="fas fa-expand-arrows-alt mr-1"></i>${wallpaper.resolution}</span>
            </div>
        </div>
    `;
    
    return card;
}

// Handle wallpaper download
function downloadWallpaper(id) {
    // In a real application, this would trigger the download
    console.log(`Downloading wallpaper ${id}`);
}

// Handle wallpaper preview
function previewWallpaper(id) {
    // In a real application, this would show a modal with the full-size image
    console.log(`Previewing wallpaper ${id}`);
}

// Setup search functionality
function setupSearchHandler() {
    const searchInput = document.querySelector('input[placeholder="Search wallpapers..."]');
    let debounceTimer;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase();
            // In a real application, this would trigger an API search
            console.log(`Searching for: ${searchTerm}`);
        }, 300);
    });
}

// Setup load more button
function setupLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMore');
    
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        loadWallpapers(currentPage);
        
        // Hide button if no more wallpapers
        if (currentPage * wallpapersPerPage >= wallpapers.length) {
            loadMoreBtn.style.display = 'none';
        }
    });
} 