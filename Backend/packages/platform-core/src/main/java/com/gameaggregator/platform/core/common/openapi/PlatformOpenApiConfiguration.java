package com.gameaggregator.platform.core.common.openapi;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;

public final class PlatformOpenApiConfiguration {
    private PlatformOpenApiConfiguration() {}

    public static OpenAPI create(String title, String version) {
        return new OpenAPI()
                .info(new Info().title(title).version(version))
                .components(new Components().addSecuritySchemes("bearerAuth",
                        new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")));
    }
}
