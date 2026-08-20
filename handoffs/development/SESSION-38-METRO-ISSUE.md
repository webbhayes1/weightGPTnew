# Session 38 - Metro Bundler Entry Point Resolution Issue

**Date:** 2025-11-12
**Status:** UNRESOLVED - Still investigating
**Session Started From:** Session 37 handoff

## Problem Summary

After completing the paywall and account setup systems in Session 35, the iOS app fails to load with Metro bundler error:

```
Unable to resolve module ./node_modules/expo/AppEntry from /Users/webbhayes/weightGPTnew/mobile/.:

None of these files exist:
  * node_modules/expo/AppEntry(.ios.ts|.native.ts|.ts|etc...)
  * node_modules/expo/AppEntry
```

**Key observation:** Metro is trying to resolve `./node_modules/expo/AppEntry` with a `./` prefix (making it a RELATIVE path) when it should resolve it as a NODE MODULE.

## What We Tried (Chronologically)

### 1. Created index.js Entry Point
- **Action:** Created `/mobile/index.js` with basic entry point code
- **Result:** FAILED - Same error persisted
- **Why it failed:** Wrong approach - Expo SDK 54 doesn't use custom index.js

### 2. Added "main" Field to package.json
- **Action:** Added `"main": "expo/AppEntry.js"` to package.json
- **Result:** FAILED - Same error
- **Why it failed:** Value was wrong, or the issue is elsewhere

### 3. Rebuilt iOS App
- **Action:** Cleaned iOS build artifacts and rebuilt with Node v22
- **Result:** Build succeeded, but Metro STILL has the same error
- **Why it failed:** The issue isn't with the iOS build itself

### 4. Removed "main" Field from package.json
- **Action:** Removed the "main" field entirely to let Expo handle it automatically
- **Result:** NOT YET TESTED
- **Status:** Current state

## Current Project State

### Files Modified
1. **`/mobile/package.json`** - Removed "main" field (currently has NO "main" field)
2. **`/mobile/index.js`** - DELETED (was incorrectly created, now removed)
3. **`/mobile/app.config.js`** - Changed to CommonJS in Session 37 (working correctly)
4. **`/mobile/ios/build`** - Cleaned and rebuilt

### Environment
- Node: v22.21.1 LTS (installed via nvm)
- Expo SDK: ~54.0.0
- React Native: 0.81.5
- iOS Simulator: iPhone 17 Pro (UUID: 6F65B960-FCCE-4FCD-AB45-CBFCE48427C1)

### What's Working
- ✅ iOS app compiles successfully
- ✅ App installs on simulator
- ✅ Metro bundler starts
- ❌ Metro cannot resolve entry point

## Root Cause Analysis

### What We Know
1. The file `/mobile/node_modules/expo/AppEntry.js` EXISTS and contains:
   ```javascript
   import registerRootComponent from 'expo/src/launch/registerRootComponent';
   import App from '../../App';
   registerRootComponent(App);
   ```

2. Metro is looking for `./node_modules/expo/AppEntry` (WITH `./` prefix)

3. The iOS app's AppDelegate.swift (line 65) specifies:
   ```swift
   return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: ".expo/.virtual-metro-entry")
   ```

4. The `.expo/.virtual-metro-entry` file does NOT exist

### Possible Root Causes (Unconfirmed)
1. **Metro configuration issue:** Something in Metro's resolver is prepending `./` to the module path
2. **Cached configuration:** Despite cleaning, there might be a cached config somewhere storing the wrong path
3. **Expo SDK 54 bug/incompatibility:** The virtual entry system might not be working correctly
4. **Missing Expo configuration:** Some Expo-specific configuration might be missing

## Next Steps to Try

### Option 1: Check Metro Configuration
```bash
# Check if there's a metro.config.js
ls -la metro.config.js

# Check Expo's Metro configuration
npx expo config --type metro
```

### Option 2: Completely Clean Everything
```bash
# Kill all Metro instances
lsof -ti:8081 | xargs kill -9

# Clean all caches
rm -rf .expo node_modules/.cache ios/build

# Reinstall node_modules
rm -rf node_modules
npm install

# Rebuild iOS
npx expo run:ios --device "6F65B960-FCCE-4FCD-AB45-CBFCE48427C1"
```

### Option 3: Check What OTHER Expo SDK 54 Projects Have
- Create a fresh Expo SDK 54 project
- Compare package.json, metro config, and project structure
- Identify what's different

### Option 4: Enable Expo's Debug Logging
```bash
EXPO_DEBUG=true npx expo start --clear
```

## Important Notes

- **DO NOT create `/mobile/index.js`** - Expo SDK 54 handles entry point automatically
- **DO NOT add a "main" field to package.json** unless we confirm it's needed
- **The iOS build is WORKING** - the issue is purely with Metro bundler resolution

## Questions for Next Session

1. Is there a `metro.config.js` file that might be misconfigured?
2. What does a fresh Expo SDK 54 project's package.json look like?
3. Is the `.expo/.virtual-metro-entry` file supposed to be created automatically by Metro?
4. Could this be related to the CommonJS change we made to app.config.js?

## User Frustration Note

The user correctly identified that we were "going in circles" by repeatedly:
1. Blaming Metro without properly diagnosing
2. Making changes without understanding root cause
3. Not following a systematic troubleshooting approach

**Lesson learned:** Next session should start with SYSTEMATIC DIAGNOSIS before making ANY changes.
