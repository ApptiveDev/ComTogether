package com.cmg.comtogether.common.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        SecurityScheme securityScheme = new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
                .name("Authorization");

        SecurityRequirement securityRequirement = new SecurityRequirement().addList("BearerAuth");

        return new OpenAPI()
                .info(new Info()
                        .title("ComTogether API Docs")
                        .description("ComTogether 프로젝트 API 명세서")
                        .version("v1.0"))
                .components(new Components().addSecuritySchemes("BearerAuth", securityScheme))
                .addSecurityItem(securityRequirement);
    }

    @Bean
    public OpenApiCustomizer oauthSecurityIgnoreCustomizer() {
        return openApi -> openApi.getPaths().forEach((path, pathItem) -> {
            if (path.startsWith("/oauth") || path.startsWith("/refresh") || path.startsWith("/users/all")) {
                pathItem.readOperations().forEach(operation -> operation.setSecurity(Collections.emptyList()));
            }
        });
    }
}
