package swd.jobnet.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swd.jobnet.dto.CvDto;
import swd.jobnet.dto.JobDto;
import swd.jobnet.dto.Response;
import swd.jobnet.enums.StatusCode;
import swd.jobnet.repository.CompanyRepository;
import swd.jobnet.repository.CvRepository;
import swd.jobnet.repository.JobRepository;

@Service
class MatchingService {

    private String matchingJobPrompt = "Base on the CV's informations in the first file and the job's informations" +
            " in the second file, give me the matching point";

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private CvRepository cvRepository;

    public Response getMatchingJob(CvDto cvDto) {
        Response response = new Response();
        try {
            response.setStatusCode(StatusCode.OK);
            response.setMessage(StatusCode.OK.getDescription());
        }catch (Exception e) {
            response.setStatusCode(StatusCode.INTERNAL_SERVER_ERROR);
            response.setMessage(StatusCode.INTERNAL_SERVER_ERROR.getDescription() + "khi tìm job phù hợp: " + e.getMessage());
        }
        return  response;
    }
}
