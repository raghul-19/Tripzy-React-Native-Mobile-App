package com.example.Backend.Repository;


import com.example.Backend.Entity.Ride;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface RideRepository extends JpaRepository<Ride,Integer> {

    @Query("Select r from Ride r where r.email=:email order By r.createdAt desc")
    List<Ride> findAllRidesByEmail(@Param("email") String email);

    @Query("Select r from Ride r where r.email=:email")
    public Page<Ride> findRecentRideByEmail(@Param("email") String email, Pageable pageable);
}
