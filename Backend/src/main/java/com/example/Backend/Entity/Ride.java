package com.example.Backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="ride_data")
@AllArgsConstructor
@Data
@NoArgsConstructor
@Builder

public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String sourceName;
    private String destinationName;
    private BigDecimal sourceLatitude;
    private BigDecimal sourceLongitude;
    private BigDecimal destinationLatitude;
    private BigDecimal destinationLongitude;
    private int distance;
    private int time;
    private String duration;
    private int seats;
    private int fare;
    private BigDecimal ratings;
    private String email;
    private boolean status;
    @CreationTimestamp
    private LocalDateTime createdAt;
    private String name;

    @PrePersist
    public void init() {
        this.status=true;
    }

}
