package com.gameaggregator.platform.core.common.id;

import java.time.Clock;

public final class SnowflakeIdGenerator {
    private static final long EPOCH = 1735689600000L;
    private static final long MAX_NODE = 1023L;
    private static final long SEQUENCE_MASK = 4095L;
    private final long nodeId;
    private final Clock clock;
    private long lastTimestamp = -1L;
    private long sequence;

    public SnowflakeIdGenerator(long nodeId) { this(nodeId, Clock.systemUTC()); }

    SnowflakeIdGenerator(long nodeId, Clock clock) {
        if (nodeId < 0 || nodeId > MAX_NODE) throw new IllegalArgumentException("nodeId must be between 0 and 1023");
        this.nodeId = nodeId;
        this.clock = clock;
    }

    public synchronized long nextId() {
        long timestamp = clock.millis();
        if (timestamp < lastTimestamp) throw new IllegalStateException("Clock moved backwards");
        if (timestamp == lastTimestamp) {
            sequence = (sequence + 1) & SEQUENCE_MASK;
            if (sequence == 0) timestamp = waitForNextMillis(lastTimestamp);
        } else {
            sequence = 0;
        }
        lastTimestamp = timestamp;
        return ((timestamp - EPOCH) << 22) | (nodeId << 12) | sequence;
    }

    private long waitForNextMillis(long previous) {
        long timestamp = clock.millis();
        while (timestamp <= previous) {
            Thread.onSpinWait();
            timestamp = clock.millis();
        }
        return timestamp;
    }
}
