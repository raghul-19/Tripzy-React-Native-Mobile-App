package com.example.Backend.Service.Authentication;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@Service

public class CustomJwtAuthenticationToken extends AbstractAuthenticationToken {

    private String principal;
    private Map<String,Object>claims;

    public CustomJwtAuthenticationToken(Map<String,Object>claims) {
        super(List.of(new SimpleGrantedAuthority("ROLE_USER")));
        this.claims=claims;
        this.principal=(String) claims.get("email");
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    public Map<String,Object> getClaims() {
        return this.claims;
    }

    @Override
    public Object getPrincipal() {
        return this.principal;
    }
}
