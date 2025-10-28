/**
 * CACHING UTILITY (Generated with AI assistance)
 */

/**
 * Creates a cache object with the standard caching pattern
 * @param {*} initialData - The initial value for the cached data
 * @returns {Object} Cache object with data, isInitialized, and initPromise
 */
export function createCache(initialData = null) {
  return {
    data: initialData,
    isInitialized: false,
    initPromise: null
  };
}

/**
 * Resets a cache to its initial state
 * @param {Object} cache - The cache object to reset
 * @param {*} initialData - The initial value to reset to
 */
export function resetCache(cache, initialData = null) {
  cache.data = initialData;
  cache.isInitialized = false;
  cache.initPromise = null;
}

/**
 * Generic cache fetch wrapper that handles the caching logic
 * @param {Object} cache - The cache object
 * @param {Function} fetchFn - The async function that fetches the data
 * @param {Object} options - Additional options
 * @param {Function} options.onSuccess - Callback when fetch succeeds
 * @param {Function} options.onError - Callback when fetch fails
 * @returns {Promise} The cached or fetched data
 */
export async function cachedFetch(cache, fetchFn, options = {}) {
  // If already initialized, return cached data
  if (cache.isInitialized) {
    if (options.onSuccess) {
      options.onSuccess(cache.data);
    }
    return cache.data;
  }

  // If currently fetching, wait for it
  if (cache.initPromise) {
    try {
      const data = await cache.initPromise;
      if (options.onSuccess) {
        options.onSuccess(data);
      }
      return data;
    } catch (error) {
      if (options.onError) {
        options.onError(error);
      }
      throw error;
    }
  }

  // Start a new fetch
  const initPromise = (async () => {
    try {
      const data = await fetchFn();
      cache.data = data;
      cache.isInitialized = true;
      if (options.onSuccess) {
        options.onSuccess(data);
      }
      return data;
    } catch (error) {
      if (options.onError) {
        options.onError(error);
      }
      throw error;
    } finally {
      cache.initPromise = null;
    }
  })();

  cache.initPromise = initPromise;
  return initPromise;
}
