package com.diligent.dms.domain;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ConnectorGetMetadataResponse {
    private Long id;
    private String status;

    private String smallImage;
    private String mediumImage;
    private String largeImage;

    // File Properties
    private String author;
    private String creationDate;
    private String originalSystem;
    private String preprocessor;
    private String title;
    private String name;
}
