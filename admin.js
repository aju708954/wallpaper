// Sample admin data (in a real application, this would come from a database)
const adminWallpapers = [
    {
        id: 1,
        title: "Mountain Landscape",
        category: "Nature",
        thumbnail: "https://via.placeholder.com/400x300",
        downloads: 1234,
        dateAdded: "2024-03-30",
        status: "active"
    },
    // More wallpapers will be added here
];

// Initialize the admin panel
document.addEventListener('DOMContentLoaded', () => {
    loadAdminWallpapers();
    setupEventListeners();
});

// Load wallpapers in admin grid
function loadAdminWallpapers() {
    const wallpaperGrid = document.getElementById('admin-wallpaper-grid');
    wallpaperGrid.innerHTML = ''; // Clear existing content
    
    adminWallpapers.forEach(wallpaper => {
        const wallpaperCard = createAdminWallpaperCard(wallpaper);
        wallpaperGrid.appendChild(wallpaperCard);
    });
}

// Create an admin wallpaper card
function createAdminWallpaperCard(wallpaper) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden';
    
    card.innerHTML = `
        <div class="relative">
            <img src="${wallpaper.thumbnail}" alt="${wallpaper.title}" class="w-full h-48 object-cover">
            <div class="absolute top-2 right-2">
                <span class="bg-green-500 text-white px-2 py-1 rounded-full text-sm">${wallpaper.status}</span>
            </div>
        </div>
        <div class="p-4">
            <h3 class="text-lg font-semibold mb-2">${wallpaper.title}</h3>
            <div class="text-sm text-gray-600 mb-4">
                <p><i class="fas fa-folder mr-2"></i>${wallpaper.category}</p>
                <p><i class="fas fa-download mr-2"></i>${wallpaper.downloads} downloads</p>
                <p><i class="fas fa-calendar mr-2"></i>${wallpaper.dateAdded}</p>
            </div>
            <div class="flex justify-between">
                <button class="text-blue-600 hover:text-blue-800" onclick="editWallpaper(${wallpaper.id})">
                    <i class="fas fa-edit mr-1"></i>Edit
                </button>
                <button class="text-red-600 hover:text-red-800" onclick="deleteWallpaper(${wallpaper.id})">
                    <i class="fas fa-trash mr-1"></i>Delete
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Show/hide sections
function showSection(sectionName) {
    const sections = ['wallpapers', 'categories', 'stats', 'settings'];
    sections.forEach(section => {
        const element = document.getElementById(`${section}-section`);
        element.classList.toggle('hidden', section !== sectionName);
    });
}

// Modal functions
function showUploadModal() {
    const modal = document.getElementById('upload-modal');
    modal.classList.remove('hidden');
}

function hideUploadModal() {
    const modal = document.getElementById('upload-modal');
    modal.classList.add('hidden');
}

// Setup event listeners
function setupEventListeners() {
    // Upload form submission
    document.getElementById('upload-form').addEventListener('submit', (e) => {
        e.preventDefault();
        // In a real application, this would handle the file upload
        console.log('Uploading wallpaper...');
        hideUploadModal();
    });

    // Settings form submission
    document.getElementById('settings-form').addEventListener('submit', (e) => {
        e.preventDefault();
        // In a real application, this would save the settings
        console.log('Saving settings...');
        alert('Settings saved successfully!');
    });
}

// Wallpaper management functions
function editWallpaper(id) {
    // In a real application, this would open an edit modal with the wallpaper details
    console.log(`Editing wallpaper ${id}`);
}

function deleteWallpaper(id) {
    if (confirm('Are you sure you want to delete this wallpaper?')) {
        // In a real application, this would delete the wallpaper from the database
        console.log(`Deleting wallpaper ${id}`);
        // Remove from UI
        const index = adminWallpapers.findIndex(w => w.id === id);
        if (index !== -1) {
            adminWallpapers.splice(index, 1);
            loadAdminWallpapers();
        }
    }
}

// Logout function
function logout() {
    // In a real application, this would handle the logout process
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = '/';
    }
}

// Category management
function showCategoryModal() {
    // In a real application, this would show a modal for adding/editing categories
    alert('Category management coming soon!');
}

// Statistics functions
function updateStats() {
    // In a real application, this would fetch real-time statistics
    console.log('Updating statistics...');
} 