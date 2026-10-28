package stirling.software.common.util;

import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Institutional email-domain allowlist (CerradoPDF). Configured via {@code
 * security.allowedEmailDomains} / env {@code SECURITY_ALLOWEDEMAILDOMAINS}; an empty list disables
 * the check entirely so upstream behaviour is unchanged.
 */
public final class EmailDomainAllowlist {

    public static final String DENIED_ERROR_CODE = "email_domain_not_allowed";

    private EmailDomainAllowlist() {}

    /**
     * Gate for SSO identities (OAuth2/OIDC, SAML2). Because the provider asserted the address, a
     * configured allowlist rejects anything that is not an email in an allowed domain — including
     * non-email usernames, which carry no verifiable domain.
     */
    public static boolean isSsoAllowed(String identifier, List<String> allowedDomains) {
        if (isDisabled(allowedDomains)) {
            return true;
        }
        String domain = extractDomain(identifier);
        return domain != null && normalize(allowedDomains).contains(domain);
    }

    /**
     * Gate for locally created accounts. Plain usernames (no '@', e.g. "admin") stay valid so
     * operator accounts are unaffected; anything email-shaped must match the allowlist.
     */
    public static boolean isLocalAccountAllowed(String identifier, List<String> allowedDomains) {
        if (isDisabled(allowedDomains)) {
            return true;
        }
        if (identifier == null || !identifier.contains("@")) {
            return true;
        }
        String domain = extractDomain(identifier);
        return domain != null && normalize(allowedDomains).contains(domain);
    }

    public static boolean isDisabled(List<String> allowedDomains) {
        return allowedDomains == null
                || allowedDomains.stream().allMatch(d -> d == null || d.isBlank());
    }

    private static String extractDomain(String identifier) {
        if (identifier == null) {
            return null;
        }
        int at = identifier.lastIndexOf('@');
        if (at <= 0 || at == identifier.length() - 1) {
            return null;
        }
        return identifier.substring(at + 1).trim().toLowerCase(Locale.ROOT);
    }

    private static Set<String> normalize(List<String> allowedDomains) {
        return allowedDomains.stream()
                .filter(d -> d != null && !d.isBlank())
                .map(d -> d.trim().toLowerCase(Locale.ROOT))
                .map(d -> d.startsWith("@") ? d.substring(1) : d)
                .collect(Collectors.toSet());
    }
}
