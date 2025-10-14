package com.example.Backend.Service.Authentication;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URL;
import java.security.interfaces.RSAPublicKey;
import java.text.ParseException;
import java.util.Map;

@Service

public class JwtTokenUtil {

    @Value("${clerk_jwks_url}")
    private String PUBLIC_KEY_URL;

    public boolean verifyToken(String token) throws ParseException, IOException, JOSEException {

        SignedJWT signedJWT=SignedJWT.parse(token);
        JWKSet jwkSet=JWKSet.load(new URL(PUBLIC_KEY_URL));
        JWK jwk=jwkSet.getKeyByKeyId(signedJWT.getHeader().getKeyID());

        if(jwk==null) return false;

        RSAKey rsaKey=(RSAKey) jwk;
        RSAPublicKey publicKey= rsaKey.toRSAPublicKey();
        JWSVerifier verifier=new RSASSAVerifier(publicKey);
        return signedJWT.verify(verifier);
    }

    public Map<String,Object> extractTokenClaims(String token) throws ParseException, IOException, JOSEException {
        SignedJWT signedJwt=SignedJWT.parse(token);
        if(!verifyToken(token)) throw new RuntimeException("Invalid Token");
        return signedJwt.getJWTClaimsSet().getClaims();
    }

}
