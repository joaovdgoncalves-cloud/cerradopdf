import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon, type IconName } from "@app/ui/Icon";
import { Button } from "@app/ui/Button";
import loginHeader from "@app/assets/brand/modern-logo/CerradoPDFLogo.png";

const STORAGE_KEY = "cerradopdf.privacyNotice.v1";

/**
 * One-time privacy notice shown the first time the app opens in this browser.
 * Blocks all interaction until the user acknowledges; the acceptance is kept
 * in localStorage, so it follows the browser (a different browser asks again).
 */
export function PrivacyConsentGate() {
  const { t } = useTranslation();
  const [accepted, setAccepted] = useState(
    () => window.localStorage.getItem(STORAGE_KEY) === "1",
  );

  if (accepted) return null;

  const accept = () => {
    window.localStorage.setItem(STORAGE_KEY, "1");
    setAccepted(true);
  };

  const points: { icon: IconName; text: string }[] = [
    {
      icon: "trash",
      text: t(
        "consent.point1",
        "Seus arquivos são processados no servidor e apagados automaticamente logo depois. Eles não ficam guardados na UniCerrado.",
      ),
    },
    {
      icon: "folder",
      text: t(
        "consent.point2",
        "Sua biblioteca e suas preferências ficam salvas somente neste navegador. Se usar outro navegador ou outro computador, vai encontrar um ambiente novo.",
      ),
    },
    {
      icon: "shield",
      text: t(
        "consent.point3",
        "No servidor fica apenas a sua conta de acesso. O conteúdo dos seus documentos não é registrado nem armazenado.",
      ),
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(3px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "30rem",
          backgroundColor: "var(--c-surface)",
          border: "1px solid var(--c-border-subtle)",
          borderRadius: "1rem",
          padding: "2rem",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <img
            src={loginHeader}
            alt="CerradoPDF"
            style={{ height: "2.75rem", width: "auto" }}
          />
          <h2
            style={{
              color: "var(--c-text)",
              fontSize: "1.2rem",
              fontWeight: 700,
              margin: "0.9rem 0 0.2rem",
            }}
          >
            {t("consent.title", "Antes de começar")}
          </h2>
          <p
            style={{
              color: "var(--c-text-secondary)",
              fontSize: "0.9rem",
              margin: 0,
            }}
          >
            {t("consent.subtitle", "Só um aviso rápido sobre seus arquivos")}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.875rem",
            marginBottom: "1.5rem",
          }}
        >
          {points.map((p) => (
            <div
              key={p.icon}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
              }}
            >
              <span
                style={{
                  color: "var(--c-primary)",
                  flexShrink: 0,
                  marginTop: "0.1rem",
                }}
              >
                <Icon name={p.icon} size="1.1rem" />
              </span>
              <p
                style={{
                  color: "var(--c-text)",
                  fontSize: "0.875rem",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {p.text}
              </p>
            </div>
          ))}
        </div>

        <Button
          variant="primary"
          onClick={accept}
          style={{ width: "100%", padding: "0.75rem" }}
        >
          {t("consent.accept", "Entendi, quero continuar")}
        </Button>
      </div>
    </div>
  );
}

export default PrivacyConsentGate;
