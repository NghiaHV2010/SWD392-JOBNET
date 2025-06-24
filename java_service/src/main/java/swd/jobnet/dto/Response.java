package swd.jobnet.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import swd.jobnet.enums.StatusCode;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response {
    private StatusCode statusCode;
    private CompanyDto companyDto;
    private CvDto cvDto;
    private JobDto jobDto;
    private MatchingDto matchingDto;
    private UserDto userDto;
    private List<JobDto> jobDtos;
    private List<CvDto> cvDtos;
    private List<CompanyDto> companyDtos;
    private List<MatchingDto> matchingDtos;
    private List<UserDto> userDtos;
}
