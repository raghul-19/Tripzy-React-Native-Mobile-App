package com.example.Backend.Service.Implementation;

import com.example.Backend.Entity.Ride;
import com.example.Backend.Model.Request.RideRequest;
import com.example.Backend.Model.Response.RideResponse;
import com.example.Backend.Repository.RideRepository;
import com.example.Backend.Service.Interface.RideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service

public class RideServiceImplementation implements RideService {

    @Autowired
    private RideRepository rideRepository;

    private Ride generateRideEntity(RideRequest ride) {
        return Ride.builder()
                .sourceName(ride.getSourceName())
                .destinationName(ride.getDestinationName())
                .sourceLatitude(ride.getSourceLatitude())
                .sourceLongitude(ride.getSourceLongitude())
                .destinationLatitude(ride.getDestinationLatitude())
                .destinationLongitude(ride.getDestinationLongitude())
                .distance(ride.getDistance())
                .email(ride.getEmail())
                .time(ride.getTime())
                .duration(ride.getDuration())
                .seats(ride.getSeats())
                .fare(ride.getFare())
                .ratings(ride.getRatings())
                .name(ride.getName())
                .build();
    }

    private RideResponse generateRideResponse(Ride ride) {
        return RideResponse.builder()
                .id(ride.getId())
                .name(ride.getName())
                .sourceName(ride.getSourceName())
                .destinationName(ride.getDestinationName())
                .sourceLatitude(ride.getSourceLatitude())
                .sourceLongitude(ride.getSourceLongitude())
                .destinationLatitude(ride.getDestinationLatitude())
                .destinationLongitude(ride.getDestinationLongitude())
                .seats(ride.getSeats())
                .createdAt(ride.getCreatedAt())
                .fare(ride.getFare())
                .build();
    }

    @Override
    public List<RideResponse> findAllRides(String email) {
        return rideRepository.findAllRidesByEmail(email).stream().map(ride -> generateRideResponse(ride)).collect(Collectors.toList());
    }

    @Override
    public RideResponse findRecentRide(String email) {
        Pageable pageable= PageRequest.of(0,1, Sort.by("createdAt").descending());
        return generateRideResponse(rideRepository.findRecentRideByEmail(email,pageable).getContent().get(0));
    }

    @Override
    public RideResponse registerNewRide(RideRequest ride) {
        return generateRideResponse(rideRepository.save(generateRideEntity(ride)));
    }
}
