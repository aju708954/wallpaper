// Data Manager Class
class DataManager {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        // Initialize wallpapers if not exists
        if (!localStorage.getItem('wallpapers')) {
            localStorage.setItem('wallpapers', JSON.stringify(this.getDefaultWallpapers()));
        }

        // Initialize categories if not exists
        if (!localStorage.getItem('categories')) {
            localStorage.setItem('categories', JSON.stringify(this.getDefaultCategories()));
        }

        // Initialize admin credentials if not exists
        if (!localStorage.getItem('adminCredentials')) {
            localStorage.setItem('adminCredentials', JSON.stringify({
                username: 'admin',
                password: 'admin123' // In real app, use proper authentication
            }));
        }
    }

    // Wallpaper Methods
    getAllWallpapers() {
        return JSON.parse(localStorage.getItem('wallpapers')) || [];
    }

    addWallpaper(wallpaper) {
        const wallpapers = this.getAllWallpapers();
        wallpaper.id = this.generateId(wallpapers);
        wallpaper.dateAdded = new Date().toISOString();
        wallpaper.downloads = 0;
        wallpaper.likes = 0;
        wallpapers.push(wallpaper);
        localStorage.setItem('wallpapers', JSON.stringify(wallpapers));
        return wallpaper;
    }

    updateWallpaper(id, updatedData) {
        const wallpapers = this.getAllWallpapers();
        const index = wallpapers.findIndex(w => w.id === id);
        if (index !== -1) {
            wallpapers[index] = { ...wallpapers[index], ...updatedData };
            localStorage.setItem('wallpapers', JSON.stringify(wallpapers));
            return wallpapers[index];
        }
        return null;
    }

    deleteWallpaper(id) {
        const wallpapers = this.getAllWallpapers();
        const filteredWallpapers = wallpapers.filter(w => w.id !== id);
        localStorage.setItem('wallpapers', JSON.stringify(filteredWallpapers));
    }

    // Category Methods
    getAllCategories() {
        return JSON.parse(localStorage.getItem('categories')) || [];
    }

    addCategory(category) {
        const categories = this.getAllCategories();
        category.id = this.generateId(categories);
        categories.push(category);
        localStorage.setItem('categories', JSON.stringify(categories));
        return category;
    }

    updateCategory(id, updatedData) {
        const categories = this.getAllCategories();
        const index = categories.findIndex(c => c.id === id);
        if (index !== -1) {
            categories[index] = { ...categories[index], ...updatedData };
            localStorage.setItem('categories', JSON.stringify(categories));
            return categories[index];
        }
        return null;
    }

    deleteCategory(id) {
        const categories = this.getAllCategories();
        const filteredCategories = categories.filter(c => c.id !== id);
        localStorage.setItem('categories', JSON.stringify(filteredCategories));
    }

    // Statistics Methods
    getStatistics() {
        const wallpapers = this.getAllWallpapers();
        const categories = this.getAllCategories();
        
        return {
            totalWallpapers: wallpapers.length,
            totalDownloads: wallpapers.reduce((sum, w) => sum + w.downloads, 0),
            totalLikes: wallpapers.reduce((sum, w) => sum + w.likes, 0),
            totalCategories: categories.length,
            popularCategories: this.getPopularCategories(),
            recentUploads: this.getRecentUploads(),
            topDownloaded: this.getTopDownloaded()
        };
    }

    // Helper Methods
    generateId(items) {
        const maxId = items.reduce((max, item) => Math.max(max, item.id), 0);
        return maxId + 1;
    }

    getPopularCategories() {
        const wallpapers = this.getAllWallpapers();
        const categoryStats = {};
        
        wallpapers.forEach(wallpaper => {
            if (!categoryStats[wallpaper.category]) {
                categoryStats[wallpaper.category] = {
                    downloads: 0,
                    likes: 0,
                    count: 0
                };
            }
            categoryStats[wallpaper.category].downloads += wallpaper.downloads;
            categoryStats[wallpaper.category].likes += wallpaper.likes;
            categoryStats[wallpaper.category].count++;
        });

        return Object.entries(categoryStats)
            .map(([name, stats]) => ({
                name,
                ...stats
            }))
            .sort((a, b) => b.downloads - a.downloads);
    }

    getRecentUploads(limit = 5) {
        return this.getAllWallpapers()
            .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
            .slice(0, limit);
    }

    getTopDownloaded(limit = 5) {
        return this.getAllWallpapers()
            .sort((a, b) => b.downloads - a.downloads)
            .slice(0, limit);
    }

    // Default Data
    getDefaultWallpapers() {
        return [];
    }

    getDefaultCategories() {
        return [
            {
                id: 1,
                name: 'Nature',
                image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300',
                count: 0
            },
            {
                id: 2,
                name: 'City',
                image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300',
                count: 0
            },
            {
                id: 3,
                name: 'Abstract',
                image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300',
                count: 0
            },
            {
                id: 4,
                name: 'Technology',
                image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300',
                count: 0
            },
            {
                id: 5,
                name: 'Minimal',
                image: 'https://images.unsplash.com/photo-1507149833265-60c372daea22?w=300',
                count: 0
            },
            {
                id: 6,
                name: 'Animals',
                image: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=300',
                count: 0
            }
        ];
    }
}

// Export the DataManager instance
window.dataManager = new DataManager(); 