package io.elitewallet.api.security;

public record AuthenticatedUser(String id, String email, String role) {
}
