package com.example.Backend.Model.Request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class UserProfileChangeRequest {
    private String fname;
    private String lname;
    @JsonProperty("pNumber")
    private String pNumber;
    private String userId;
    private String imageType;
    private String encodedImage;
}
