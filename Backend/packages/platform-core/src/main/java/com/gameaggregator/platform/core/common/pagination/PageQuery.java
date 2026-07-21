package com.gameaggregator.platform.core.common.pagination;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public record PageQuery(
        @Min(0) int page,
        @Min(1) @Max(200) int size,
        String sortBy,
        SortDirection direction) {

    public PageQuery {
        if (size == 0) size = 20;
        if (sortBy == null || sortBy.isBlank()) sortBy = "createdAt";
        if (direction == null) direction = SortDirection.DESC;
    }

    public Pageable toPageable() {
        Sort.Direction springDirection = direction == SortDirection.ASC ? Sort.Direction.ASC : Sort.Direction.DESC;
        return PageRequest.of(page, size, Sort.by(springDirection, sortBy));
    }
}
