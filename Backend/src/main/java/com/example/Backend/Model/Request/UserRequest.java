package com.example.Backend.Model.Request;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder

public class UserRequest {

    private String fname;
    private String email;
    private String imgUrl;
    private String userId;
}
