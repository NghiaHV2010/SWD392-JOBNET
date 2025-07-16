package swd.jobnet.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import swd.jobnet.dto.CompanyDto;
import swd.jobnet.dto.JobDto;
import swd.jobnet.dto.Response;
import swd.jobnet.enums.StatusCode;
import swd.jobnet.model.Job;
import swd.jobnet.repository.JobRepository;
import swd.jobnet.util.CsvExporter;
import swd.jobnet.util.DtoConverter;

import java.io.FileWriter;
import java.util.List;

@Service
public class JobService {

    @Value("${file.path.job}")
    private String JOB_FILE_PATH;

    @Value("${csv.path.job}")
    private String JOB_CSV_PATH;

    @Autowired
    private JobRepository jobRepository;

    public Response getJobsByCompanyName(String companyName) {
        Response response = new Response();
        try {
            List<Job> jobs = jobRepository.findByCompanyName(companyName);
            if (jobs.isEmpty()) {
                response.setStatusCode(StatusCode.NO_CONTENT);
                response.setMessage(StatusCode.NO_CONTENT.getDescription());
            }else {
                List<JobDto> jobDtos = jobs.stream().map(DtoConverter::convertToJobDto).toList();
                response.setStatusCode(StatusCode.OK);
                response.setMessage(StatusCode.OK.getDescription());
                response.setJobDtos(jobDtos);
            }
        }catch (Exception e){
            response.setStatusCode(StatusCode.INTERNAL_SERVER_ERROR);
            response.setMessage(StatusCode.INTERNAL_SERVER_ERROR.getDescription() + "tại JobService: " + e.getMessage());
        }
        return response;
    }

    public Response exportJobsByCompanyName(CompanyDto companyName) {
        Response response = new Response();
        try {
            List<Job> jobs = jobRepository.findByCompanyName(companyName.getCompanyName());
            if (jobs.isEmpty()) {
                response.setStatusCode(StatusCode.NO_CONTENT);
                response.setMessage(StatusCode.NO_CONTENT.getDescription());
                response.setJobDtos(null);
            }else {
                ObjectMapper objectMapper = new ObjectMapper();
                objectMapper.enable(SerializationFeature.INDENT_OUTPUT)
                            .findAndRegisterModules()
                            .writeValue(new FileWriter(JOB_FILE_PATH), jobs);
                CsvExporter.readJsonWriteCsv(objectMapper.writeValueAsString(jobs), JOB_CSV_PATH);
                response.setStatusCode(StatusCode.OK);
                response.setMessage(StatusCode.OK.getDescription());
            }
        }catch (Exception e){
            response.setStatusCode(StatusCode.INTERNAL_SERVER_ERROR);
            response.setMessage(StatusCode.INTERNAL_SERVER_ERROR.getDescription() + " khi xuất Jobs: " + e.getMessage());
        }
        return response;
    }

    public Response getAllJobs(int page){
        Response response = new Response();
        try{
            Pageable pageable = PageRequest.of(page-1, 20);
            Page<Job> jobs = jobRepository.findAll(pageable);
            if (jobs.isEmpty()) {
                response.setStatusCode(StatusCode.NO_CONTENT);
                response.setMessage(StatusCode.NO_CONTENT.getDescription());
                response.setJobDtos(null);
            }else{
                List<JobDto> jobDtos = jobs.stream().map(DtoConverter::convertToJobDto).toList();
                response.setStatusCode(StatusCode.OK);
                response.setMessage(StatusCode.OK.getDescription());
                response.setJobDtos(jobDtos);

            }
        }catch (Exception e){
            response.setStatusCode(StatusCode.INTERNAL_SERVER_ERROR);
            response.setMessage(StatusCode.INTERNAL_SERVER_ERROR.getDescription() + " khi lấy tất cả jobs: " + e.getMessage());
        }
        return  response;
    }

    public Response getJobById(String jobId){
        Response response = new Response();
        try{
            Job job = jobRepository.findJobById(jobId);
            if (job.getId().isEmpty()) {
                response.setStatusCode(StatusCode.NO_CONTENT);
                response.setMessage(StatusCode.NO_CONTENT.getDescription());
                response.setJobDto(new JobDto());
            }else{
                JobDto output = DtoConverter.convertToJobDto(job);
                response.setStatusCode(StatusCode.OK);
                response.setMessage(StatusCode.OK.getDescription());
                response.setJobDto(output);
            }
        }catch(Exception e){
            response.setStatusCode(StatusCode.INTERNAL_SERVER_ERROR);
            response.setMessage(StatusCode.INTERNAL_SERVER_ERROR.getDescription() + " khi lấy thông tin job: " + e.getMessage());
        }
        return response;
    }
}
