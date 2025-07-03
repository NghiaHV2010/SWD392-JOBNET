package swd.jobnet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import swd.jobnet.model.Cv;

@Repository
public interface CvRepository extends JpaRepository<Cv, String> {

    @Query(value = "SELECT p from Cv p where p.id = :id")
    Cv findCvById(@Param("id") String id);
}