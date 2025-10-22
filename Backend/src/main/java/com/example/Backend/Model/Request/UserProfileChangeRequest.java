package com.example.Backend.Model.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class UserProfileChangeRequest {
    private String fname;
    private String lname;
    private String pNumber;
}
