# Session 39: Metro Module Resolution Crisis

**Date**: 2025-11-12
**Status**: CRITICAL - App Cannot Bundle
**Impact**: Complete iOS app failure - cannot load

---

## Problem Summary

Metro bundler cannot resolve ANY modules from node_modules, including Expo's own core files. The error persists even with:
- Fresh node_modules installation
- Minimal Expo default configuration
- All caches cleared (Metro, Watchman, Expo)
- Files physically exist and are readable

**Error Message**:
```
Unable to resolve module expo from /Users/webbhayes/weightGPTnew/mobile/index.js:
expo could not be found within the project or in these directories:
  node_modules
  ../../node_modules

Module does not exist in the Haste module map
```

---

## Timeline

### Working State (Before Session 34/35)
- ✅ Full onboarding flow functional
- ✅ Firebase anonymous auth working
- ✅ App loading and running on iOS simulator
- ✅ Metro bundling successfully

### Breaking Change (Session 34/35)
- User implemented Firebase authentication
- User updated their computer (macOS/Xcode update?)
- **App stopped loading after these changes**

### Current State (Session 39)
- ❌ Metro cannot resolve node_modules
- ❌ Cannot bundle app
- ❌ iOS app fails to load
- ✓ Files exist at correct paths
- ✓ Metro config appears correct

---

## Investigation Steps Taken

### 1. Configuration Verification
**metro.config.js**:
- ✓ Tested with custom watchFolders configuration
- ✓ Tested with minimal Expo defaults
- ✓ Confirmed getDefaultConfig(__dirname) is correct

**package.json**:
- ✓ `"main": "expo/AppEntry.js"` is correct
- ✓ All dependencies installed (1328 packages)
- ✓ expo@54.0.23 installed correctly

**AppDelegate.swift**:
- Modified bundle root from `.expo/.virtual-metro-entry` to `"expo/AppEntry"`
- This was necessary because .expo/.virtual-metro-entry file doesn't exist

### 2. File System Verification
```bash
# Verified files exist
ls -la node_modules/expo/AppEntry.js
# -rw-r--r--@ 1 webbhayes staff 134 Nov 11 20:35 node_modules/expo/AppEntry.js

# Note the @ extended attribute flag - possible issue?
```

**Expo package structure**:
- ✓ `node_modules/expo/AppEntry.js` exists
- ✓ `node_modules/expo/src/launch/registerRootComponent.tsx` exists
- ✓ `node_modules/expo/src/Expo.ts` exports registerRootComponent
- ✓ Package main field: `"main": "src/Expo.ts"`

### 3. Cache Clearing Attempts
```bash
# Tried multiple times
rm -rf node_modules .expo node_modules/.cache
npm install
watchman watch-del /Users/webbhayes/weightGPTnew
watchman watch-project /Users/webbhayes/weightGPTnew
npx expo start --clear
```

### 4. Nuclear Reinstall
- Completely removed node_modules
- Fresh `npm install` (completed successfully)
- Reinstalled 1328 packages
- **Issue persists**

---

## Technical Details

### Metro's Module Resolution Process
Metro uses a "Haste module map" - an internal index of all modules. The error "Module does not exist in the Haste module map" indicates Metro's indexing is broken.

**Metro searches in order**:
1. Haste module map (internal Metro index)
2. node_modules directory
3. Parent directories (../../node_modules, etc.)

**Current behavior**: Metro is checking the directories but NOT finding files that physically exist.

### File Access Issue?
Files in node_modules have `@` extended attributes:
```
drwxr-xr-x@ 740 webbhayes  staff   23680 Nov 11 20:15 node_modules
-rw-r--r--@   1 webbhayes  staff     134 Nov 11 20:15 AppEntry.js
```

The `@` indicates extended attributes (likely from Finder/Spotlight). Could macOS update have changed how Metro accesses these?

---

## Hypotheses

### 1. macOS/Xcode Update Side Effects
**Likelihood**: HIGH
- User mentioned updating computer
- File system access patterns may have changed
- Extended attributes handling might be different
- Xcode 16.x has known Metro issues

