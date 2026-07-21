package com.gameaggregator.platform.core.common.web;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import org.slf4j.MDC;
import org.springframework.web.filter.OncePerRequestFilter;

public final class RequestContextFilter extends OncePerRequestFilter {
    private static final int MAX_ID_LENGTH = 128;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String requestId = normalized(request.getHeader(RequestContext.REQUEST_ID_HEADER), UUID.randomUUID().toString());
        String correlationId = normalized(request.getHeader(RequestContext.CORRELATION_ID_HEADER), requestId);
        try {
            MDC.put(RequestContext.REQUEST_ID_KEY, requestId);
            MDC.put(RequestContext.CORRELATION_ID_KEY, correlationId);
            response.setHeader(RequestContext.REQUEST_ID_HEADER, requestId);
            response.setHeader(RequestContext.CORRELATION_ID_HEADER, correlationId);
            chain.doFilter(request, response);
        } finally {
            MDC.remove(RequestContext.REQUEST_ID_KEY);
            MDC.remove(RequestContext.CORRELATION_ID_KEY);
        }
    }

    private String normalized(String candidate, String fallback) {
        if (candidate == null || candidate.isBlank() || candidate.length() > MAX_ID_LENGTH) return fallback;
        return candidate.replaceAll("[^A-Za-z0-9._:-]", "_");
    }
}
