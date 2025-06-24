package swd.jobnet.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "cvs")
public class Cv {
    @Id
    @Column(name = "id", nullable = false, length = 191)
    private String id;

    @Column(name = "fullname", nullable = false, length = 50)
    private String fullname;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "email", length = 100)
    private String email;

    @Lob
    @Column(name = "address", length = 256)
    private String address;

    @Lob
    @Column(name = "description", length = 256)
    private String description;

    @Lob
    @Column(name = "experience", length = 256)
    private String experience;

    @Lob
    @Column(name = "skills", length = 256)
    private String skills;

    @Lob
    @Column(name = "education", length = 256)
    private String education;

    @Lob
    @Column(name = "certificates", length = 256)
    private String certificates;

    @Lob
    @Column(name = "others", length = 256)
    private String others;

    @Lob
    @Column(name = "apply_job", length = 256)
    private String applyJob;

    @Lob
    @Column(name = "hobbies", length = 256)
    private String hobbies;

    @Lob
    @Column(name = "`references`", length = 256)
    private String references;

    @Lob
    @Column(name = "languages", length = 256)
    private String languages;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ColumnDefault("current_timestamp(3)")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "cv")
    private Set<Matching> matchings = new LinkedHashSet<>();

}