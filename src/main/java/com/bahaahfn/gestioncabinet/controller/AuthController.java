package com.bahaahfn.gestioncabinet.controller;

import com.bahaahfn.gestioncabinet.Entity.Doctor;
import com.bahaahfn.gestioncabinet.Entity.Patient;
import com.bahaahfn.gestioncabinet.Entity.User;
import com.bahaahfn.gestioncabinet.Enum.AccountType;
import com.bahaahfn.gestioncabinet.Repository.DoctorRepository;
import com.bahaahfn.gestioncabinet.Repository.PatientRepository;
import com.bahaahfn.gestioncabinet.Service.UserService;
import com.bahaahfn.gestioncabinet.config.JwtTokenProvider;
import com.bahaahfn.gestioncabinet.dto.AuthResponse;
import com.bahaahfn.gestioncabinet.dto.LoginRequest;
import com.bahaahfn.gestioncabinet.dto.RegisterRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtTokenProvider tokenProvider;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public AuthController(AuthenticationManager authenticationManager,
                          UserService userService,
                          JwtTokenProvider tokenProvider,
                          DoctorRepository doctorRepository,
                          PatientRepository patientRepository) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.tokenProvider = tokenProvider;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));

        String token = tokenProvider.generateToken(user);
        
        Long targetId = null;
        if (user.getAccountType() == AccountType.DOCTOR) {
            Doctor doc = doctorRepository.findByUser_Email(user.getEmail()).orElse(null);
            if (doc != null) {
                targetId = doc.getIdDoctor();
            }
        } else if (user.getAccountType() == AccountType.PATIENT) {
            Patient pat = patientRepository.findByUser_Email(user.getEmail()).orElse(null);
            if (pat != null) {
                targetId = pat.getIdPatient();
            }
        }

        AuthResponse response = AuthResponse.builder()
                .token(token)
                .idUser(user.getIdUser())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getAccountType().name())
                .targetId(targetId)
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User registered = userService.register(request);
            return ResponseEntity.ok(registered);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Non authentifié");
        }
        User user = userService.findByEmail(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));
        
        return ResponseEntity.ok(user);
    }
}
