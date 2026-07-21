package com.gameaggregator.platform.core.common.web;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.slf4j.MDC;

class ApiResponseTest {
    @AfterEach
    void clearContext() { MDC.clear(); }

    @Test
    void includesRequestMetadata() {
        MDC.put(RequestContext.REQUEST_ID_KEY, "req-123");
        MDC.put(RequestContext.CORRELATION_ID_KEY, "corr-123");
        ApiResponse<String> response = ApiResponse.success("ok");
        assertThat(response.success()).isTrue();
        assertThat(response.data()).isEqualTo("ok");
        assertThat(response.meta().requestId()).isEqualTo("req-123");
        assertThat(response.meta().correlationId()).isEqualTo("corr-123");
    }
}
