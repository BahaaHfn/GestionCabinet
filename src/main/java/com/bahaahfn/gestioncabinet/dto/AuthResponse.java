package com.bahaahfn.gestioncabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private Long idUser;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private Long targetId; // patient ID or doctor ID, if applicable
}
