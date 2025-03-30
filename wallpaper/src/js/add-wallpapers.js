// Initialize data manager if not already initialized
if (!window.dataManager) {
    window.dataManager = new DataManager();
}

// Only initialize if no wallpapers exist
if (!localStorage.getItem('wallpapers') || JSON.parse(localStorage.getItem('wallpapers')).length === 0) {
    // Add wallpapers
    const wallpapers = [
        {
            title: 'Mountain Peak at Sunset',
            category: 'Nature',
            thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
        },
        {
            title: 'Neon City Lights',
            category: 'City',
            thumbnail: 'https://images.unsplash.com/photo-1545858745-96893513e137?w=800'
        },
        {
            title: 'Colorful Abstract Waves',
            category: 'Abstract',
            thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800'
        },
        {
            title: 'Circuit Board Close-up',
            category: 'Technology',
            thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800'
        },
        {
            title: 'Minimalist Architecture',
            category: 'Minimal',
            thumbnail: 'https://images.unsplash.com/photo-1507149833265-60c372daea22?w=800'
        },
        {
            title: 'Snow Leopard',
            category: 'Animals',
            thumbnail: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800'
        },
        {
            title: 'Misty Forest Path',
            category: 'Nature',
            thumbnail: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800'
        },
        {
            title: 'Tokyo Night Streets',
            category: 'City',
            thumbnail: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800'
        },
        {
            title: 'Geometric Patterns',
            category: 'Abstract',
            thumbnail: 'https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=800'
        },
        {
            title: 'Futuristic Interface',
            category: 'Technology',
            thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800'
        }
    ];

    // Add wallpapers to localStorage
    wallpapers.forEach(wallpaper => {
        window.dataManager.addWallpaper(wallpaper);
    });

    console.log('Added', wallpapers.length, 'default wallpapers successfully!');
} else {
    console.log('Using existing wallpapers from storage');
} 