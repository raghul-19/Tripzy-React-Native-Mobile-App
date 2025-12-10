package com.example.Backend.Model.Request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder


public class RideRequest {

    private String sourceName;
    private String destinationName;
    private BigDecimal sourceLatitude;
    private BigDecimal sourceLongitude;
    private BigDecimal destinationLatitude;
    private BigDecimal destinationLongitude;
    private int distance;
    private String email;
    private int time;
    private String duration;
    private int seats;
    private int fare;
    private BigDecimal ratings;
    private String name;

}
