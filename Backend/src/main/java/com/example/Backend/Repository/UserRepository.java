package com.example.Backend.Repository;

import com.example.Backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository

public interface UserRepository extends JpaRepository<User,Long> {

    @Query("Select u from User u where u.email=:email")
    User findByEmail(@Param("email") String email);
}
