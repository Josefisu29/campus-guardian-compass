
# Firebase Configuration and Security Rules

## Firebase Realtime Database Rules

```json
{
  "rules": {
    ".read": false,
    ".write": false,
    
    "alerts": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$alertId": {
        ".validate": "newData.hasChildren(['message', 'coords', 'timestamp', 'type'])",
        "message": {
          ".validate": "newData.isString() && newData.val().length > 0"
        },
        "coords": {
          ".validate": "newData.hasChildren(['0', '1'])",
          "0": { ".validate": "newData.isNumber()" },
          "1": { ".validate": "newData.isNumber()" }
        },
        "timestamp": {
          ".validate": "newData.isString()"
        },
        "type": {
          ".validate": "newData.isString()"
        },
        "createdAt": {
          ".validate": "newData.val() == now"
        }
      }
    },
    
    "incidents": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$incidentId": {
        ".validate": "newData.hasChildren(['title', 'description', 'location', 'coords', 'timestamp', 'reportedBy'])",
        "title": {
          ".validate": "newData.isString() && newData.val().length > 0"
        },
        "description": {
          ".validate": "newData.isString() && newData.val().length > 0"
        },
        "location": {
          ".validate": "newData.isString() && newData.val().length > 0"
        },
        "coords": {
          ".validate": "newData.hasChildren(['0', '1'])",
          "0": { ".validate": "newData.isNumber()" },
          "1": { ".validate": "newData.isNumber()" }
        },
        "timestamp": {
          ".validate": "newData.isString()"
        },
        "reportedBy": {
          ".validate": "newData.isString() && newData.val() == auth.uid"
        },
        "createdAt": {
          ".validate": "newData.val() == now"
        }
      }
    },
    
    "users": {
      ".read": "auth != null",
      "$userId": {
        ".read": "auth != null && ($userId == auth.uid || root.child('users').child(auth.uid).child('role').val() == 'admin')",
        ".write": "auth != null && $userId == auth.uid",
        "points": {
          ".validate": "newData.isNumber() && newData.val() >= 0"
        },
        "lastUpdated": {
          ".validate": "newData.val() == now"
        },
        "isOnline": {
          ".validate": "newData.isBoolean()"
        },
        "lastSeen": {
          ".validate": "newData.val() == now"
        }
      }
    },
    
    "events": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() == 'admin'",
      "$eventId": {
        ".validate": "newData.hasChildren(['title', 'description', 'buildingId', 'startTime', 'endTime'])",
        "title": {
          ".validate": "newData.isString() && newData.val().length > 0"
        },
        "description": {
          ".validate": "newData.isString() && newData.val().length > 0"
        },
        "buildingId": {
          ".validate": "newData.isString() && newData.val().length > 0"
        },
        "startTime": {
          ".validate": "newData.isString()"
        },
        "endTime": {
          ".validate": "newData.isString()"
        },
        "notificationLeadTime": {
          ".validate": "newData.isNumber() && newData.val() >= 0"
        }
      }
    },
    
    "campus_data": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() == 'admin'",
      "buildings": {
        "$buildingId": {
          ".validate": "newData.hasChildren(['name', 'coordinates', 'type'])",
          "name": { ".validate": "newData.isString()" },
          "coordinates": {
            ".validate": "newData.hasChildren(['0', '1'])",
            "0": { ".validate": "newData.isNumber()" },
            "1": { ".validate": "newData.isNumber()" }
          },
          "type": {
            ".validate": "newData.isString() && (newData.val() == 'academic' || newData.val() == 'residential' || newData.val() == 'administrative' || newData.val() == 'recreational' || newData.val() == 'service')"
          }
        }
      }
    }
  }
}
```

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Admin-only collections
    match /admin/{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Campus events - admin write, authenticated read
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Building information - admin write, authenticated read
    match /buildings/{buildingId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Public campus data - read only for authenticated users
    match /campus_info/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Setup Instructions

1. **Deploy Realtime Database Rules:**
   - Go to Firebase Console → Realtime Database → Rules
   - Copy and paste the Realtime Database rules above
   - Click "Publish"

2. **Deploy Firestore Rules:**
   - Go to Firebase Console → Firestore Database → Rules
   - Copy and paste the Firestore rules above
   - Click "Publish"

3. **Environment Variables:**
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyBKyJyDQUZ57D1aIj4NV2kv82mjO1k
   VITE_FIREBASE_AUTH_DOMAIN=campnav-66eaa.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://campnav-66eaa-default-rtdb.firebaseio.com/
   VITE_FIREBASE_PROJECT_ID=campnav-66eaa
   VITE_FIREBASE_STORAGE_BUCKET=campnav-66eaa.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=762836324985
   VITE_FIREBASE_APP_ID=1:762836324985:web:aadf3bfe6413cd100dbaa8
   ```

## Database Structure

### Realtime Database Structure:
```
/
├── alerts/
│   └── {alertId}
│       ├── message: string
│       ├── coords: [lat, lng]
│       ├── timestamp: string
│       ├── type: string
│       └── createdAt: timestamp
├── incidents/
│   └── {incidentId}
│       ├── title: string
│       ├── description: string
│       ├── location: string
│       ├── coords: [lat, lng]
│       ├── timestamp: string
│       ├── reportedBy: userId
│       └── createdAt: timestamp
├── users/
│   └── {userId}
│       ├── points: number
│       ├── lastUpdated: timestamp
│       ├── isOnline: boolean
│       └── lastSeen: timestamp
└── events/
    └── {eventId}
        ├── title: string
        ├── description: string
        ├── buildingId: string
        ├── startTime: string
        ├── endTime: string
        └── notificationLeadTime: number
```

### Firestore Structure:
```
users/{userId}
├── email: string
├── displayName: string
├── role: 'student' | 'admin'
├── points: number
├── createdAt: timestamp
└── lastLogin: timestamp

buildings/{buildingId}
├── name: string
├── description: string
├── coordinates: [lat, lng]
├── type: string
├── capacity: number
├── facilities: array
└── images: array
```
