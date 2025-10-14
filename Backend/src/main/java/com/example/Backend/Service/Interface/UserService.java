package com.example.Backend.Service.Interface;

import com.example.Backend.Entity.User;
import com.example.Backend.Model.Request.UserRequest;
import com.example.Backend.Model.Response.UserResponse;

import java.io.IOException;

public interface UserService {
    UserResponse createUser(UserRequest request) throws IOException;
    UserResponse getUserByEmail(String email);
}
