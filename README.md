## Prerequisites

- Git
- Node.js 18
- (for Android development) Android Studio
- (for iOS development) Xcode

Install Ionic CLI:

```sh
  npm install -g @ionic/cli
```

### In project directory:

Install dependencies:

```sh
  npm install
```

Build the app and sync it:

```sh
  npm run build
  npx cap sync
```

## Deployment on real device

### Android

Make sure your device is connected via USB or wirelessly and it is in debbuging mode

Run command:

```sh
  ionic cap run android
```

And choose your device from list
