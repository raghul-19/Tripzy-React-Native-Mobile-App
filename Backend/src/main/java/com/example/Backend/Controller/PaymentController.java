package com.example.Backend.Controller;

import com.example.Backend.Model.Request.PaymentRequest;
import com.example.Backend.Service.Interface.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/stripe")

public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/getClientSecret")
    public ResponseEntity<?> getPaymentClientSecret(@RequestBody PaymentRequest paymentRequest) {
        try {
            String clientSecret=paymentService.createPaymentIntent(paymentRequest.getAmount(),paymentRequest.getCurrency());
            return ResponseEntity.ok().body(Map.of("secretKey",clientSecret));
        } catch(Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message","Internal server error, Try again!"));
        }
    }
}
