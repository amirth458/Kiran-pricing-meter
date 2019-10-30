package com.diligent.dms.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InventorMetadata {
    private Extent extent;
    private Property<Double> surface;
    private Property<Double> volume;

    @Getter
    @Setter
    class Extent {
        private Property<Double> x;
        private Property<Double> y;
        private Property<Double> z;
    }

    @Getter
    @Setter
    class Property<T> {
        private String unit;
        private T value;
    }
}
