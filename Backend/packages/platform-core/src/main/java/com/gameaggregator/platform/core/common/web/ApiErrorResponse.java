package com.gameaggregator.platform.core.common.web;

public record ApiErrorResponse(boolean success, ErrorDetail error) {
    public static ApiErrorResponse of(String code, String message) {
        return new ApiErrorResponse(false, new ErrorDetail(code, message, null));
    }
}
