package swd.jobnet.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.Value;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

/**
 * DTO for {@link swd.jobnet.model.Matching}
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MatchingDto implements Serializable {
    private String id;
    private BigDecimal score;
    private Instant createdAt;
}