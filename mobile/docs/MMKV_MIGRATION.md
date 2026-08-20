# MMKV Migration Guide

## Current Status: AsyncStorage (Temporary)

**Date:** 2025-11-11
**Reason:** Expo Go compatibility
**Performance Impact:** Minimal for Phase 1 testing

## Why AsyncStorage Instead of MMKV?

### The Problem
We originally chose `react-native-mmkv` for offline caching because:
- ✅ **30x faster** than AsyncStorage
- ✅ Synchronous API (better for TanStack Query)
- ✅ Encryption support
- ✅ Cross-platform (iOS + Android)

However, MMKV uses **NitroModules** which require native compilation. **Expo Go doesn't support native modules**, so the app crashes with:
```
Error: NitroModules are not supported in Expo Go!
Use EAS (`expo prebuild`) or eject to a bare workflow instead.
```

### The Solution
We temporarily switched to `@react-native-async-storage/async-storage`:
- ✅ Works with Expo Go (no native build required)
- ✅ Still provides offline caching
- ✅ Production-ready and well-tested
- ⚠️ Slightly slower than MMKV (but still fast enough for our use case)

## When to Switch to MMKV

**Switch to MMKV when:**
1. We move to **development build** (after Phase 1 testing)
2. Performance testing shows AsyncStorage is too slow
3. We need better battery efficiency (MMKV uses less CPU)

**Estimated time:** 10-15 minutes

## How to Switch to MMKV

### Step 1: Install Dependencies
```bash
cd mobile
npx expo install react-native-mmkv
```

### Step 2: Update queryClient.ts
Replace the AsyncStorage adapter with MMKV:

```typescript
// OLD (AsyncStorage)
import AsyncStorage from '@react-native-async-storage/async-storage';

const asyncStorageAdapter = {
  getItem: (key: string) => AsyncStorage.getItem(key),
  setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
  removeItem: (key: string) => AsyncStorage.removeItem(key),
};

// NEW (MMKV)
import { MMKV } from 'react-native-mmkv';

const mmkvStorage = new MMKV({
  id: 'query-cache',
  encryptionKey: process.env.EXPO_PUBLIC_CACHE_ENCRYPTION_KEY,
});

const mmkvAdapter = {
  getItem: (key: string) => mmkvStorage.getString(key) ?? null,
  setItem: (key: string, value: string) => mmkvStorage.set(key, value),
  removeItem: (key: string) => mmkvStorage.delete(key),
};
```

### Step 3: Update Persister
```typescript
export const persister = createSyncStoragePersister({
  storage: mmkvAdapter, // Changed from asyncStorageAdapter
  key: 'REACT_QUERY_OFFLINE_CACHE',
  serialize: (data: unknown) => JSON.stringify(data),
  deserialize: (data: string) => JSON.parse(data),
});
```

### Step 4: Build & Test
```bash
# Build development build
npx expo prebuild

# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android
```

### Step 5: Remove AsyncStorage (Optional)
```bash
npm uninstall @react-native-async-storage/async-storage
```

## Performance Comparison

| Operation | AsyncStorage | MMKV | Improvement |
|-----------|-------------|------|-------------|
| Read 1KB | ~2-3ms | ~0.1ms | **30x faster** |
| Write 1KB | ~5-10ms | ~0.2ms | **40x faster** |
| Read 100KB | ~20-30ms | ~1ms | **25x faster** |
| Battery Impact | Medium | Low | Better efficiency |

**For Phase 1 testing:** AsyncStorage is fine (queries are small, cache hits are infrequent)
**For production:** MMKV is recommended for best UX

## Related Files
- [mobile/src/services/queryClient.ts](../src/services/queryClient.ts) - Cache configuration
- [mobile/package.json](../package.json) - Dependencies
- [Q3.7_Offline_Sync_FINAL.md](../../project/planning/Q3.7_Offline_Sync_FINAL.md) - Cache strategy spec

## Decision Log
- **2025-11-11:** Switched to AsyncStorage for Expo Go compatibility (Session 27)
- **Future:** Will switch to MMKV when moving to development build (Phase 2+)
