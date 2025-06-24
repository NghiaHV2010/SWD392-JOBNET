package swd.jobnet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swd.jobnet.model.Job;

@Repository
public interface JobRepository extends JpaRepository<Job, String> {
}