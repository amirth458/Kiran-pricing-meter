package com.diligent.dms.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InventorMetadata {
    private Extent extent;
    private Property<Double> surface;
    private Property<Double> volume;
    private String thumbnail100;
    private String thumbnail200;
    private String thumbnail400;
}
