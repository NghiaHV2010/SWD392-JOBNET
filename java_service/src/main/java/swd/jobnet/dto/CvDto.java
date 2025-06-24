package swd.jobnet.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.Value;

import java.io.Serializable;
import java.time.Instant;
import java.util.Set;

/**
 * DTO for {@link swd.jobnet.model.Cv}
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CvDto implements Serializable {
    private String id;
    private String fullname;
    private String phone;
    private String email;
    private String address;
    private String description;
    private String experience;
    private String skills;
    private String education;
    private String certificates;
    private String others;
    private String applyJob;
    private String hobbies;
    private String references;
    private String languages;
    private UserDto user;
    private Instant createdAt;
    private Instant updatedAt;
    private Set<MatchingDto> matchings;
}