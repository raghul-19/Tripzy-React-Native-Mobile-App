package com.example.Backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name ="user_data")

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String userId;
    private String fname;
    private String lname;
    private String email;
    private boolean status;
    private String pNumber;

    @Column(columnDefinition = "BYTEA")
    private byte[] imageBytes;

    private String imageType;
}
