package com.gameaggregator.platform.core.common.exception;

import org.springframework.http.HttpStatus;

public final class NotFoundException extends DomainException {
    public NotFoundException(String code, String message) { super(code, message, HttpStatus.NOT_FOUND); }
}
