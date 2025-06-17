// AFIT Campus Navigator - Main Application Logic

class CampusNavigator {
  constructor() {
    this.currentUser = null;
    this.map = null;
    this.previewMap = null;
    this.currentTab = 'dashboard';
    this.markers = new Map();
    this.radiusCircles = [];
    this.showingRadiusRings = true;
    this.mapType = 'roadmap';
    this.searchResults = [];
    this.fuse = null;
    this.isOnline = navigator.onLine;
    this.accessibilitySettings = {
      fontSize: 'normal',
      highContrast: false,
      theme: localStorage.getItem('theme') || 'light'
    };

    this.init();
  }

  async init() {
    console.log('Initializing AFIT Campus Navigator...');
    
    // Apply saved theme
    this.applyTheme();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Initialize search
    this.initializeSearch();
    
    // Setup offline detection
    this.setupOfflineDetection();
    
    // Setup accessibility controls
    this.setupAccessibilityControls();
    
    // Wait for Firebase to be ready
    this.waitForFirebase().then(() => {
      // Auth state observer
      window.firebaseApp.auth.onAuthStateChanged((user) => {
        if (user) {
          this.handleUserSignIn(user);
        } else {
          this.handleUserSignOut();
        }
      });
    });

    // Load geofence data
    await this.loadGeofenceData();
    
    console.log('AFIT Campus Navigator initialized');
  }

  async waitForFirebase() {
    return new Promise((resolve) => {
      const checkFirebase = () => {
        if (window.firebaseApp && window.firebaseApp.auth) {
          resolve();
        } else {
          setTimeout(checkFirebase, 100);
        }
      };
      checkFirebase();
    });
  }

  applyTheme() {
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    
    if (this.accessibilitySettings.theme === 'dark') {
      html.classList.add('dark');
      if (themeToggle) themeToggle.innerHTML = '<span class="text-sm dark:text-white">☀️</span>';
    } else {
      html.classList.remove('dark');
      if (themeToggle) themeToggle.innerHTML = '<span class="text-sm dark:text-white">🌙</span>';
    }
  }

