package com.example.Backend.Controller;

import com.example.Backend.Model.Request.EmailChangeRequest;
import com.example.Backend.Model.Request.UserRequest;
import com.example.Backend.Model.Response.UserResponse;
import com.example.Backend.Service.Authentication.JwtTokenUtil;
import com.example.Backend.Service.Interface.UserService;
import com.nimbusds.jose.JOSEException;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.text.ParseException;
import java.util.Map;

@RestController
@RequestMapping("/auth")

public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @PostMapping("/create")
    public ResponseEntity<?> verifyAndCreateUser(@RequestBody Map<String,Object>data) {

        String token=(String) data.get("token");
        System.out.println("token: "+(token!=null?token:"null"));
        try {
            Map<String,Object> claims=jwtTokenUtil.extractTokenClaims(token);
            String userId=(String) claims.get("sub");
            String email=(String) claims.get("email");
            UserResponse user=userService.getUserByUserId(userId);
            if(user!=null) {
                if(!user.getEmail().equals(email)) {
                    UserResponse updatedUser=userService.updateUserEmail(EmailChangeRequest
                            .builder()
                            .userId(userId)
                            .newEmail(email)
                            .build());
                    return ResponseEntity.ok().body(updatedUser);
                }
                return ResponseEntity.ok().body(user);
            }
            String imgUrl=(String) claims.get("image_url");
            String name=(String) claims.get("first_name");
            UserRequest request=UserRequest.builder()
                    .email(email)
                    .imgUrl(imgUrl)
                    .fname(name)
                    .userId(userId)
                    .build();
            UserResponse createdUser=userService.createUser(request);
            return ResponseEntity.ok().body(createdUser);
        } catch(Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message","Something went wrong. Try again!"));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestBody Map<String,Object> data) throws ParseException, IOException, JOSEException {
        String token=(String) data.get("token");
        if(token==null || !jwtTokenUtil.verifyToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok().body("Token is valid");
    }
}
