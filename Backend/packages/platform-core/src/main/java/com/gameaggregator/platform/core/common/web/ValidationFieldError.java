package com.gameaggregator.platform.core.common.web;

public record ValidationFieldError(String field, String message, Object rejectedValue) {}