  toggleTheme() {
    this.accessibilitySettings.theme = this.accessibilitySettings.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.accessibilitySettings.theme);
    this.applyTheme();
    this.saveAccessibilitySettings();
  }

  setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => this.handleSignup(e));
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
      searchInput.addEventListener('focus', () => this.showSearchResults());
      searchInput.addEventListener('blur', () => {
        setTimeout(() => this.hideSearchResults(), 200);
      });
    }

    // Window events
    window.addEventListener('resize', () => this.handleResize());
    
    // PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => this.handleInstallPrompt(e));
  }

  setupAccessibilityControls() {
    // Font size control
    const fontSizeBtn = document.getElementById('fontSizeBtn');
    if (fontSizeBtn) {
      fontSizeBtn.addEventListener('click', () => this.cycleFontSize());
    }

    // High contrast control
    const contrastBtn = document.getElementById('contrastBtn');
    if (contrastBtn) {
      contrastBtn.addEventListener('click', () => this.toggleHighContrast());
    }

    // Load saved settings
    this.loadAccessibilitySettings();
  }

  cycleFontSize() {
    const sizes = ['small', 'normal', 'large', 'xl'];
    const currentIndex = sizes.indexOf(this.accessibilitySettings.fontSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    this.accessibilitySettings.fontSize = sizes[nextIndex];
    
    document.body.className = document.body.className.replace(/font-size-\w+/g, '');
    document.body.classList.add(`font-size-${this.accessibilitySettings.fontSize}`);
    
    this.saveAccessibilitySettings();
  }

  toggleHighContrast() {
    this.accessibilitySettings.highContrast = !this.accessibilitySettings.highContrast;
    
    if (this.accessibilitySettings.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    this.saveAccessibilitySettings();
  }

  saveAccessibilitySettings() {
    localStorage.setItem('afit_accessibility', JSON.stringify(this.accessibilitySettings));
  }

  loadAccessibilitySettings() {
    const saved = localStorage.getItem('afit_accessibility');
    if (saved) {
      this.accessibilitySettings = { ...this.accessibilitySettings, ...JSON.parse(saved) };
      
      // Apply settings
      document.body.classList.add(`font-size-${this.accessibilitySettings.fontSize}`);
      if (this.accessibilitySettings.highContrast) {
        document.body.classList.add('high-contrast');
      }
    }
  }

  initializeSearch() {
    // Prepare search data
    const searchData = window.AFIT_DATA.GEOFENCE_CONFIG.locations.map(location => ({
      id: location.id,
      name: location.name,
      type: location.type,
      description: window.AFIT_DATA.BUILDING_DETAILS[location.id]?.description || '',
      facilities: window.AFIT_DATA.BUILDING_DETAILS[location.id]?.facilities || []
    }));

    // Initialize Fuse.js
    this.fuse = new Fuse(searchData, {
      keys: ['name', 'type', 'description', 'facilities'],
      threshold: 0.3,
      includeScore: true
    });
  }

  setupOfflineDetection() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.updateOfflineIndicator();
      this.syncOfflineData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.updateOfflineIndicator();
    });

    this.updateOfflineIndicator();
  }

  updateOfflineIndicator() {
    const indicator = document.getElementById('offlineIndicator');
    if (this.isOnline) {
      indicator.classList.remove('show');
    } else {
      indicator.classList.add('show');
    }
  }

  async loadGeofenceData() {
    try {
      // Data is already loaded from geofence-data.js
      console.log('Geofence data loaded:', window.AFIT_DATA);
    } catch (error) {
      console.error('Error loading geofence data:', error);
    }
  }

  // Authentication Methods
  async handleLogin(e) {
    e.preventDefault();
    this.showLoading();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
      const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
      await signInWithEmailAndPassword(window.firebaseApp.auth, email, password);
      this.hideModals();
    } catch (error) {
      console.error('Login error:', error);
      this.showNotification('Login Failed', error.message, 'error');
    } finally {
      this.hideLoading();
    }
  }

  async handleSignup(e) {
    e.preventDefault();
    this.showLoading();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const role = document.getElementById('signupRole').value;
    
    try {
      const { createUserWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
      const { doc, setDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
      
      const userCredential = await createUserWithEmailAndPassword(window.firebaseApp.auth, email, password);
      const user = userCredential.user;
      
      // Create user profile
      await setDoc(doc(window.firebaseApp.db, 'users', user.uid), {
        name: name,
        email: email,
        role: role,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        points: 0,
        badges: [],
        preferences: {
          notifications: true,
          theme: this.accessibilitySettings.theme
        }
      });
      
      this.hideModals();
      this.showNotification('Success', 'Account created successfully!', 'success');
    } catch (error) {
      console.error('Signup error:', error);
      this.showNotification('Signup Failed', error.message, 'error');
    } finally {
      this.hideLoading();
    }
  }

  // Google Maps Integration
  initializePreviewMap() {
    if (!window.google || !window.google.maps) {
      console.error('Google Maps API not loaded');
      return;
    }

    const center = window.AFIT_DATA.GEOFENCE_CONFIG.center;
    
    this.previewMap = new google.maps.Map(document.getElementById('previewMap'), {
      center: { lat: center.latitude, lng: center.longitude },
      zoom: 15,
      mapTypeId: 'satellite',
      tilt: 45,
      rotateControl: true,
      streetViewControl: false,
      fullscreenControl: false
    });

    // Add markers for preview
    window.AFIT_DATA.GEOFENCE_CONFIG.locations.forEach(location => {
      this.addBuildingMarker(this.previewMap, location, true);
    });

    // Add radius circles
    this.addRadiusCircles(this.previewMap, center);
  }

  addBuildingMarker(map, location, isPreview = false) {
    const details = window.AFIT_DATA.BUILDING_DETAILS[location.id] || {};
    const color = window.AFIT_DATA.BUILDING_TYPE_COLORS[location.type] || '#666666';
    
    const marker = new google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map: map,
      title: location.name,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: color,
        fillOpacity: 0.8,
        strokeWeight: 2,
        strokeColor: '#ffffff'
      },
      animation: google.maps.Animation.DROP
    });

    if (!isPreview) {
      marker.addListener('click', () => {
        this.showBuildingInfo(location, details, marker);
      });
      
      this.markers.set(location.id, marker);
    }

    return marker;
  }

  addRadiusCircles(map, center) {
    const circles = [];
    const colors = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    
    window.AFIT_DATA.GEOFENCE_CONFIG.radii.forEach((radius, index) => {
      const circle = new google.maps.Circle({
        strokeColor: colors[index],
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: colors[index],
        fillOpacity: 0.1,
        map: map,
        center: { lat: center.latitude, lng: center.longitude },
        radius: radius
      });
      
      circles.push(circle);
    });
    
    return circles;
  }

  // Utility Methods
  showLoading() {
    document.getElementById('loadingSpinner').classList.remove('hidden');
  }

  hideLoading() {
    document.getElementById('loadingSpinner').classList.add('hidden');
  }

  showNotification(title, message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${this.getNotificationColor(type)}`;
    notification.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="flex-1">
          <h4 class="font-medium">${title}</h4>
          <p class="text-sm opacity-90">${message}</p>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="text-white opacity-60 hover:opacity-100">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  getNotificationColor(type) {
    const colors = {
      'success': 'bg-green-500 text-white',
      'error': 'bg-red-500 text-white',
      'warning': 'bg-yellow-500 text-white',
      'info': 'bg-blue-500 text-white'
    };
    return colors[type] || colors.info;
  }

  handleResize() {
    if (this.map) {
      google.maps.event.trigger(this.map, 'resize');
    }
    if (this.previewMap) {
      google.maps.event.trigger(this.previewMap, 'resize');
    }
  }

  handleInstallPrompt(e) {
    e.preventDefault();
    this.deferredPrompt = e;
    
    // Show install banner
    this.showNotification(
      'Install App', 
      'Add AFIT Campus Navigator to your home screen for quick access!', 
      'info'
    );
  }

  async syncOfflineData() {
    if (!this.isOnline) return;

    try {
      // Sync any offline data when coming back online
      console.log('Syncing offline data...');
      
      // Re-enable Firestore
      await firebaseApp.db.enableNetwork();
      
      // Reload current tab data
      switch (this.currentTab) {
        case 'dashboard':
          this.loadDashboardData();
          break;
        case 'buildings':
          this.loadBuildingsData();
          break;
        case 'events':
          this.loadEventsData();
          break;
        case 'safety':
          this.loadSafetyData();
          break;
      }
      
    } catch (error) {
      console.error('Error syncing offline data:', error);
    }
  }

  logout() {
    firebaseApp.auth.signOut();
  }

  showApp() {
    document.getElementById('landingPage').classList.add('hidden');
    document.getElementById('campusApp').classList.remove('hidden');
    
    // Update user info
    document.getElementById('userInfo').textContent = `Welcome, ${this.currentUser.name}`;
    
    // Show admin tab if user is admin
    if (this.currentUser.role === 'admin') {
      document.getElementById('adminTab').classList.remove('hidden');
    }
    
    // Initialize maps
    this.initializeCampusMap();
    
    // Load initial data
    this.loadBuildingsData();
    this.loadEventsData();
    this.loadSafetyData();
    
    if (this.currentUser.role === 'admin') {
      this.loadAdminData();
    }
  }

  showLanding() {
    document.getElementById('campusApp').classList.add('hidden');
    document.getElementById('landingPage').classList.remove('hidden');
    
    // Initialize preview map
    if (!this.previewMap) {
      this.initializePreviewMap();
    }
  }

  showTab(tabName) {
    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.add('hidden');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('[id$="Tab"]').forEach(tab => {
      tab.classList.remove('border-blue-500', 'text-blue-600');
      tab.classList.add('border-transparent', 'text-gray-500');
      tab.style.borderColor = 'transparent';
      tab.style.color = '#6B7280';
    });
    
    // Show selected tab content
    document.getElementById(tabName + 'Content').classList.remove('hidden');
    
    // Add active class to selected tab
    const activeTab = document.getElementById(tabName + 'Tab');
    activeTab.classList.add('border-blue-500', 'text-blue-600');
    activeTab.classList.remove('border-transparent', 'text-gray-500');
    activeTab.style.borderColor = 'var(--afit-primary)';
    activeTab.style.color = 'var(--afit-primary)';
    
    this.currentTab = tabName;
    
    // Tab-specific initialization
    if (tabName === 'map' && this.map) {
      google.maps.event.trigger(this.map, 'resize');
    }
  }
}

// Global functions for HTML onclick handlers
function showLogin() {
  campusNav.showLogin();
}

function showSignup() {
  campusNav.showSignup();
}

function hideModals() {
  campusNav.hideModals();
}

// Google Maps callback
function initMap() {
  console.log('Google Maps API loaded');
  // Initialize preview map when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        if (window.campusNav) {
          window.campusNav.initializePreviewMap();
        }
      }, 100);
    });
  } else {
    setTimeout(() => {
      if (window.campusNav) {
        window.campusNav.initializePreviewMap();
      }
    }, 100);
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.campusNav = new CampusNavigator();
});

// Modal functions
CampusNavigator.prototype.showLogin = function() {
  this.hideModals();
  document.getElementById('loginModal').classList.remove('hidden');
  document.getElementById('loginModal').classList.add('flex');
};

CampusNavigator.prototype.showSignup = function() {
  this.hideModals();
  document.getElementById('signupModal').classList.remove('hidden');
  document.getElementById('signupModal').classList.add('flex');
};

CampusNavigator.prototype.hideModals = function() {
  document.getElementById('loginModal').classList.add('hidden');
  document.getElementById('loginModal').classList.remove('flex');
  document.getElementById('signupModal').classList.add('hidden');
  document.getElementById('signupModal').classList.remove('flex');
};

// Fade in animations
document.addEventListener('DOMContentLoaded', function() {
  const fadeElements = document.querySelectorAll('.fade-in');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  });
  
  fadeElements.forEach(el => observer.observe(el));
});
