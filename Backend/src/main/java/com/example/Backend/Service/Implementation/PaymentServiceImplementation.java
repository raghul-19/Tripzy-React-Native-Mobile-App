package com.example.Backend.Service.Implementation;

import com.example.Backend.Service.Interface.PaymentService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service

public class PaymentServiceImplementation implements PaymentService {

    @Value("${stripe_secret_key}")
    private String stripeApiKey;

    @PostConstruct  
    public void intit() {
        Stripe.apiKey=stripeApiKey;
    }

    @Override
    public String createPaymentIntent(Long amount, String currency) throws StripeException {
        Map<String,Object> paymentData=new HashMap<>();
        paymentData.put("amount",amount*100);
        paymentData.put("currency",currency);
        paymentData.put("automatic_payment_methods", Map.of("enabled", true));
        PaymentIntent paymentIntent=PaymentIntent.create(paymentData);
        return paymentIntent.getClientSecret();
    }
}
