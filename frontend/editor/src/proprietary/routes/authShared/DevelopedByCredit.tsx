import { useTranslation } from "react-i18next";
import unicerradoLogo from "@app/assets/brand/modern-logo/unicerrado-logo.png";
import gtiLogo from "@app/assets/brand/modern-logo/gti-logo.png";

/**
 * Institutional credit shown under the auth card: "Desenvolvido por" with the
 * UniCerrado and GTI logos. The white pill keeps the dark-blue logo text
 * readable on the dark login background.
 */
export function DevelopedByCredit() {
  const { t } = useTranslation();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.75rem 0 0.5rem",
      }}
    >
      <span
        style={{
          fontSize: "0.7rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--c-text-secondary)",
          fontWeight: 600,
        }}
      >
        {t("login.developedBy", "Desenvolvido por")}
      </span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.25rem",
          backgroundColor: "rgba(255, 255, 255, 0.96)",
          padding: "0.75rem 1.75rem",
          borderRadius: "0.875rem",
        }}
      >
        <img
          src={unicerradoLogo}
          alt="UniCerrado"
          style={{ height: "3.75rem", width: "auto", objectFit: "contain" }}
        />
        <img
          src={gtiLogo}
          alt="Gestão da Tecnologia da Informação"
          style={{ height: "3.5rem", width: "auto", objectFit: "contain" }}
        />
      </div>
    </div>
  );
}

export default DevelopedByCredit;
