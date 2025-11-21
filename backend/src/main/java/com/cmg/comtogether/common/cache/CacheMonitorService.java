package com.cmg.comtogether.common.cache;

import com.github.benmanes.caffeine.cache.stats.CacheStats;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CacheMonitorService {

    private final CacheManager cacheManager;

    public void printCacheStats(String cacheName) {
        CaffeineCache cache = (CaffeineCache) cacheManager.getCache(cacheName);
        if (cache != null) {
            CacheStats stats = cache.getNativeCache().stats();
            log.info("""
                [CACHE STATS: {}]
                hits: {}
                misses: {}
                hitRate: {}
                loadSuccess: {}
                loadFailure: {}
                evictions: {}
                avgLoadPenalty: {} ns
                """,
                    cacheName,
                    stats.hitCount(),
                    stats.missCount(),
                    String.format("%.2f%%", stats.hitRate() * 100),
                    stats.loadSuccessCount(),
                    stats.loadFailureCount(),
                    stats.evictionCount(),
                    stats.averageLoadPenalty()
            );
        } else {
            log.warn("Cache '{}' not found!", cacheName);
        }
    }
}
