package swd.jobnet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swd.jobnet.model.Company;

@Repository
public interface CompanyRepository extends JpaRepository<Company, String> {
}