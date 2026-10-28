package stirling.software.common.util;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class EmailDomainAllowlistTest {

    private static final List<String> UNICERRADO =
            List.of("alunos.unicerrado.edu.br", "unicerrado.edu.br");

    @Test
    @DisplayName("empty allowlist disables the check")
    void emptyAllowlistAllowsEverything() {
        assertTrue(EmailDomainAllowlist.isSsoAllowed("user@gmail.com", List.of()));
        assertTrue(EmailDomainAllowlist.isSsoAllowed("anything", null));
        assertTrue(EmailDomainAllowlist.isSsoAllowed("x@gmail.com", List.of("  ")));
    }

    @Test
    @DisplayName("SSO: institutional email is accepted")
    void ssoAllowsInstitutionalEmail() {
        assertTrue(
                EmailDomainAllowlist.isSsoAllowed(
                        "joao.v.d.goncalves@alunos.unicerrado.edu.br", UNICERRADO));
        assertTrue(EmailDomainAllowlist.isSsoAllowed("prof@unicerrado.edu.br", UNICERRADO));
    }

    @Test
    @DisplayName("SSO: external providers are rejected")
    void ssoRejectsExternalDomains() {
        assertFalse(EmailDomainAllowlist.isSsoAllowed("user@gmail.com", UNICERRADO));
        assertFalse(EmailDomainAllowlist.isSsoAllowed("user@hotmail.com", UNICERRADO));
        assertFalse(EmailDomainAllowlist.isSsoAllowed("user@outlook.com", UNICERRADO));
    }

    @Test
    @DisplayName("SSO: non-email identifiers are rejected when allowlist is set")
    void ssoRejectsNonEmailIdentifiers() {
        assertFalse(EmailDomainAllowlist.isSsoAllowed("github-login", UNICERRADO));
        assertFalse(EmailDomainAllowlist.isSsoAllowed(null, UNICERRADO));
        assertFalse(EmailDomainAllowlist.isSsoAllowed("no-at-sign@", UNICERRADO));
    }

    @Test
    @DisplayName("SSO: matching is case-insensitive and tolerates '@' prefix in config")
    void ssoNormalizesDomains() {
        assertTrue(
                EmailDomainAllowlist.isSsoAllowed(
                        "User@ALUNOS.UniCerrado.EDU.br", List.of("@alunos.unicerrado.edu.br")));
    }

    @Test
    @DisplayName("SSO: lookalike domains do not match")
    void ssoRejectsLookalikeDomains() {
        assertFalse(
                EmailDomainAllowlist.isSsoAllowed(
                        "x@alunos.unicerrado.edu.br.evil.com", UNICERRADO));
        assertFalse(EmailDomainAllowlist.isSsoAllowed("x@falso-unicerrado.edu.br", UNICERRADO));
    }

    @Test
    @DisplayName("local accounts: plain usernames stay valid, email usernames are gated")
    void localAccountRules() {
        assertTrue(EmailDomainAllowlist.isLocalAccountAllowed("admin", UNICERRADO));
        assertTrue(
                EmailDomainAllowlist.isLocalAccountAllowed(
                        "joao@alunos.unicerrado.edu.br", UNICERRADO));
        assertFalse(EmailDomainAllowlist.isLocalAccountAllowed("joao@gmail.com", UNICERRADO));
    }
}
