package com.diligent.dms.domain;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ConnectorUploadFileResponse {
    private Long id;
    private String fileName;
    private String s3URL;
    private String presignedS3URL;
}
