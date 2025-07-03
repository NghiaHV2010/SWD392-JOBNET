package swd.jobnet.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swd.jobnet.dto.CvDto;
import swd.jobnet.dto.Response;
import swd.jobnet.service.CvService;

@RestController
@RequestMapping("/api/cv")
public class CvController {
    @Autowired
    private CvService cvService;

    @PostMapping("/create-new-cv")
    public ResponseEntity<Response> createNewCv(@RequestBody CvDto cvDto){
        Response response = cvService.createNewCv(cvDto);
        return ResponseEntity.status(response.getStatusCode().getCode()).body(response);
    }
}
