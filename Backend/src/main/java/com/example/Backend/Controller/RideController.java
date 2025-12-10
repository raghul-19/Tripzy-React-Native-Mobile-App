package com.example.Backend.Controller;

import com.example.Backend.Entity.Ride;
import com.example.Backend.Model.Request.RideRequest;
import com.example.Backend.Service.Interface.RideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/ride")

public class RideController {

    @Autowired
    private RideService rideService;

    @GetMapping
    public ResponseEntity<?> getAllRides(@RequestParam("email") String email) {
        try {
            return ResponseEntity.ok().body(rideService.findAllRides(email));
        } catch(Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(500).body(Map.of("message","Internal server error, Try again!"));
        }
    }

    @GetMapping("/recent")
    public ResponseEntity<?> getRecentRide(@RequestParam("email") String email) {
        try {
            return ResponseEntity.ok().body(rideService.findRecentRide(email));
        } catch(Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(500).body(Map.of("message","Internal server error, Try again!"));
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createRide(@RequestBody RideRequest ride) {
        try {
            return ResponseEntity.ok().body(rideService.registerNewRide(ride));
        } catch(Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(500).body(Map.of("message","Internal server error, Try again!"));
        }
    }
}
