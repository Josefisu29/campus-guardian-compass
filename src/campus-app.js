
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
      language: 'en'
    };

    this.init();
  }

  async init() {
    console.log('Initializing AFIT Campus Navigator...');
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Initialize search
    this.initializeSearch();
    
    // Setup offline detection
    this.setupOfflineDetection();
    
    // Setup accessibility controls
    this.setupAccessibilityControls();
    
    // Auth state observer
    firebaseApp.auth.onAuthStateChanged((user) => {
      if (user) {
        this.handleUserSignIn(user);
      } else {
        this.handleUserSignOut();
      }
    });

    // Load geofence data
    await this.loadGeofenceData();
    
    console.log('AFIT Campus Navigator initialized');
  }

  setupEventListeners() {
    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
    document.getElementById('signupForm').addEventListener('submit', (e) => this.handleSignup(e));
    document.getElementById('incidentForm').addEventListener('submit', (e) => this.handleIncidentReport(e));

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
      searchInput.addEventListener('focus', () => this.showSearchResults());
      searchInput.addEventListener('blur', () => {
        setTimeout(() => this.hideSearchResults(), 200);
      });
    }

    // Building filters
    const buildingTypeFilter = document.getElementById('buildingTypeFilter');
    const buildingSearch = document.getElementById('buildingSearch');
    if (buildingTypeFilter) {
      buildingTypeFilter.addEventListener('change', () => this.filterBuildings());
    }
    if (buildingSearch) {
      buildingSearch.addEventListener('input', () => this.filterBuildings());
    }

    // Event filters
    const eventDateFilter = document.getElementById('eventDateFilter');
    const eventTypeFilter = document.getElementById('eventTypeFilter');
    if (eventDateFilter) {
      eventDateFilter.addEventListener('change', () => this.filterEvents());
    }
    if (eventTypeFilter) {
      eventTypeFilter.addEventListener('change', () => this.filterEvents());
    }

    // Window events
    window.addEventListener('resize', () => this.handleResize());
    
    // PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => this.handleInstallPrompt(e));
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

  setupAccessibilityControls() {
    // Font size control
    document.getElementById('fontSizeBtn').addEventListener('click', () => {
      this.cycleFontSize();
    });

    // High contrast control
    document.getElementById('contrastBtn').addEventListener('click', () => {
      this.toggleHighContrast();
    });

    // Language control
    document.getElementById('languageBtn').addEventListener('click', () => {
      this.cycleLanguage();
    });

    // Load saved settings
    this.loadAccessibilitySettings();
  }

  updateOfflineIndicator() {
    const indicator = document.getElementById('offlineIndicator');
    if (this.isOnline) {
      indicator.classList.remove('show');
    } else {
      indicator.classList.add('show');
    }
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

  cycleLanguage() {
    const languages = ['en', 'ha']; // English, Hausa
    const currentIndex = languages.indexOf(this.accessibilitySettings.language);
    const nextIndex = (currentIndex + 1) % languages.length;
    this.accessibilitySettings.language = languages[nextIndex];
    
    // Here you would implement i18n language switching
    console.log('Language switched to:', this.accessibilitySettings.language);
    
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
      await firebaseApp.auth.signInWithEmailAndPassword(email, password);
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
      const userCredential = await firebaseApp.auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Create user profile
      await firebaseApp.db.collection('users').doc(user.uid).set({
        name: name,
        email: email,
        role: role,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
        points: 0,
        badges: [],
        preferences: {
          notifications: true,
          language: 'en'
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

  async handleUserSignIn(user) {
    try {
      // Get user profile
      const userDoc = await firebaseApp.db.collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        this.currentUser = {
          uid: user.uid,
          email: user.email,
          ...userDoc.data()
        };
        
        // Update last login
        await firebaseApp.db.collection('users').doc(user.uid).update({
          lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Set user as online in Realtime Database
        await firebaseApp.rtdb.ref(`onlineUsers/${user.uid}`).set({
          isOnline: true,
          lastSeen: firebase.database.ServerValue.TIMESTAMP,
          name: this.currentUser.name,
          email: this.currentUser.email
        });
        
        // Set up disconnect handler
        firebaseApp.rtdb.ref(`onlineUsers/${user.uid}`).onDisconnect().update({
          isOnline: false,
          lastSeen: firebase.database.ServerValue.TIMESTAMP
        });
        
        this.showApp();
        this.loadDashboardData();
      }
    } catch (error) {
      console.error('Error handling user sign in:', error);
    }
  }

  handleUserSignOut() {
    this.currentUser = null;
    this.showLanding();
  }

  // UI Navigation Methods
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

  // Modal Methods
  showLogin() {
    this.hideModals();
    document.getElementById('loginModal').classList.remove('hidden');
    document.getElementById('loginModal').classList.add('flex');
  }

  showSignup() {
    this.hideModals();
    document.getElementById('signupModal').classList.remove('hidden');
    document.getElementById('signupModal').classList.add('flex');
  }

  hideModals() {
    document.getElementById('loginModal').classList.add('hidden');
    document.getElementById('loginModal').classList.remove('flex');
    document.getElementById('signupModal').classList.add('hidden');
    document.getElementById('signupModal').classList.remove('flex');
  }

  // Map Methods
  initializePreviewMap() {
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

  initializeCampusMap() {
    const center = window.AFIT_DATA.GEOFENCE_CONFIG.center;
    
    this.map = new google.maps.Map(document.getElementById('campusMap'), {
      center: { lat: center.latitude, lng: center.longitude },
      zoom: 16,
      mapTypeId: 'satellite',
      tilt: 45,
      rotateControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      mapTypeControl: true
    });

    // Add building markers
    window.AFIT_DATA.GEOFENCE_CONFIG.locations.forEach(location => {
      this.addBuildingMarker(this.map, location, false);
    });

    // Add radius circles
    this.addRadiusCircles(this.map, center);

    // Add info window
    this.infoWindow = new google.maps.InfoWindow();
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
    
    if (map === this.map) {
      this.radiusCircles = circles;
    }
    
    return circles;
  }

  showBuildingInfo(location, details, marker) {
    const content = `
      <div class="p-3 max-w-sm">
        <h3 class="font-bold text-lg mb-2" style="color: var(--afit-primary);">${location.name}</h3>
        <p class="text-gray-600 text-sm mb-3">${details.description || 'Campus building'}</p>
        <div class="space-y-1 text-xs text-gray-500">
          <div><strong>Type:</strong> ${location.type}</div>
          ${details.capacity ? `<div><strong>Capacity:</strong> ${details.capacity}</div>` : ''}
          ${details.yearBuilt ? `<div><strong>Built:</strong> ${details.yearBuilt}</div>` : ''}
        </div>
        <button onclick="campusNav.showBuildingDetail('${location.id}')" 
                class="mt-3 px-4 py-2 text-white rounded text-sm" 
                style="background-color: var(--afit-primary);">
          View Details
        </button>
      </div>
    `;
    
    this.infoWindow.setContent(content);
    this.infoWindow.open(this.map, marker);
  }

  toggleRadiusRings() {
    this.showingRadiusRings = !this.showingRadiusRings;
    
    this.radiusCircles.forEach(circle => {
      circle.setVisible(this.showingRadiusRings);
    });
    
    const button = document.getElementById('radiusToggle');
    button.textContent = this.showingRadiusRings ? 'Hide Rings' : 'Show Rings';
  }

  toggleMapType() {
    this.mapType = this.mapType === 'roadmap' ? 'satellite' : 'roadmap';
    this.map.setMapTypeId(this.mapType);
    
    const button = document.getElementById('satelliteToggle');
    button.textContent = this.mapType === 'satellite' ? 'Roadmap' : 'Satellite';
  }

  centerOnCampus() {
    const center = window.AFIT_DATA.GEOFENCE_CONFIG.center;
    this.map.setCenter({ lat: center.latitude, lng: center.longitude });
    this.map.setZoom(16);
  }

  // Search Methods
  handleSearch(query) {
    if (!query.trim()) {
      this.searchResults = [];
      this.hideSearchResults();
      return;
    }

    const results = this.fuse.search(query).slice(0, 5);
    this.searchResults = results.map(result => result.item);
    this.displaySearchResults();
  }

  displaySearchResults() {
    const container = document.getElementById('searchResults');
    if (!container) return;

    if (this.searchResults.length === 0) {
      container.innerHTML = '<div class="p-3 text-gray-500 text-sm">No results found</div>';
    } else {
      container.innerHTML = this.searchResults.map(result => `
        <div class="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
             onclick="campusNav.selectSearchResult('${result.id}')">
          <div class="font-medium">${result.name}</div>
          <div class="text-sm text-gray-600">${result.type}</div>
        </div>
      `).join('');
    }
    
    this.showSearchResults();
  }

  showSearchResults() {
    const container = document.getElementById('searchResults');
    if (container) {
      container.classList.remove('hidden');
    }
  }

  hideSearchResults() {
    const container = document.getElementById('searchResults');
    if (container) {
      container.classList.add('hidden');
    }
  }

  selectSearchResult(buildingId) {
    // Switch to map tab
    this.showTab('map');
    
    // Center map on building
    const location = window.AFIT_DATA.GEOFENCE_CONFIG.locations.find(loc => loc.id === buildingId);
    if (location && this.map) {
      this.map.setCenter({ lat: location.lat, lng: location.lng });
      this.map.setZoom(18);
      
      // Trigger marker click
      const marker = this.markers.get(buildingId);
      if (marker) {
        google.maps.event.trigger(marker, 'click');
      }
    }
    
    this.hideSearchResults();
    document.getElementById('searchInput').value = location ? location.name : '';
  }

  // Building Methods
  async loadBuildingsData() {
    try {
      const buildingsSnapshot = await firebaseApp.db.collection('buildings').get();
      const buildings = [];
      
      buildingsSnapshot.forEach(doc => {
        buildings.push({ id: doc.id, ...doc.data() });
      });
      
      this.displayBuildings(buildings);
    } catch (error) {
      console.error('Error loading buildings:', error);
      // Use default data if Firebase fails
      this.displayBuildings(this.getDefaultBuildings());
    }
  }

  getDefaultBuildings() {
    return window.AFIT_DATA.GEOFENCE_CONFIG.locations.map(location => ({
      id: location.id,
      name: location.name,
      type: location.type,
      ...window.AFIT_DATA.BUILDING_DETAILS[location.id]
    }));
  }

  displayBuildings(buildings) {
    const container = document.getElementById('buildingsGrid');
    if (!container) return;

    container.innerHTML = buildings.map(building => `
      <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        <div class="h-48 bg-gray-200 relative">
          <img src="${building.images && building.images[0] || '/placeholder.svg'}" 
               alt="${building.name}"
               class="w-full h-full object-cover"
               onerror="this.src='/placeholder.svg'">
          <div class="absolute top-2 right-2 px-2 py-1 rounded text-xs text-white"
               style="background-color: ${window.AFIT_DATA.BUILDING_TYPE_COLORS[building.type] || '#666'};">
            ${building.type}
          </div>
        </div>
        <div class="p-4">
          <h3 class="font-bold text-lg mb-2" style="color: var(--afit-primary);">${building.name}</h3>
          <p class="text-gray-600 text-sm mb-3 line-clamp-2">${building.description || 'Campus building'}</p>
          <div class="flex justify-between items-center">
            <div class="text-xs text-gray-500">
              ${building.capacity ? `Capacity: ${building.capacity}` : ''}
            </div>
            <button onclick="campusNav.showBuildingDetail('${building.id}')"
                    class="px-3 py-1 text-white rounded text-sm"
                    style="background-color: var(--afit-primary);">
              View Details
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  filterBuildings() {
    const typeFilter = document.getElementById('buildingTypeFilter').value;
    const searchFilter = document.getElementById('buildingSearch').value.toLowerCase();
    
    const buildingCards = document.querySelectorAll('#buildingsGrid > div');
    
    buildingCards.forEach(card => {
      const buildingName = card.querySelector('h3').textContent.toLowerCase();
      const buildingType = card.querySelector('.absolute').textContent.trim();
      
      const matchesType = !typeFilter || buildingType === typeFilter;
      const matchesSearch = !searchFilter || buildingName.includes(searchFilter);
      
      if (matchesType && matchesSearch) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  showBuildingDetail(buildingId) {
    const location = window.AFIT_DATA.GEOFENCE_CONFIG.locations.find(loc => loc.id === buildingId);
    const details = window.AFIT_DATA.BUILDING_DETAILS[buildingId] || {};
    
    if (!location) return;

    // Populate modal
    document.getElementById('buildingModalTitle').textContent = location.name;
    document.getElementById('buildingDescription').textContent = details.description || 'Campus building';
    
    // Facilities
    const facilitiesContainer = document.getElementById('buildingFacilities');
    if (details.facilities && details.facilities.length > 0) {
      facilitiesContainer.innerHTML = details.facilities.map(facility => 
        `<li class="flex items-center space-x-2"><span>•</span><span>${facility}</span></li>`
      ).join('');
    } else {
      facilitiesContainer.innerHTML = '<li>No facilities information available</li>';
    }
    
    // Details
    const detailsContainer = document.getElementById('buildingDetails');
    detailsContainer.innerHTML = `
      <div class="text-sm space-y-1">
        <div><strong>Type:</strong> ${location.type}</div>
        ${details.capacity ? `<div><strong>Capacity:</strong> ${details.capacity}</div>` : ''}
        ${details.yearBuilt ? `<div><strong>Year Built:</strong> ${details.yearBuilt}</div>` : ''}
        <div><strong>Coordinates:</strong> ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}</div>
      </div>
    `;

    // Images
    const imagesContainer = document.getElementById('buildingImages');
    if (details.images && details.images.length > 0) {
      imagesContainer.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${details.images.map(img => `
            <img src="${img}" alt="${location.name}" 
                 class="w-full h-48 object-cover rounded-lg"
                 onerror="this.src='/placeholder.svg'">
          `).join('')}
        </div>
      `;
    } else {
      imagesContainer.innerHTML = `
        <img src="/placeholder.svg" alt="${location.name}" 
             class="w-full h-48 object-cover rounded-lg">
      `;
    }

    // Show modal
    document.getElementById('buildingModal').classList.remove('hidden');
    document.getElementById('buildingModal').classList.add('flex');
  }

  closeBuildingModal() {
    document.getElementById('buildingModal').classList.add('hidden');
    document.getElementById('buildingModal').classList.remove('flex');
  }

  // Events Methods
  async loadEventsData() {
    try {
      const eventsSnapshot = await firebaseApp.db.collection('events')
        .where('startTime', '>=', new Date())
        .orderBy('startTime')
        .limit(20)
        .get();
      
      const events = [];
      eventsSnapshot.forEach(doc => {
        events.push({ id: doc.id, ...doc.data() });
      });
      
      this.displayEvents(events);
      this.updateEventCount(events.length);
    } catch (error) {
      console.error('Error loading events:', error);
      this.displayEvents([]);
    }
  }

  displayEvents(events) {
    const container = document.getElementById('eventsList');
    if (!container) return;

    if (events.length === 0) {
      container.innerHTML = '<div class="text-center text-gray-500 py-8">No upcoming events</div>';
      return;
    }

    container.innerHTML = events.map(event => `
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex justify-between items-start mb-4">
          <h3 class="font-bold text-lg" style="color: var(--afit-primary);">${event.title}</h3>
          <span class="px-2 py-1 rounded text-xs text-white"
                style="background-color: ${this.getEventTypeColor(event.type)};">
            ${event.type || 'General'}
          </span>
        </div>
        <p class="text-gray-600 mb-4">${event.description}</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
          <div><strong>Date:</strong> ${this.formatDate(event.startTime)}</div>
          <div><strong>Time:</strong> ${this.formatTime(event.startTime)} - ${this.formatTime(event.endTime)}</div>
          <div><strong>Location:</strong> ${event.location || 'TBA'}</div>
        </div>
      </div>
    `).join('');
  }

  getEventTypeColor(type) {
    const colors = {
      'academic': '#1E40AF',
      'social': '#059669',
      'sports': '#DC2626',
      'administrative': '#7C3AED'
    };
    return colors[type] || '#6B7280';
  }

  formatDate(timestamp) {
    if (!timestamp) return 'TBA';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  }

  formatTime(timestamp) {
    if (!timestamp) return 'TBA';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  updateEventCount(count) {
    const counter = document.getElementById('eventCount');
    if (counter) {
      counter.textContent = count;
    }
  }

  // Safety Methods
  async loadSafetyData() {
    try {
      // Load active alerts
      const alertsSnapshot = await firebaseApp.db.collection('alerts')
        .where('active', '==', true)
        .orderBy('timestamp', 'desc')
        .get();
      
      const alerts = [];
      alertsSnapshot.forEach(doc => {
        alerts.push({ id: doc.id, ...doc.data() });
      });
      
      this.displaySafetyAlerts(alerts);
      
      // Setup real-time incident reports listener
      this.setupIncidentListener();
      
    } catch (error) {
      console.error('Error loading safety data:', error);
    }
  }

  displaySafetyAlerts(alerts) {
    const container = document.getElementById('activeAlerts');
    if (!container) return;

    if (alerts.length === 0) {
      container.innerHTML = '<div class="text-center text-gray-500 py-4">No active alerts</div>';
      return;
    }

    container.innerHTML = alerts.map(alert => `
      <div class="border-l-4 p-4 rounded-lg bg-yellow-50 border-yellow-500">
        <div class="flex items-start space-x-3">
          <span class="text-2xl">⚠️</span>
          <div class="flex-1">
            <h4 class="font-semibold text-yellow-800">${alert.title || 'Safety Alert'}</h4>
            <p class="text-yellow-700">${alert.message}</p>
            <p class="text-sm text-yellow-600 mt-1">${this.formatDate(alert.timestamp)}</p>
          </div>
        </div>
      </div>
    `).join('');
  }

  setupIncidentListener() {
    // Listen for new incidents in real-time
    firebaseApp.rtdb.ref('incidents').on('child_added', (snapshot) => {
      const incident = snapshot.val();
      if (incident) {
        this.showNotification('New Incident Reported', incident.title, 'warning');
      }
    });
  }

  async handleIncidentReport(e) {
    e.preventDefault();
    this.showLoading();

    const type = document.getElementById('incidentType').value;
    const location = document.getElementById('incidentLocation').value;
    const description = document.getElementById('incidentDescription').value;

    try {
      // Save to Firestore
      await firebaseApp.db.collection('incidents').add({
        type: type,
        location: location,
        description: description,
        reportedBy: this.currentUser.uid,
        reporterName: this.currentUser.name,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'open',
        coords: this.getLocationCoords(location)
      });

      // Also save to Realtime Database for real-time updates
      await firebaseApp.rtdb.ref('incidents').push({
        type: type,
        location: location,
        description: description,
        reportedBy: this.currentUser.uid,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      });

      document.getElementById('incidentForm').reset();
      this.showNotification('Success', 'Incident reported successfully', 'success');
      
    } catch (error) {
      console.error('Error reporting incident:', error);
      this.showNotification('Error', 'Failed to report incident', 'error');
    } finally {
      this.hideLoading();
    }
  }

  getLocationCoords(locationName) {
    const location = window.AFIT_DATA.GEOFENCE_CONFIG.locations.find(
      loc => loc.name === locationName
    );
    return location ? { lat: location.lat, lng: location.lng } : null;
  }

  // Dashboard Methods
  async loadDashboardData() {
    try {
      // Load building count
      document.getElementById('buildingCount').textContent = 
        window.AFIT_DATA.GEOFENCE_CONFIG.locations.length;

      // Load online users count
      firebaseApp.rtdb.ref('onlineUsers').on('value', (snapshot) => {
        const users = snapshot.val();
        const onlineCount = users ? Object.keys(users).filter(
          uid => users[uid].isOnline
        ).length : 0;
        
        const counter = document.getElementById('onlineCount');
        if (counter) {
          counter.textContent = onlineCount;
        }
      });

      // Load recent activity
      this.loadRecentActivity();
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  async loadRecentActivity() {
    try {
      const container = document.getElementById('recentActivity');
      if (!container) return;

      // Mock recent activity for now
      const activities = [
        { type: 'user_login', message: 'New user logged in', time: new Date() },
        { type: 'incident_report', message: 'Incident reported at Library', time: new Date(Date.now() - 3600000) },
        { type: 'event_created', message: 'New event added', time: new Date(Date.now() - 7200000) }
      ];

      container.innerHTML = activities.map(activity => `
        <div class="flex items-center space-x-3 p-3 border-b border-gray-100 last:border-b-0">
          <div class="w-2 h-2 rounded-full ${this.getActivityColor(activity.type)}"></div>
          <div class="flex-1">
            <p class="text-sm">${activity.message}</p>
            <p class="text-xs text-gray-500">${this.formatTimeAgo(activity.time)}</p>
          </div>
        </div>
      `).join('');
      
    } catch (error) {
      console.error('Error loading recent activity:', error);
    }
  }

  getActivityColor(type) {
    const colors = {
      'user_login': 'bg-green-500',
      'incident_report': 'bg-red-500',
      'event_created': 'bg-blue-500'
    };
    return colors[type] || 'bg-gray-500';
  }

  formatTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  }

  // Admin Methods
  async loadAdminData() {
    if (this.currentUser.role !== 'admin') return;

    try {
      // Load user count
      const usersSnapshot = await firebaseApp.db.collection('users').get();
      document.getElementById('totalUsers').textContent = usersSnapshot.size;

      // Load incident count
      const incidentsSnapshot = await firebaseApp.db.collection('incidents')
        .where('status', '==', 'open')
        .get();
      document.getElementById('totalIncidents').textContent = incidentsSnapshot.size;

      // Load admin activity
      this.loadAdminActivity();
      
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  }

  async loadAdminActivity() {
    const container = document.getElementById('adminActivity');
    if (!container) return;

    // Mock admin activity
    const activities = [
      'User registration approved',
      'Safety alert created',
      'Building information updated',
      'Event published'
    ];

    container.innerHTML = activities.map(activity => `
      <div class="p-3 border-b border-gray-100 last:border-b-0">
        <p class="text-sm">${activity}</p>
        <p class="text-xs text-gray-500">Admin action</p>
      </div>
    `).join('');
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

function showTab(tabName) {
  campusNav.showTab(tabName);
}

function toggleRadiusRings() {
  campusNav.toggleRadiusRings();
}

function toggleMapType() {
  campusNav.toggleMapType();
}

function centerOnCampus() {
  campusNav.centerOnCampus();
}

function closeBuildingModal() {
  campusNav.closeBuildingModal();
}

function logout() {
  campusNav.logout();
}

// Google Maps callback
function initMap() {
  // Map will be initialized when user logs in
  console.log('Google Maps API loaded');
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.campusNav = new CampusNavigator();
});

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
