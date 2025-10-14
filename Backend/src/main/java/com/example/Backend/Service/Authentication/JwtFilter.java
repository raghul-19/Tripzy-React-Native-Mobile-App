package com.example.Backend.Service.Authentication;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;

@Service

public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String header=request.getHeader("Authorization");
        String token=null;
        if(header!=null && header.startsWith("Bearer ")) {
            token=header.substring(7);
        }

        if(token!=null && SecurityContextHolder.getContext().getAuthentication()==null) {
            try {
                Map<String,Object>claims=jwtTokenUtil.extractTokenClaims(token);
                CustomJwtAuthenticationToken authenticationToken=new CustomJwtAuthenticationToken(claims);
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            } catch(Exception e) {
                System.out.println(e.getMessage());
            }
        }

        filterChain.doFilter(request,response);
    }
}
