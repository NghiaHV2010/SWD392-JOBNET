package swd.jobnet.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "jobs")
public class Job {
    @Id
    @Column(name = "id", nullable = false, length = 191)
    private String id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "salary", length = 80)
    private String salary;

    @Lob
    @Column(name = "description", length = 256)
    private String description;

    @Column(name = "endDate")
    private LocalDate endDate;

    @Column(name = "apply_location", length = 150)
    private String applyLocation;

    @Column(name = "experience", length = 50)
    private String experience;

    @Column(name = "form_of_work", length = 50)
    private String formOfWork;

    @Column(name = "job_level", length = 50)
    private String jobLevel;

    @Column(name = "education", length = 50)
    private String education;

    @Lob
    @Column(name = "tags", length = 256)
    private String tags;

    @Column(name = "quantity")
    private Integer quantity;

    @Lob
    @Column(name = "sourceUrl", length = 256)
    private String sourceUrl;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ColumnDefault("current_timestamp(3)")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "job")
    private Set<Matching> matchings = new LinkedHashSet<>();

}