package com.diligent.dms.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConnectorLoginRequest {
    private String email;
    private String password;
}
