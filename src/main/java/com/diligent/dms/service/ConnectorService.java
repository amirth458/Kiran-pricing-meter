package com.diligent.dms.service;

import com.diligent.dms.domain.ConnectorLoginRequest;
import com.diligent.dms.domain.ConnectorLoginResponse;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import jdk.nashorn.internal.objects.annotations.Getter;
import jdk.nashorn.internal.objects.annotations.Setter;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.util.Map;

import static org.springframework.http.HttpMethod.POST;
import static org.springframework.http.MediaType.MULTIPART_FORM_DATA;

@Component
public class ConnectorService {

    private static final String CONNECTOR_API_PREFIX = "http://connector-service-2.us-west-2.elasticbeanstalk.com";

    public void uploadFile(File file) {
        MultiValueMap<String, Object> bodyMap = new LinkedMultiValueMap<>();
        bodyMap.add("file", new FileSystemResource(file));
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MULTIPART_FORM_DATA);
        headers.setBearerAuth(getToken());
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(bodyMap, headers);

        RestTemplate restTemplate = new RestTemplate();
        String uri = CONNECTOR_API_PREFIX + "/api/v1/file";
        ResponseEntity<String> response = restTemplate.exchange(uri, POST, requestEntity, String.class);

    }

    private String getToken() {
        RestTemplate restTemplate = new RestTemplate();
        String uri = CONNECTOR_API_PREFIX + "/api/v1/users/signin";
        HttpHeaders headers = new HttpHeaders();

        ConnectorLoginRequest connectorLoginRequest = new ConnectorLoginRequest();
        connectorLoginRequest.setEmail("shop_manage_admin@3diligent.com");
        connectorLoginRequest.setPassword("shop_manage_admin@3diligent.com");
        Gson gson = new GsonBuilder().serializeNulls().setPrettyPrinting().create();
        HttpEntity<String> requestEntity = new HttpEntity<>(gson.toJson(connectorLoginRequest), headers);

        ResponseEntity<ConnectorLoginResponse> response = restTemplate.exchange(uri, POST, requestEntity, ConnectorLoginResponse.class);
        ConnectorLoginResponse connectorLoginResponse = response.getBody();
        return connectorLoginResponse.getAccessToken();
    }
}
