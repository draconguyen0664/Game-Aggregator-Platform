package com.gameaggregator.platform.core.common.web;

import java.time.Instant;

public record ResponseMeta(String requestId, String correlationId, Instant timestamp) {
    public static ResponseMeta current() {
        return new ResponseMeta(RequestContext.requestId(), RequestContext.correlationId(), Instant.now());
    }
}
