package com.diligent.dms.domain;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@Builder(builderMethodName = "builder")
@NoArgsConstructor(access = AccessLevel.PUBLIC)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class MetadataView {
    private Long id;
    private String fileName;
    private String s3Url;
    private String status;
    private Map<String, Object> forgeAPIMetadata;
    private InventorMetadata inventorAPIMetadata;
    private String errorMessage;
}
