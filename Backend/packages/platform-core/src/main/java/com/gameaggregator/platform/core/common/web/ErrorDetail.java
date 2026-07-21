package com.gameaggregator.platform.core.common.web;

import java.util.List;

public record ErrorDetail(String code, String message, List<ValidationFieldError> fields) {
    public ErrorDetail {
        fields = fields == null ? List.of() : List.copyOf(fields);
    }
}
