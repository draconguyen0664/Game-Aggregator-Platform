package com.gameaggregator.platform.core.common.web;

import org.slf4j.MDC;

public final class RequestContext {
    public static final String REQUEST_ID_HEADER = "X-Request-ID";
    public static final String CORRELATION_ID_HEADER = "X-Correlation-ID";
    public static final String REQUEST_ID_KEY = "requestId";
    public static final String CORRELATION_ID_KEY = "correlationId";

    private RequestContext() {}
    public static String requestId() { return MDC.get(REQUEST_ID_KEY); }
    public static String correlationId() { return MDC.get(CORRELATION_ID_KEY); }
}
