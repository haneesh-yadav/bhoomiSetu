package com.bhoomisetu.backend.services;

import com.bhoomisetu.backend.dto.AuthResponse;
import com.bhoomisetu.backend.dto.LoginRequest;
import com.bhoomisetu.backend.dto.RegisterRequest;
import com.bhoomisetu.backend.dto.UpdatePasswordRequest;
import com.bhoomisetu.backend.models.Role;
import com.bhoomisetu.backend.models.Account;
import com.bhoomisetu.backend.models.CitizenDetails;
import com.bhoomisetu.backend.models.RegistrarDetails;
import com.bhoomisetu.backend.repositories.AccountRepository;
import com.bhoomisetu.backend.repositories.CitizenDetailsRepository;
import com.bhoomisetu.backend.repositories.RegistrarDetailsRepository;
import com.bhoomisetu.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AccountRepository accountRepository;
    private final CitizenDetailsRepository citizenDetailsRepository;
    private final RegistrarDetailsRepository registrarDetailsRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        
        Role role = Role.valueOf(request.getRole() != null ? request.getRole() : "USER");

        // 1. Create the base Account
        var account = Account.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // Hash the password!
                .role(role)
                .build();
                
        accountRepository.save(account);

        // 2. Create the Role-specific Profile
        if (role == Role.USER) {
            var citizen = CitizenDetails.builder()
                .account(account)
                .phone(request.getPhone())
                .aadhaar(request.getAadhaar())
                .dob(request.getDob())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .build();
            citizenDetailsRepository.save(citizen);
        } else if (role == Role.REGISTRAR) {
            var registrar = RegistrarDetails.builder()
                .account(account)
                .office("Default Office") // Can be extended to accept these from request
                .district("Default District")
                .department("Revenue")
                .employeeId("REG-" + (1000 + account.getId()))
                .build();
            registrarDetailsRepository.save(registrar);
        }
        
        // 3. Generate JWT Token
        var jwtToken = jwtService.generateToken(account);
        
        return buildAuthResponse(account, jwtToken, "Account registered successfully!");
    }

    public AuthResponse login(LoginRequest request) {
        // 1. Authenticate the account
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        // 2. Find the account
        var account = accountRepository.findByEmail(request.getEmail())
                .orElseThrow();
                
        // 3. Generate a new JWT token
        var jwtToken = jwtService.generateToken(account);
        
        return buildAuthResponse(account, jwtToken, "Login successful!");
    }

    public AuthResponse updatePassword(UpdatePasswordRequest request) {
        var account = accountRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), account.getPassword())) {
            throw new RuntimeException("Invalid current password");
        }

        account.setPassword(passwordEncoder.encode(request.getNewPassword()));
        accountRepository.save(account);

        return buildAuthResponse(account, jwtService.generateToken(account), "Password updated successfully!");
    }

    private AuthResponse buildAuthResponse(Account account, String jwtToken, String message) {
        var builder = AuthResponse.builder()
                .token(jwtToken)
                .message(message)
                .id("USR-" + account.getId())
                .name(account.getName())
                .email(account.getEmail())
                .role(account.getRole().name().toLowerCase());
                
        if (account.getRole() == Role.REGISTRAR) {
            registrarDetailsRepository.findByAccount(account).ifPresent(r -> {
                builder.office(r.getOffice())
                       .district(r.getDistrict())
                       .employeeId(r.getEmployeeId())
                       .since(account.getCreatedAt() != null ? String.valueOf(account.getCreatedAt().getYear()) : "2024");
            });
        }
        
        return builder.build();
    }
}
