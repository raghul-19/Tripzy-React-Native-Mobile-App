package com.example.Backend.Model.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder

public class UserResponse {

    private Long id;
    private String userId;
    private String fname;
    private String lname;
    private String email;
    private boolean status;
    private String pNumber;
    private String encodedImage;
    private String imageType;
}
