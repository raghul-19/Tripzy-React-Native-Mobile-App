package com.example.Backend.Model.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@AllArgsConstructor
@Data
@NoArgsConstructor
@Builder

public class RideResponse {

    private int id;
    private String name;
    private String sourceName;
    private String destinationName;
    private BigDecimal sourceLatitude;
    private BigDecimal sourceLongitude;
    private BigDecimal destinationLatitude;
    private BigDecimal destinationLongitude;
    private int seats;
    private LocalDateTime createdAt;
    private int fare;

}
