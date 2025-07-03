package swd.jobnet.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Entity
@Table(name = "matchings")
public class Matching {
    @Id
    @Column(name = "id", nullable = false, length = 191)
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "score", nullable = false, precision = 5, scale = 2)
    private BigDecimal score;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cv_id", nullable = false)
    private Cv cv;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

}