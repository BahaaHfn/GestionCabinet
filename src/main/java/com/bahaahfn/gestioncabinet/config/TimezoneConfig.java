package com.bahaahfn.gestioncabinet.config;

import jakarta.annotation.PostConstruct;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import java.util.TimeZone;

/**
 * Configuration globale de l'alignement des fuseaux horaires (Timezone Alignment).
 * 
 * Cette classe configure le backend pour utiliser le fuseau horaire UTC absolu,
 * éliminant ainsi les décalages horaires (GMT+1 pour Africa/Casablanca) lors des réservations.
 */
@Configuration
public class TimezoneConfig {

    @PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        System.out.println("Timezone de la JVM configurée avec succès sur UTC.");
    }

    /**
     * Configure l'instance principale d'ObjectMapper de Jackson pour utiliser le fuseau UTC
     * pour toute sérialisation et désérialisation de dates.
     *
     * @param objectMapper L'instance ObjectMapper gérée par Spring
     */
    @Autowired
    public void configureObjectMapper(ObjectMapper objectMapper) {
        objectMapper.setTimeZone(TimeZone.getTimeZone("UTC"));
    }
}
