package com.gameaggregator.platform.core.common.autoconfigure;

import com.gameaggregator.platform.core.common.exception.GlobalExceptionHandler;
import com.gameaggregator.platform.core.common.logging.RequestLoggingFilter;
import com.gameaggregator.platform.core.common.openapi.PlatformOpenApiConfiguration;
import com.gameaggregator.platform.core.common.web.RequestContextFilter;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.core.Ordered;

@AutoConfiguration
@EnableConfigurationProperties(PlatformCoreProperties.class)
public class PlatformCoreAutoConfiguration {
    @Bean
    FilterRegistrationBean<RequestContextFilter> platformRequestContextFilter() {
        FilterRegistrationBean<RequestContextFilter> registration = new FilterRegistrationBean<>(new RequestContextFilter());
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return registration;
    }

    @Bean
    FilterRegistrationBean<RequestLoggingFilter> platformRequestLoggingFilter() {
        FilterRegistrationBean<RequestLoggingFilter> registration = new FilterRegistrationBean<>(new RequestLoggingFilter());
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE + 1);
        return registration;
    }

    @Bean
    GlobalExceptionHandler globalExceptionHandler() { return new GlobalExceptionHandler(); }

    @Bean
    OpenAPI platformOpenApi(PlatformCoreProperties properties) {
        return PlatformOpenApiConfiguration.create(properties.serviceName(), properties.apiVersion());
    }
}
