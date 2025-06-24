package swd.jobnet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swd.jobnet.model.Cv;

@Repository
public interface CvRepository extends JpaRepository<Cv, String> {
}