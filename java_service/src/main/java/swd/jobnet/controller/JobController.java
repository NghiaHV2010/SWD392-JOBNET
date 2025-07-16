package swd.jobnet.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import swd.jobnet.dto.CompanyDto;
import swd.jobnet.dto.JobDto;
import swd.jobnet.dto.Response;
import swd.jobnet.service.JobService;

@RestController
@RequestMapping("/api/job")
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping("/get-by-company-name")
    public ResponseEntity<Response> getByCompanyName(@RequestParam String companyName){
        Response response = jobService.getJobsByCompanyName(companyName);
        return ResponseEntity.status(response.getStatusCode().getCode()).body(response);
    }

    @GetMapping("/export-by-company-name")
    public ResponseEntity<Response> exportByCompanyName(@RequestParam CompanyDto companyDto){
        Response response = jobService.exportJobsByCompanyName(companyDto);
        return ResponseEntity.status(response.getStatusCode().getCode()).body(response);
    }

    @GetMapping("/get-all")
    public ResponseEntity<Response> getAllJobs(@RequestParam int page){
        Response response = jobService.getAllJobs(page);
        return ResponseEntity.status(response.getStatusCode().getCode()).body(response);
    }

    @GetMapping("/get-by-id")
    public ResponseEntity<Response> getJobById(@RequestParam String jobId){
        Response response = jobService.getJobById(jobId);
        return ResponseEntity.status(response.getStatusCode().getCode()).body(response);
    }
}
