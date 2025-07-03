package swd.jobnet.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link swd.jobnet.model.User}
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDto implements Serializable {
    private String id;
    private String username;
    private String email;
    private String password;
    private String imageUrl;
    private String description;
    private Instant createdAt;
    private Instant updatedAt;
}