package com.diligent.dms.webapi;

import com.diligent.dms.domain.ConnectorGetMetadataResponse;
import com.diligent.dms.domain.ConnectorUploadFileResponse;
import com.diligent.dms.service.ConnectorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Random;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

@RequestMapping("/api/v1/connector")
@RestController
public class ConnectorController {
    private final static String CATALINA_HOME = System.getenv("CATALINA_HOME") != null ? System.getenv("CATALINA_HOME") : (System.getProperty("CATALINA_HOME") != null ? System.getProperty("CATALINA_HOME") : "/tmp");

    private ConnectorService connectorService;
    private Random random;

    @Autowired
    public ConnectorController(ConnectorService connectorService) {
        this.connectorService = connectorService;
        this.random = new Random();
    }

    @PostMapping("/upload-file")
    public ResponseEntity uploadFile(@RequestParam(value = "file", required = true) MultipartFile multipartFile) throws IOException {
        /*byte[] bytes = multipartFile.getBytes();
        Path path = Paths.get(CATALINA_HOME.endsWith("/") ? CATALINA_HOME : (CATALINA_HOME + "/") + multipartFile.getOriginalFilename());
        File file = path.toFile();
        Files.write(path, bytes);

        // TODO: code here

        file.delete();*/
        ConnectorUploadFileResponse connectorUploadFileResponse = ConnectorUploadFileResponse.builder()
                .id(random.nextLong())
                .fileName(multipartFile.getOriginalFilename())
                .s3URL("https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/2/2019/10/15/2019-10-15_15-29-12-designjawoptimizedv2_1556302223718.step")
                .presignedS3URL("https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/2/2019/10/15/2019-10-15_15-29-12-designjawoptimizedv2_1556302223718.step?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20191015T152912Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20191015%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=c11050c3967ccb382a99176e06035cfa9a9d1755d026d68a5d0d86ef21439a3f")
                .build();

        return new ResponseEntity(connectorUploadFileResponse, CREATED);
    }

    @GetMapping("/metadata/{id}")
    public ResponseEntity getMetadata(@PathVariable("id") Long id) {
        ConnectorGetMetadataResponse connectorGetMetadataResponse = ConnectorGetMetadataResponse.builder()
                .id(id)
                .status("COMPLETED")
                .smallImage("http://d3-lo-dev.s3.amazonaws.com/design_jaw_optimized_v2_1556302223718.svf.png01_thumb_400x400.png")
                .mediumImage("http://d3-lo-dev.s3.amazonaws.com/design_jaw_optimized_v2_1556302223718.svf.png01_thumb_400x400.png")
                .largeImage("http://d3-lo-dev.s3.amazonaws.com/design_jaw_optimized_v2_1556302223718.svf.png01_thumb_400x400.png")
                .author("aalrashd")
                .creationDate("2018-Aug-27 10:23:05")
                .originalSystem("Autodesk Translation Framework v7.6.0.251")
                .preprocessor("ST-DEVELOPER v17.2")
                .title("/Users/abdullahalrashdan/Desktop/3Diligent Corporation/Topological optimization /design jaw optimized v1.step")
                .name("design_jaw_optimized_v2_1556302223718")
                .build();
        return new ResponseEntity(connectorGetMetadataResponse, OK);
    }
}
