package com.example.Backend.Service.Interface;

import com.stripe.exception.StripeException;

public interface PaymentService {

    String createPaymentIntent(Long amount, String currency) throws StripeException;
}
