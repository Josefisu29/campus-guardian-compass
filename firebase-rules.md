
# Firebase Security Rules for AFIT Campus Navigator

## Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isStaff() {
      return isAuthenticated() && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'staff';
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow create: if isAuthenticated() && 
                       request.auth.uid == userId &&
                       request.resource.data.keys().hasAll(['name', 'email', 'role']) &&
                       request.resource.data.role in ['student', 'staff', 'admin'];
      
      allow read: if isOwner(userId) || isAdmin() || isStaff();
      
      allow update: if isOwner(userId) && 
                       request.resource.data.keys().hasAll(['name', 'email', 'role']) &&
                       request.resource.data.role == resource.data.role;
      
      allow delete: if isAdmin();
    }
    
    // Buildings collection
    match /buildings/{buildingId} {
      allow read: if true; // Public read access
      allow write: if isAdmin();
    }
    
    // Events collection
    match /events/{eventId} {
      allow read: if true; // Public read access
      allow create: if isAdmin() || isStaff();
      allow update: if isAdmin() || 
                       (isStaff() && resource.data.createdBy == request.auth.uid);
      allow delete: if isAdmin();
    }
    
    // Alerts collection
    match /alerts/{alertId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin() || isStaff();
    }
    
    // Incidents collection
    match /incidents/{incidentId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() &&
                       request.resource.data.reportedBy == request.auth.uid;
      allow update: if isAdmin() || isStaff();
      allow delete: if isAdmin();
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      allow read: if isAuthenticated() && 
                     resource.data.userId == request.auth.uid;
      allow create: if isAdmin() || isStaff();
      allow update: if isAuthenticated() && 
                       resource.data.userId == request.auth.uid;
      allow delete: if isAdmin() || 
                       (isAuthenticated() && resource.data.userId == request.auth.uid);
    }
    
    // Analytics collection (admin only)
    match /analytics/{document=**} {
      allow read, write: if isAdmin();
    }
    
    // System settings (admin only)
    match /settings/{document=**} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
  }
}
```

## Realtime Database Rules

```json
{
  "rules": {
    ".read": false,
    ".write": false,
    
    "onlineUsers": {
      ".read": "auth != null",
      "$uid": {
        ".write": "auth != null && auth.uid == $uid",
        ".validate": "newData.hasChildren(['isOnline', 'lastSeen']) && 
                     newData.child('isOnline').isBoolean() &&
                     (newData.child('lastSeen').isNumber() || newData.child('lastSeen').val() == '.sv')"
      }
    },
    
    "incidents": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$incidentId": {
        ".validate": "newData.hasChildren(['type', 'location', 'description', 'reportedBy', 'timestamp']) &&
                     newData.child('reportedBy').val() == auth.uid &&
                     newData.child('type').isString() &&
                     newData.child('location').isString() &&
                     newData.child('description').isString()"
      }
    },
    
    "shuttlePositions": {
      ".read": "auth != null",
      ".write": "auth != null && 
                (root.child('users').child(auth.uid).child('role').val() == 'admin' ||
                 root.child('users').child(auth.uid).child('role').val() == 'staff')",
      "$shuttleId": {
        ".validate": "newData.hasChildren(['lat', 'lng', 'timestamp']) &&
                     newData.child('lat').isNumber() &&
                     newData.child('lng').isNumber() &&
                     (newData.child('timestamp').isNumber() || newData.child('timestamp').val() == '.sv')"
      }
    },
    
    "geofenceEvents": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$eventId": {
        ".validate": "newData.hasChildren(['userId', 'locationId', 'eventType', 'timestamp']) &&
                     newData.child('userId').val() == auth.uid &&
                     newData.child('eventType').val().matches(/^(enter|exit)$/) &&
                     (newData.child('timestamp').isNumber() || newData.child('timestamp').val() == '.sv')"
      }
    },
    
    "emergencyAlerts": {
      ".read": "auth != null",
      ".write": "auth != null && 
                (root.child('users').child(auth.uid).child('role').val() == 'admin' ||
                 root.child('users').child(auth.uid).child('role').val() == 'staff')",
      "$alertId": {
        ".validate": "newData.hasChildren(['title', 'message', 'severity', 'timestamp', 'createdBy']) &&
                     newData.child('createdBy').val() == auth.uid &&
                     newData.child('severity').val().matches(/^(low|medium|high|critical)$/) &&
                     (newData.child('timestamp').isNumber() || newData.child('timestamp').val() == '.sv')"
      }
    },
    
    "buildingOccupancy": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$buildingId": {
        ".validate": "newData.hasChildren(['current', 'capacity', 'lastUpdated']) &&
                     newData.child('current').isNumber() &&
                     newData.child('capacity').isNumber() &&
                     (newData.child('lastUpdated').isNumber() || newData.child('lastUpdated').val() == '.sv')"
      }
    }
  }
}
```

## Firebase Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User profile images
    match /users/{userId}/profile/{fileName} {
      allow read: if true; // Public read for profile images
      allow write: if request.auth != null && 
                      request.auth.uid == userId &&
                      request.resource.size < 5 * 1024 * 1024 && // 5MB limit
                      request.resource.contentType.matches('image/.*');
    }
    
    // Building images (admin/staff only)
    match /buildings/{buildingId}/{fileName} {
      allow read: if true; // Public read
      allow write: if request.auth != null && 
                      (isAdmin() || isStaff()) &&
                      request.resource.size < 10 * 1024 * 1024 && // 10MB limit
                      request.resource.contentType.matches('image/.*');
    }
    
    // Event images
    match /events/{eventId}/{fileName} {
      allow read: if true; // Public read
      allow write: if request.auth != null && 
                      (isAdmin() || isStaff()) &&
                      request.resource.size < 10 * 1024 * 1024 && // 10MB limit
                      request.resource.contentType.matches('image/.*');
    }
    
    // Building floor plans and documents
    match /documents/{category}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      (isAdmin() || isStaff()) &&
                      request.resource.size < 50 * 1024 * 1024; // 50MB limit for documents
    }
    
    // Helper functions
    function isAdmin() {
      return request.auth != null && 
             exists(/databases/(default)/documents/users/$(request.auth.uid)) &&
             get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isStaff() {
      return request.auth != null && 
             exists(/databases/(default)/documents/users/$(request.auth.uid)) &&
             get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'staff';
    }
  }
}
```

## How to Apply These Rules

### For Firestore:
1. Go to Firebase Console → Firestore Database → Rules
2. Copy and paste the Firestore rules above
3. Click "Publish"

### For Realtime Database:
1. Go to Firebase Console → Realtime Database → Rules
2. Copy and paste the Realtime Database rules above
3. Click "Publish"

### For Storage:
1. Go to Firebase Console → Storage → Rules
2. Copy and paste the Storage rules above
3. Click "Publish"

## Rule Explanations

### User Roles:
- **Admin**: Full access to all collections and administrative functions
- **Staff**: Can create/manage events, alerts, and moderate content
- **Student**: Basic read access and ability to report incidents

### Security Features:
- Role-based access control (RBAC)
- Data validation for required fields
- File size and type restrictions for uploads
- User ownership validation for personal data
- Public read access for general campus information
- Private access for sensitive data (incidents, notifications)

### Real-time Features:
- Online user tracking with presence detection
- Real-time incident reporting
- Emergency alert broadcasting
- Geofence event logging
- Building occupancy monitoring

These rules ensure data security while enabling the collaborative features needed for a campus navigation system.
