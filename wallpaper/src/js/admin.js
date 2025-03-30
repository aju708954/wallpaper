// Theme toggle functionality (reused from main.js)
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

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

// Admin Authentication Check
function checkAuth() {
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession !== 'true') {
        window.location.href = 'login.html';
    }
}

// Initialize dashboard
function initializeDashboard() {
    updateStatistics();
    loadWallpapers();
    setupEventListeners();
}

// Update dashboard statistics
function updateStatistics() {
    const stats = window.dataManager.getStatistics();
    
    document.getElementById('totalWallpapers').textContent = stats.totalWallpapers;
    document.getElementById('totalDownloads').textContent = stats.totalDownloads;
    document.getElementById('totalLikes').textContent = stats.totalLikes;
    document.getElementById('totalCategories').textContent = stats.totalCategories;
}

// Load wallpapers into table
function loadWallpapers() {
    const wallpapers = window.dataManager.getAllWallpapers();
    const tableBody = document.querySelector('#wallpaperTable tbody');
    
    tableBody.innerHTML = wallpapers.map(wallpaper => `
        <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0">
                        <img class="h-10 w-10 rounded object-cover" src="${wallpaper.thumbnail}" alt="">
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-gray-200">
                            ${wallpaper.title}
                        </div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    ${wallpaper.category}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                ${wallpaper.downloads}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                ${wallpaper.likes}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                ${new Date(wallpaper.dateAdded).toLocaleDateString()}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="edit-btn text-blue-600 hover:text-blue-900 mr-3" data-id="${wallpaper.id}">
                    Edit
                </button>
                <button class="delete-btn text-red-600 hover:text-red-900" data-id="${wallpaper.id}">
                    Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Handle wallpaper form submission
function handleWallpaperSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    const wallpaperData = {
        title: formData.get('title'),
        category: formData.get('category'),
        thumbnail: formData.get('thumbnail')
    };
    
    try {
        if (form.dataset.editId) {
            // Update existing wallpaper
            window.dataManager.updateWallpaper(parseInt(form.dataset.editId), wallpaperData);
            showToast('Wallpaper updated successfully!');
        } else {
            // Add new wallpaper
            window.dataManager.addWallpaper(wallpaperData);
            showToast('Wallpaper added successfully!');
        }
        
        // Reset form and update UI
        form.reset();
        delete form.dataset.editId;
        document.getElementById('uploadForm').classList.add('hidden');
        loadWallpapers();
        updateStatistics();
    } catch (error) {
        showToast('Error: ' + error.message, 5000);
    }
}

// Handle wallpaper deletion
function handleDelete(id) {
    if (confirm('Are you sure you want to delete this wallpaper?')) {
        try {
            window.dataManager.deleteWallpaper(parseInt(id));
            loadWallpapers();
            updateStatistics();
            showToast('Wallpaper deleted successfully!');
        } catch (error) {
            showToast('Error: ' + error.message, 5000);
        }
    }
}

// Handle wallpaper edit
function handleEdit(id) {
    const wallpaper = window.dataManager.getAllWallpapers().find(w => w.id === parseInt(id));
    if (!wallpaper) {
        showToast('Error: Wallpaper not found', 5000);
        return;
    }
    
    const form = document.getElementById('wallpaperForm');
    form.dataset.editId = id;
    
    // Populate form fields
    form.querySelector('input[name="title"]').value = wallpaper.title;
    form.querySelector('select[name="category"]').value = wallpaper.category;
    form.querySelector('input[name="thumbnail"]').value = wallpaper.thumbnail;
    
    // Show form
    document.getElementById('uploadForm').classList.remove('hidden');
}

// Show toast notification
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg transform translate-y-full opacity-0 transition-all duration-300';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.remove('translate-y-full', 'opacity-0');
    }, 100);
    
    // Hide and remove toast
    setTimeout(() => {
        toast.classList.add('translate-y-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Setup event listeners
function setupEventListeners() {
    // Add Wallpaper button
    document.getElementById('addWallpaperBtn').addEventListener('click', () => {
        const form = document.getElementById('wallpaperForm');
        form.reset();
        delete form.dataset.editId;
        document.getElementById('uploadForm').classList.remove('hidden');
    });
    
    // Cancel button
    document.getElementById('cancelUpload').addEventListener('click', () => {
        const form = document.getElementById('wallpaperForm');
        form.reset();
        delete form.dataset.editId;
        document.getElementById('uploadForm').classList.add('hidden');
    });
    
    // Form submission
    document.getElementById('wallpaperForm').addEventListener('submit', handleWallpaperSubmit);
    
    // Table actions (Edit/Delete buttons)
    document.getElementById('wallpaperTable').addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-btn');
        const deleteBtn = e.target.closest('.delete-btn');
        
        if (editBtn) {
            handleEdit(editBtn.dataset.id);
        } else if (deleteBtn) {
            handleDelete(deleteBtn.dataset.id);
        }
    });
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('adminSession');
        window.location.href = '/';
    });
}

// Initialize the admin panel
checkAuth();
initializeDashboard(); 