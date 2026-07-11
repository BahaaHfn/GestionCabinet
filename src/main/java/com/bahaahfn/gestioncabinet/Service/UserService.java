package com.bahaahfn.gestioncabinet.Service;

import com.bahaahfn.gestioncabinet.Entity.User;
import com.bahaahfn.gestioncabinet.dto.RegisterRequest;

import java.util.Optional;

public interface UserService {
    User register(RegisterRequest request);
    Optional<User> findByEmail(String email);
    Optional<User> findByCin(String cin);
}
