package com.gameaggregator.platform.core.common.id;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class SnowflakeIdGeneratorTest {
    @Test
    void generatesMonotonicallyIncreasingIds() {
        SnowflakeIdGenerator generator = new SnowflakeIdGenerator(1);
        long first = generator.nextId();
        long second = generator.nextId();
        assertThat(second).isGreaterThan(first);
    }

    @Test
    void rejectsInvalidNodeId() {
        assertThatThrownBy(() -> new SnowflakeIdGenerator(1024)).isInstanceOf(IllegalArgumentException.class);
    }
}
