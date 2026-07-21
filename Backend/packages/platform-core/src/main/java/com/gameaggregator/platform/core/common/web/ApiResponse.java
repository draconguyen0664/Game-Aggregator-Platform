package com.gameaggregator.platform.core.common.web;

public record ApiResponse<T>(boolean success, T data, ResponseMeta meta) {
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, ResponseMeta.current());
    }
}