**Evidence**:
- Timing matches (worked before update, broke after)
- Files physically exist but Metro can't see them
- No code changes broke it - environmental change

### 2. Node.js/npm Version Mismatch
**Likelihood**: MEDIUM
- Using Node 22.21.1
- Expo SDK 54 officially supports Node 18+
- Metro might have issues with Node 22

**Evidence**:
- Node 22 is very recent
- Some Metro/Expo incompatibilities reported
- Worth testing with Node 18 LTS

### 3. Watchman File Watching Issues
**Likelihood**: MEDIUM
- Watchman showed recrawl warnings
- Might not be properly tracking node_modules

**Evidence**:
```
Recrawled this watch 3 times, most recently because:
MustScanSubDirs UserDroppedTo resolve, please review the information on
https://facebook.github.io/watchman/docs/troubleshooting.html#recrawl
```

### 4. Metro Haste Module Map Corruption
**Likelihood**: LOW (but unfixable if true)
- Metro's internal indexing might be fundamentally broken
- Could be Metro version incompatibility

**Evidence**:
- Even fresh installs fail
- Multiple cache clears don't help
- Affects ALL node_modules resolution

---

## Changes Made During Investigation

### Files Modified
1. **metro.config.js**: Simplified to minimal Expo default
   ```javascript
   const { getDefaultConfig } = require('expo/metro-config');
   module.exports = getDefaultConfig(__dirname);
   ```

2. **ios/WeightGPT/AppDelegate.swift**: Changed bundle root
   ```swift
   // OLD: forBundleRoot: ".expo/.virtual-metro-entry"
   // NEW: forBundleRoot: "expo/AppEntry"
   ```

3. **Attempted index.js creation** (later removed):
   - Tried creating custom entry point
   - Failed because Metro couldn't resolve `from 'expo'`

### Git Status
```
AM app.config.js
R  app.json -> app.json.backup
 M package.json
M  src/config/firebase.config.ts
M  src/services/apiClient.ts
M  src/services/auth/dataMigration.ts
?? ios/
?? assets/
```

---

## Next Steps for Investigation

### 1. Check What Changed in Session 34/35
```bash
git log --oneline --since="2025-11-11" --until="2025-11-12"
git diff HEAD~5 -- mobile/
```

### 2. Test Node Version Hypothesis
```bash
nvm install 18
nvm use 18
rm -rf node_modules
npm install
npx expo start --clear
```

### 3. Check macOS/Xcode Update Impact
- What version of macOS? (Check: `sw_vers`)
- What version of Xcode? (Check: `xcodebuild -version`)
- When was the update? (Check system logs)

### 4. Test Extended Attributes Theory
```bash
# Remove extended attributes from node_modules
xattr -cr node_modules/
# Then test Metro
```

### 5. Create Minimal Reproduction
```bash
# New directory with minimal Expo app
npx create-expo-app test-metro
cd test-metro
npx expo start
# Does this work? If yes, compare configurations
```

---

## Critical Questions

1. **When exactly did the computer update happen?** Before or during session 34/35?
2. **What was updated?** macOS version? Xcode? Command line tools?
3. **Can we access an older git commit** and see if it works?
4. **Is this machine-specific?** Would it work on another Mac?

---

## Workaround Attempts (All Failed)

1. ❌ Custom index.js entry point
2. ❌ Fresh node_modules install
3. ❌ Cleared all caches
4. ❌ Minimal Metro config
5. ❌ Changed AppDelegate bundle root
6. ❌ Watchman reset
7. ❌ expo prebuild --clean

---

## Current Blocker

**Cannot proceed with any development** until Metro can resolve node_modules. This is a foundational issue preventing:
- App loading
- Testing
- Development
- Builds

**Severity**: CRITICAL
**Priority**: P0 - Blocks all work

---

## Recommended Resolution Path

1. Identify EXACT system changes (macOS/Xcode versions)
2. Test with Node 18 LTS instead of Node 22
3. Try minimal Expo app on same machine
4. If still broken, likely environmental issue requiring either:
   - Rollback system changes
   - Development on different machine
   - Docker/VM environment for isolation
