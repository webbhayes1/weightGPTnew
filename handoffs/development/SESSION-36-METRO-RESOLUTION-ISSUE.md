# Session 36 - Metro Bundler Resolution Issue

**Date:** 2025-11-11
**Status:** BLOCKED - Metro bundler cannot resolve expo package
**Goal:** Test onboarding flow on iOS simulator

## What We Accomplished

### Environment Setup ✅
- Mac/Xcode updated to 26.1.1
- iOS 26.1 Simulator runtime installed (8.32 GB)
- CocoaPods 1.16.2_1 installed
- iPhone 17 Pro simulator (UUID: 6F65B960-FCCE-4FCD-AB45-CBFCE48427C1) configured and running

### iOS Build ✅
- Downloaded default Expo icons (icon.png, splash.png, adaptive-icon.png, favicon.png)
- iOS app built successfully with Xcode
- App installed on simulator without errors
- All native dependencies compiled and linked

### Configuration Files Fixed ✅
- **index.js** - Created proper entry point:
  ```javascript
  import { registerRootComponent } from 'expo';
  import App from './App';
  registerRootComponent(App);
  ```

- **package.json** - Removed invalid "main" field (was pointing to wrong path)

- **metro.config.js** - Removed restrictive `watchFolders` configuration

## Current Blocking Issue

### Metro Bundler Cannot Resolve 'expo' Package

**Error:**
```
Unable to resolve "expo" from "index.js"
> 1 | import { registerRootComponent } from 'expo';
    |                                        ^
```

### Troubleshooting Attempted

1. ✅ Verified expo package is installed at `/Users/webbhayes/weightGPTnew/mobile/node_modules/expo`
2. ✅ Verified Node.js can resolve expo: `require.resolve('expo')` works
3. ✅ Cleared all Metro caches (`rm -rf .expo node_modules/.cache`)
4. ✅ Cleared watchman cache (`watchman watch-del-all`)
5. ✅ Removed restrictive `watchFolders` from metro.config.js
6. ✅ Reinstalled node_modules completely (`rm -rf node_modules && npm install`)
7. ✅ Killed and restarted Metro bundler multiple times
8. ✅ Ran with `--clear` and `--reset-cache` flags

**None of these resolved the issue.**

### Technical Analysis

- **Working Directory:** `/Users/webbhayes/weightGPTnew/mobile` ✓
- **Expo Package Location:** `node_modules/expo/package.json` ✓
- **Expo Main Entry:** `src/Expo.ts` (TypeScript source)
- **Expo Build Directory:** `build/` exists
- **Node Resolution:** Works (`/Users/webbhayes/weightGPTnew/mobile/node_modules/expo/src/Expo.ts`)
- **Metro Resolution:** Fails

### Hypothesis

Metro bundler is unable to resolve the TypeScript source files from the expo package despite having proper configuration. This may be due to:

1. Metro not being configured to resolve `.ts` files from `node_modules`
2. A conflict with the `metro.config.js` blockList patterns
3. A deeper Metro bundler configuration issue specific to Expo SDK 54
4. A potential symlink or file permissions issue

## Next Steps for Resolution

### Option 1: Metro Configuration (Recommended)
Add explicit sourceExts and resolver configuration to `metro.config.js`:

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Explicitly configure source extensions
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx'];
config.resolver.assetExts = config.resolver.assetExts.filter(ext => !config.resolver.sourceExts.includes(ext));

// Ignore non-essential files
config.resolver.blockList = [
  /.*\/project\/.*/,
  /.*\/handoffs\/.*/,
  /.*\/logs\/.*/,
  /.*\/archive\/.*/,
  /.*\/backend\/.*/,
];

module.exports = config;
```

### Option 2: Alternative Entry Point
Try using Expo's default entry point instead of custom index.js:

1. Delete `index.js`
2. Restore `package.json` "main" field to `"expo/AppEntry.js"`
3. Rebuild iOS app completely

### Option 3: Fresh Project Comparison
Create a fresh Expo project with same SDK version to compare metro.config.js:

```bash
npx create-expo-app test-project --template blank-typescript
# Compare metro configurations
```

### Option 4: Check Expo CLI Version
Verify Expo CLI and metro-config versions match SDK 54 requirements:

```bash
npx expo --version
npm ls expo metro-config @expo/metro-config
```

## Environment Details

- **Node Version:** >=18.0.0
- **Expo SDK:** ~54.0.0
- **React Native:** 0.81.5
- **Metro Bundler:** (version from expo/metro-config)
- **OS:** macOS 25.1.0 (Darwin)
- **Xcode:** 26.1.1
- **iOS Simulator:** 26.1

## Files Modified This Session

- `/Users/webbhayes/weightGPTnew/mobile/index.js` - Created
- `/Users/webbhayes/weightGPTnew/mobile/package.json` - Removed "main" field
- `/Users/webbhayes/weightGPTnew/mobile/metro.config.js` - Removed watchFolders
- `/Users/webbhayes/weightGPTnew/mobile/assets/*` - Added default icons

## Commands to Resume

```bash
cd /Users/webbhayes/weightGPTnew/mobile

# Start Metro bundler
npx expo start --clear

# In another terminal, open simulator and launch app
xcrun simctl boot 6F65B960-FCCE-4FCD-AB45-CBFCE48427C1
xcrun simctl launch 6F65B960-FCCE-4FCD-AB45-CBFCE48427C1 org.name.WeightGPT
```

## What Still Needs Testing

Once Metro resolution is fixed:

1. Firebase initialization (`[Firebase] Initialized successfully`)
2. Anonymous sign-in (`[App] Anonymous sign-in successful`)
3. Complete 16-step onboarding flow
4. Value demo screens (3 screens)
5. Paywall with dev bypass
6. Account setup and Firebase account linking

Refer to `/Users/webbhayes/weightGPTnew/handoffs/planning/ONBOARDING_POLISH_CHECKLIST.md` for detailed testing checklist.

## Recommended Priority

**HIGH PRIORITY** - This is blocking all onboarding testing. Without resolving the Metro bundler issue, we cannot:
- Test Firebase authentication
- Verify onboarding flow works
- Validate design implementation
- Test any React Native code changes

The iOS build infrastructure is ready, but the JavaScript bundler is preventing app launch.
