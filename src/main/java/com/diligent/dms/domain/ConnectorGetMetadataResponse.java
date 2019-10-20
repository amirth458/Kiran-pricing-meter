package com.diligent.dms.domain;

import lombok.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ConnectorGetMetadataResponse {
    private Long id;
    private String cadFileS3URL;
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

    public static ConnectorGetMetadataResponse map(MetadataView metadataView) {
        Map<String, Object> fileProperties = getFileProperties(metadataView.getForgeAPIMetadata());
        List<Map<String, Object>> thumbnails = metadataView.getForgeAPIMetadata() != null && metadataView.getForgeAPIMetadata().containsKey("thumbnails") ? (List<Map<String, Object>>) metadataView.getForgeAPIMetadata().get("thumbnails") : new ArrayList<>();

        return ConnectorGetMetadataResponse.builder()
                .id(metadataView.getId())
                .status(metadataView.getStatus())
                .cadFileS3URL(metadataView.getS3Url())

                .smallImage(getThumbnail(thumbnails, "100x100"))
                .mediumImage(getThumbnail(thumbnails, "200x200"))
                .largeImage(getThumbnail(thumbnails, "400x400"))

                .name(getValue(fileProperties, "Name"))
                .title(getValue(fileProperties, "Title"))
                .author(getValue(fileProperties, "Author"))
                .creationDate(getValue(fileProperties, "Creation Date"))
                .originalSystem(getValue(fileProperties, "Original System"))
                .preprocessor(getValue(fileProperties, "Preprocessor"))
                .build();
    }

    private static String getValue(Map<String, Object> map, String key) {
        if (map.containsKey(key)) {
            return (String) map.get(key);
        }
        return null;
    }

    private static String getThumbnail(List<Map<String, Object>> thumbnails, String resolution) {
        for (Map<String, Object> thumbnail : thumbnails) {
            if (thumbnail.get("resolution").equals(resolution)) {
                return (String) thumbnail.get("s3URL");
            }
        }
        return null;
    }

    private static Map<String, Object> getFileProperties(Map<String, Object> forgeAPIMetadata) {
        if (forgeAPIMetadata != null) {
            Map<String, Object> autodeskMetadata = (Map<String, Object>) forgeAPIMetadata.get("autodeskMetadata");
            if (autodeskMetadata != null) {
                List<Map<String, Object>> metadataMetadata = (List<Map<String, Object>>) autodeskMetadata.get("metadataMetadata");
                if (autodeskMetadata != null) {
                    for (Map<String, Object> metadataMetadatum : metadataMetadata) {
                        if (metadataMetadatum.containsKey("designMetadata")) {
                            Map<String, Object> designMetadata = (Map<String, Object>) metadataMetadatum.get("designMetadata");
                            if (designMetadata != null && designMetadata.containsKey("data")) {
                                Map<String, Object> data = (Map<String, Object>) designMetadata.get("data");
                                if (data != null && data.containsKey("collection")) {
                                    List<Map<String, Object>> collections = (List<Map<String, Object>>) data.get("collection");
                                    if (collections != null) {
                                        for (Map<String, Object> collection : collections) {
                                            if (collection.containsKey("properties")) {
                                                Map<String, Object> properties = (Map<String, Object>) collection.get("properties");
                                                if (properties != null && properties.containsKey("File Properties")) {
                                                    Map<String, Object> response = (Map<String, Object>) properties.get("File Properties");
                                                    response.put("Name", properties.get("Name"));
                                                    return response;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return new HashMap<>();
    }
}
