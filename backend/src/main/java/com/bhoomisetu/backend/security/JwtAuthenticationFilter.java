package com.bhoomisetu.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        
        // 1. Get the Authorization header from the request
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 2. Check if the header is missing or doesn't start with "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return; // Exit out of the filter
        }

        // 3. Extract the token (Remove "Bearer ")
        jwt = authHeader.substring(7);
        
        // 4. Extract the user email from the token
        userEmail = jwtService.extractUsername(jwt);

        // 5. If user email is present and they are not already authenticated
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            // Load user from database
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // Check if token is valid
            if (jwtService.isTokenValid(jwt, userDetails)) {
                
                // Create the authentication token
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                
                // Set the details
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                
                // Update the security context
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        // Continue down the filter chain
        filterChain.doFilter(request, response);
    }
}
