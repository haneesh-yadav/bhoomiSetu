package com.bhoomisetu.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Data // Lombok: auto-generates getters/setters/toString
@Builder // Allows us to use User.builder().name("..").build()
@NoArgsConstructor
@AllArgsConstructor
@Entity // Tells Hibernate to make a table out of this class
@Table(name = "accounts") // Names the table 'users' instead of 'user' (which is a reserved keyword in some SQL)
public class Account implements UserDetails {

    @Id // Primary Key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment ID
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true) // Emails must be unique
    private String email;

    @Column(nullable = false)
    private String password;
    
    // Optional Citizen Profile details
    
    private String address;
    private String state;

    @Enumerated(EnumType.STRING) // Saves "USER" or "REGISTRAR" as a string in DB
    private Role role;

    @CreationTimestamp // Automatically sets the time when created
    private LocalDateTime createdAt;

    // A User can own multiple properties
    // mappedBy refers to the "owner" variable inside the Property class
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Property> properties;

    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private RegistrarDetails registrarDetails;

    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private CitizenDetails citizenDetails;

    // --- UserDetails Methods ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // This tells Spring Security what role the user has (e.g., ROLE_USER)
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return email; // We use email as the username for login
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
