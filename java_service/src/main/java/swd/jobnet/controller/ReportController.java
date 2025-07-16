package swd.jobnet.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import swd.jobnet.dto.Response;
import swd.jobnet.service.ReportService;

@RestController
@RequestMapping("/api/report")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/get-report")
    public ResponseEntity<Response> getReport() {
        Response response = reportService.getReport();
        return ResponseEntity.status(response.getStatusCode().getCode()).body(response);
    }
}
