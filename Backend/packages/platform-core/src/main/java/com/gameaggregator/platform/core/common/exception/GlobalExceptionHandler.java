package com.gameaggregator.platform.core.common.exception;

import com.gameaggregator.platform.core.common.web.ApiErrorResponse;
import com.gameaggregator.platform.core.common.web.ErrorDetail;
import com.gameaggregator.platform.core.common.web.ValidationFieldError;
import jakarta.validation.ConstraintViolationException;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public final class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(DomainException.class)
    public ResponseEntity<ApiErrorResponse> handleDomain(DomainException exception) {
        return ResponseEntity.status(exception.status()).body(ApiErrorResponse.of(exception.code(), exception.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleBodyValidation(MethodArgumentNotValidException exception) {
        List<ValidationFieldError> fields = exception.getBindingResult().getFieldErrors().stream()
                .map(error -> new ValidationFieldError(error.getField(), error.getDefaultMessage(), error.getRejectedValue()))
                .toList();
        return validationResponse(fields);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleConstraintValidation(ConstraintViolationException exception) {
        List<ValidationFieldError> fields = exception.getConstraintViolations().stream()
                .map(error -> new ValidationFieldError(error.getPropertyPath().toString(), error.getMessage(), error.getInvalidValue()))
                .toList();
        return validationResponse(fields);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleUnreadable(HttpMessageNotReadableException exception) {
        return ResponseEntity.badRequest().body(ApiErrorResponse.of("INVALID_REQUEST_BODY", "Request body is invalid or malformed"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnexpected(Exception exception) {
        log.error("Unhandled request exception", exception);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiErrorResponse.of("INTERNAL_ERROR", "An unexpected error occurred"));
    }

    private ResponseEntity<ApiErrorResponse> validationResponse(List<ValidationFieldError> fields) {
        return ResponseEntity.badRequest().body(new ApiErrorResponse(false,
                new ErrorDetail("VALIDATION_FAILED", "Request validation failed", fields)));
    }
}
