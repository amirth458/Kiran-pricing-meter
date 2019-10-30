package com.diligent.dms.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Property<T> {
    private String unit;
    private T value;
}
