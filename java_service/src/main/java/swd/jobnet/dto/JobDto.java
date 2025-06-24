package swd.jobnet.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.Value;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;

/**
 * DTO for {@link swd.jobnet.model.Job}
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class JobDto implements Serializable {
    private String id;
    private String title;
    private String salary;
    private String description;
    private LocalDate endDate;
    private String applyLocation;
    private String experience;
    private String formOfWork;
    private String jobLevel;
    private String education;
    private String tags;
    private Integer quantity;
    private String sourceUrl;
    private Instant createdAt;
    private Instant updatedAt;
}