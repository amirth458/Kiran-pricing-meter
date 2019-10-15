package com.diligent.dms.domain;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ConnectorLoginResponse {
    private String accessToken;
    private String tokenType;
    private String generatedIn;
    private String expiryDate;
    private List<String> roles;
}
