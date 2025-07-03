package swd.jobnet.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.Value;

import java.io.Serializable;
import java.time.Instant;
import java.util.Set;

/**
 * DTO for {@link swd.jobnet.model.Company}
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CompanyDto implements Serializable {
    private String id;
    private String companyName;
    private String email;
    private String address;
    private String description;
    private String website;
    private String field;
    private String imageUrl;
    private String sourceUrl;
    private String sourceName;
    private Integer employees;
    private Instant createdAt;
    private Instant updatedAt;
    private Set<JobDto> jobs;
}