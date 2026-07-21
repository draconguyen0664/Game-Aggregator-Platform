package com.gameaggregator.platform.core.common.autoconfigure;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("platform.core")
public record PlatformCoreProperties(String serviceName, String apiVersion) {
    public PlatformCoreProperties {
        if (serviceName == null || serviceName.isBlank()) serviceName = "Game Aggregator Service";
        if (apiVersion == null || apiVersion.isBlank()) apiVersion = "v1";
    }
}
