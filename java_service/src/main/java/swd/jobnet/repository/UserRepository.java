package swd.jobnet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swd.jobnet.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
}