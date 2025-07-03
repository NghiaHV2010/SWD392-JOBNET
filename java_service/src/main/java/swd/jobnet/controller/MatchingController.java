package swd.jobnet.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import swd.jobnet.dto.CvDto;
import swd.jobnet.dto.JobDto;
import swd.jobnet.dto.Response;
import swd.jobnet.service.MatchingService;

@RestController
@RequestMapping("/api/matching")
public class MatchingController {

    @Autowired
    private MatchingService matchingService;

    @GetMapping("/get-matching-job")
    public ResponseEntity<Response> getMatchingJob(@RequestParam String jobId,
                                                   @RequestParam String cvId) {
        Response response = matchingService.getMatchingJob(cvId, jobId);
        return ResponseEntity.status(response.getStatusCode().getCode()).body(response);
    }
}
