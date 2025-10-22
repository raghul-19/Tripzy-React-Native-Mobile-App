package com.example.Backend.Controller;

import com.example.Backend.Model.Request.EmailChangeRequest;
import com.example.Backend.Model.Request.UserProfileChangeRequest;
import com.example.Backend.Model.Response.UserResponse;
import com.example.Backend.Service.Interface.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/user")

public class UserController {

    @Autowired
    private UserService userService;

    @PutMapping("/updateProfile")
    public ResponseEntity<?> updateUserProfile(@RequestBody UserProfileChangeRequest request) {
        UserResponse user=userService.updateUserProfile(request);
        if(user!=null) return ResponseEntity.ok(user);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message","User not found"));
    }

    @PutMapping("/emailUpdate")
    public ResponseEntity<?> updateUserEmail(@RequestBody EmailChangeRequest request) {
        UserResponse user=userService.updateUserEmail(request);
        if(user!=null) return ResponseEntity.ok(user);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message","User not found"));
    }
}
