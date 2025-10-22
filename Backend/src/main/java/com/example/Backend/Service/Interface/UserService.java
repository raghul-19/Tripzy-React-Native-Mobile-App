package com.example.Backend.Service.Interface;

import com.example.Backend.Model.Request.EmailChangeRequest;
import com.example.Backend.Model.Request.UserProfileChangeRequest;
import com.example.Backend.Model.Request.UserRequest;
import com.example.Backend.Model.Response.UserResponse;

import java.io.IOException;

public interface UserService {
    UserResponse createUser(UserRequest request) throws IOException;
    UserResponse getUserByUserId(String userId);
    UserResponse updateUserProfile(UserProfileChangeRequest request);
    UserResponse updateUserEmail(EmailChangeRequest request);
}
