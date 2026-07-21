package com.gameaggregator.platform.core.common.id;

import java.util.UUID;

public final class Identifiers {
    private Identifiers() {}
    public static UUID newUuid() { return UUID.randomUUID(); }
}
