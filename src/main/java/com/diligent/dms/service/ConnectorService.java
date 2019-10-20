package com.diligent.dms.service;

import com.diligent.dms.domain.*;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.File;

import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.http.MediaType.MULTIPART_FORM_DATA;

@Component
public class ConnectorService {

    private String connectorServiceHostURL;

    public ConnectorService(@Value("${connector.service.host.url}") String connectorServiceHostURL) {
        this.connectorServiceHostURL = connectorServiceHostURL;
    }

    public ConnectorUploadFileResponse uploadFile(File file) {
        MultiValueMap<String, Object> bodyMap = new LinkedMultiValueMap<>();
        bodyMap.add("file", new FileSystemResource(file));
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MULTIPART_FORM_DATA);
        headers.setBearerAuth(getToken());
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(bodyMap, headers);

        RestTemplate restTemplate = new RestTemplate();
        String uri = connectorServiceHostURL + "/api/v1/file";
        ResponseEntity<ConnectorUploadFileResponse> responseEntity = restTemplate.exchange(uri, POST, requestEntity, ConnectorUploadFileResponse.class);
        return responseEntity.getBody();
    }

    private String getToken() {
        RestTemplate restTemplate = new RestTemplate();
        String uri = connectorServiceHostURL + "/api/v1/users/signin";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        ConnectorLoginRequest connectorLoginRequest = new ConnectorLoginRequest();
        connectorLoginRequest.setEmail("shop_manage_admin@3diligent.com");
        connectorLoginRequest.setPassword("shop_manage_admin@3diligent.com");
        Gson gson = new GsonBuilder().serializeNulls().setPrettyPrinting().create();
        HttpEntity<String> requestEntity = new HttpEntity<>(gson.toJson(connectorLoginRequest), headers);

        ResponseEntity<ConnectorLoginResponse> response = restTemplate.exchange(uri, POST, requestEntity, ConnectorLoginResponse.class);
        ConnectorLoginResponse connectorLoginResponse = response.getBody();
        return connectorLoginResponse.getAccessToken();
    }

    public ConnectorGetMetadataResponse getMetadata(Long metadataId) {
        RestTemplate restTemplate = new RestTemplate();
        String uri = connectorServiceHostURL + "/api/v1/metadata/" + metadataId;
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(getToken());

        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<MetadataView> response = restTemplate.exchange(uri, GET, requestEntity, MetadataView.class);
        ConnectorGetMetadataResponse connectorGetMetadataResponse = ConnectorGetMetadataResponse.map(response.getBody());
        return connectorGetMetadataResponse;
    }
}
