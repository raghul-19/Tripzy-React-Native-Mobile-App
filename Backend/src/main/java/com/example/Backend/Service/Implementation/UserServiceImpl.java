package com.example.Backend.Service.Implementation;

import com.example.Backend.Entity.User;
import com.example.Backend.Model.Request.EmailChangeRequest;
import com.example.Backend.Model.Request.UserProfileChangeRequest;
import com.example.Backend.Model.Request.UserRequest;
import com.example.Backend.Model.Response.UserResponse;
import com.example.Backend.Repository.UserRepository;
import com.example.Backend.Service.Interface.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.Base64;
import java.util.UUID;

@Service

public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    private byte[] generateImageBytesFromUrl(String imgUrl) throws IOException {
        InputStream in= new URL(imgUrl).openStream();
        return in.readAllBytes();
    }

    private String generateImageTypeFromUrl(String imgUrl) throws IOException {
        InputStream in=new URL(imgUrl).openStream();
        String mimeType= URLConnection.guessContentTypeFromStream(in);
        return mimeType!=null?mimeType:"image/png";
    }

    private User generateUser(UserRequest request) throws IOException {
        byte[] imgBytes=null;
        String imageType=null;
        if(request.getImgUrl()!=null) {
            imgBytes=generateImageBytesFromUrl(request.getImgUrl());
            imageType=generateImageTypeFromUrl(request.getImgUrl());
        }
        return User.builder()
                .userId(request.getUserId())
                .fname(request.getFname())
                .email(request.getEmail())
                .imageBytes(imgBytes)
                .status(true)
                .imageType(imageType)
                .build();
    }

    private UserResponse generateUserResponse(User user) {
        String encodedImage=user.getImageBytes()!=null? Base64.getEncoder().encodeToString(user.getImageBytes()):null;
        return UserResponse.builder()
                .id(user.getId())
                .userId(user.getUserId())
                .fname(user.getFname())
                .lname(user.getLname())
                .email(user.getEmail())
                .pNumber(user.getPNumber())
                .encodedImage(encodedImage)
                .imageType(user.getImageType())
                .status(user.isStatus())
                .build();
    }

    @Override
    public UserResponse createUser(UserRequest request) throws IOException {
        return generateUserResponse(userRepository.save(generateUser(request)));
    }

    @Override
    public UserResponse getUserByUserId(String userId) {
        User user=userRepository.findByUserId(userId);
        return user==null?null:generateUserResponse(user);
    }

    @Override
    public UserResponse updateUserProfile(UserProfileChangeRequest request) {
        User user=userRepository.findByUserId(request.getUserId());
        if(user!=null) {
            if(request.getEncodedImage()!=null) {
                byte[] imgBytes=Base64.getDecoder().decode(request.getEncodedImage());
                user.setImageBytes(imgBytes);
                user.setImageType(request.getImageType());
            }
            user.setFname(request.getFname());
            user.setLname(request.getLname());
            user.setPNumber(request.getPNumber());
            return generateUserResponse(userRepository.save(user));
        }
        return null;
    }

    @Override
    public UserResponse updateUserEmail(EmailChangeRequest request) {
        User user=userRepository.findByUserId(request.getUserId());
        if(user!=null) {
            user.setEmail(request.getNewEmail());
            return generateUserResponse(userRepository.save(user));
        }
        return null;
    }

}
