package swd.jobnet.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "companies")
public class Company {
    @Id
    @Column(name = "id", nullable = false, length = 191)
    private String id;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "email", length = 100)
    private String email;

    @Lob
    @Column(name = "address", length = 256)
    private String address;

    @Lob
    @Column(name = "description", length = 256)
    private String description;

    @Lob
    @Column(name = "website", length = 256)
    private String website;

    @Column(name = "field", length = 100)
    private String field;

    @Lob
    @Column(name = "imageUrl", length = 256)
    private String imageUrl;

    @Lob
    @Column(name = "sourceUrl", length = 256)
    private String sourceUrl;

    @Column(name = "source_name", length = 150)
    private String sourceName;

    @Column(name = "employees")
    private Integer employees;

    @ColumnDefault("current_timestamp(3)")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "company")
    private Set<Job> jobs = new LinkedHashSet<>();

}