package com.example.Backend.Service.Interface;

import com.example.Backend.Model.Request.RideRequest;
import com.example.Backend.Model.Response.RideResponse;

import java.util.List;



public interface RideService {

    List<RideResponse> findAllRides(String email);
    RideResponse findRecentRide(String email);
    RideResponse registerNewRide(RideRequest ride);
}
