package swd.jobnet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swd.jobnet.model.Matching;

@Repository
public interface MatchingRepository extends JpaRepository<Matching, String> {
}