import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Icon } from "@app/ui/Icon";
import { Button } from "@app/ui/Button";
import { useDocumentMeta } from "@app/hooks/useDocumentMeta";
import loginHeader from "@app/assets/brand/modern-logo/CerradoPDFLogo.png";
import unicerradoLogo from "@app/assets/brand/modern-logo/unicerrado-logo.png";
import gtiLogo from "@app/assets/brand/modern-logo/gti-logo.png";

const sectionTitle: CSSProperties = {
  color: "var(--c-primary)",
  fontSize: "0.8rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  marginBottom: "0.4rem",
};

const sectionBody: CSSProperties = {
  color: "var(--c-text)",
  fontSize: "0.95rem",
  lineHeight: 1.65,
  margin: 0,
};

/**
 * Institutional "Sobre" page for CerradoPDF: who built it, for whom, and what
 * it does. Standalone route (/sobre) linked from the quick nav rail.
 */
export default function About() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useDocumentMeta({
    title: `${t("about.title", "Sobre")} - CerradoPDF`,
    description: t(
      "app.description",
      "Sistema institucional de manipulação de documentos PDF da UniCerrado.",
    ),
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--c-surface-alt)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.25rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "40rem",
          backgroundColor: "var(--c-surface)",
          border: "1px solid var(--c-border-subtle)",
          borderRadius: "1rem",
          padding: "2.5rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <img
            src={loginHeader}
            alt="CerradoPDF"
            style={{ height: "3.5rem", width: "auto" }}
          />
          <h1
            style={{
              color: "var(--c-text)",
              fontSize: "1.5rem",
              fontWeight: 700,
              margin: "1rem 0 0.25rem",
            }}
          >
            {t("about.heading", "Sobre o CerradoPDF")}
          </h1>
          <p style={{ ...sectionBody, color: "var(--c-text-secondary)" }}>
            {t(
              "about.tagline",
              "O conversor de PDF da comunidade acadêmica UniCerrado",
            )}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <section>
            <h2 style={sectionTitle}>{t("about.whatIs", "O que é")}</h2>
            <p style={sectionBody}>
              {t(
                "about.whatIsBody",
                "O CerradoPDF é a plataforma institucional de manipulação de documentos PDF da UniCerrado — Centro Universitário de Goiatuba. Reúne em um só lugar ferramentas para mesclar, dividir, comprimir, converter, assinar, proteger e extrair texto de documentos, direto do navegador e sem instalar nada.",
              )}
            </p>
          </section>

          <section>
            <h2 style={sectionTitle}>{t("about.whoMade", "Quem desenvolveu")}</h2>
            <p style={sectionBody}>
              {t(
                "about.whoMadeBody",
                "O sistema foi desenvolvido por alunos da UniCerrado, com apoio da Gestão da Tecnologia da Informação (GTI), como um projeto pensado para a realidade da nossa comunidade acadêmica: alunos que precisam enviar trabalhos, professores que organizam materiais, coordenações e setores administrativos que lidam com documentos todos os dias.",
              )}
            </p>
          </section>

          <section>
            <h2 style={sectionTitle}>{t("about.whoFor", "Para quem")}</h2>
            <p style={sectionBody}>
              {t(
                "about.whoForBody",
                "Para toda a comunidade UniCerrado — estudantes, professores, servidores e setores administrativos. O acesso é feito com a conta institucional, sem cadastro adicional: é só entrar com o e-mail @alunos.unicerrado.edu.br ou @unicerrado.edu.br e usar.",
              )}
            </p>
          </section>

          <section>
            <h2 style={sectionTitle}>{t("about.privacy", "Seus documentos")}</h2>
            <p style={sectionBody}>
              {t(
                "about.privacyBody",
                "Seus arquivos não saem do servidor da instituição e não ficam armazenados: são processados e excluídos automaticamente após o uso. Nenhum conteúdo de documento é registrado em logs.",
              )}
            </p>
          </section>

          <section>
            <h2 style={sectionTitle}>{t("about.credits", "Créditos")}</h2>
            <p style={sectionBody}>
              {t(
                "about.creditsBody",
                "O CerradoPDF é baseado no projeto open-source Stirling-PDF (Stirling-Tools), distribuído sob licença MIT. Todos os créditos, licenças e avisos do projeto original são preservados.",
              )}
            </p>
          </section>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem",
          }}
        >
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
              style={{ height: "3rem", width: "auto", objectFit: "contain" }}
            />
            <img
              src={gtiLogo}
              alt="Gestão da Tecnologia da Informação"
              style={{ height: "2.75rem", width: "auto", objectFit: "contain" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
          <Button variant="primary" onClick={() => navigate("/")}>
            <Icon name="arrow-left" size="1em" style={{ marginRight: "0.5rem" }} />
            {t("about.back", "Voltar para o CerradoPDF")}
          </Button>
        </div>
      </div>
    </div>
  );
}
