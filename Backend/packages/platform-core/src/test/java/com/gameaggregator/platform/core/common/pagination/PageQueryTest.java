package com.gameaggregator.platform.core.common.pagination;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class PageQueryTest {
    @Test
    void appliesSafeDefaults() {
        PageQuery query = new PageQuery(0, 0, null, null);
        assertThat(query.size()).isEqualTo(20);
        assertThat(query.sortBy()).isEqualTo("createdAt");
        assertThat(query.direction()).isEqualTo(SortDirection.DESC);
        assertThat(query.toPageable().getPageSize()).isEqualTo(20);
    }
}
