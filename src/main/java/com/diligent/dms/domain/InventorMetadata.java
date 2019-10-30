package com.diligent.dms.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InventorMetadata {
    private Extent extent;
    private Property<Double> surface;
    private Property<Double> volume;
}
