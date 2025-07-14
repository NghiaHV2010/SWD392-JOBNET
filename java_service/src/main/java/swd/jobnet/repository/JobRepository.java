package swd.jobnet.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import swd.jobnet.model.Job;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, String> {
    @Query(value = "SELECT p FROM Job p LEFT JOIN Company c " +
                    "ON p.company.id = c.id WHERE c.companyName LIKE %:companyName%")
    List<Job> findByCompanyName(
            @Param("companyName") String companyName);

    @Query(value = "SELECT p from Job p where p.id = :id")
    Job findJobById(@Param("id")String id);

    @Query(value = "SELECT * FROM jobs where description REGEXP :descriptions", nativeQuery = true)
    List<Job> findByDescriptionWith(String descriptions);
}