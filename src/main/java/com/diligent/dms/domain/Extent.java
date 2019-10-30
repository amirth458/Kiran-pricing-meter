package com.diligent.dms.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Extent {
    private Property<Double> x;
    private Property<Double> y;
    private Property<Double> z;
}