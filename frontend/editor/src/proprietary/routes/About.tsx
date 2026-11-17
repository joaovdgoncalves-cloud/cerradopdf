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

const DEVELOPERS = [
  "Carla Rodrigues Guimarães",
  "João Vitor Dias Gonçalves",
  "Kauan Martins Correia",
  "Mateus Oliveira Julio",
  "Richard Marques Pereira",
  "Thiago Henrique Martins Alves",
  "Wellyngton Raell Martins Vieira",
];

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
    <div className="about-page">
      <style>{`
        .about-page {
          height: 100vh;
          height: 100dvh;
          background-color: var(--c-surface-alt);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 1.25rem;
          overflow-y: auto;
        }
        .about-card {
          width: 100%;
          max-width: 42rem;
          /* margin auto centers the card when there is room and still lets
             the top scroll into view when the content overflows */
          margin: auto 0;
          flex-shrink: 0;
          background-color: var(--c-surface);
          border: 1px solid var(--c-border-subtle);
          border-radius: 1rem;
          padding: 2.5rem;
        }
        .about-logos {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 1.25rem;
          background-color: rgba(255, 255, 255, 0.96);
          padding: 0.75rem 1.75rem;
          border-radius: 0.875rem;
        }
        .about-devs {
          list-style: none;
          margin: 0.75rem 0 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
          align-items: center;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--c-text);
        }
        @media (max-width: 640px) {
          .about-page {
            padding: 1rem 0.75rem;
          }
          .about-card {
            margin: 0;
            padding: 1.5rem 1.25rem;
          }
          .about-logos {
            flex-direction: column;
            gap: 0.75rem;
            padding: 0.75rem 1rem;
          }
        }
      `}</style>

      <div className="about-card">
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <img
            src={loginHeader}
            alt="CerradoPDF"
            style={{ height: "3.5rem", width: "auto", maxWidth: "100%" }}
          />
          <h1
            style={{
              color: "var(--c-text)",
              fontSize: "clamp(1.25rem, 4vw, 1.5rem)",
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
                "O CerradoPDF é o sistema institucional de manipulação de documentos PDF da UniCerrado, o Centro Universitário de Goiatuba. Ele reúne num só lugar as ferramentas que o dia a dia acadêmico pede: mesclar, dividir, comprimir, converter, assinar, proteger e extrair texto de documentos. Tudo direto no navegador, sem precisar instalar nada.",
              )}
            </p>
          </section>

          <section>
            <h2 style={sectionTitle}>{t("about.whoMade", "Quem desenvolveu")}</h2>
            <p style={sectionBody}>
              {t(
                "about.whoMadeBody",
                "O sistema foi desenvolvido por alunos do curso de Gestão da Tecnologia da Informação da UniCerrado, pensando nas necessidades reais da nossa comunidade acadêmica.",
              )}
            </p>
            <ul className="about-devs">
              {DEVELOPERS.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 style={sectionTitle}>{t("about.whoFor", "Para quem")}</h2>
            <p style={sectionBody}>
              {t(
                "about.whoForBody",
                "Para toda a comunidade UniCerrado: estudantes, professores, servidores e setores administrativos. O acesso é feito com a conta institucional, sem cadastro adicional. Basta entrar com o e-mail @alunos.unicerrado.edu.br ou @unicerrado.edu.br e usar.",
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
          <div className="about-logos">
            <img
              src={unicerradoLogo}
              alt="UniCerrado"
              style={{
                height: "3rem",
                width: "auto",
                maxWidth: "70%",
                objectFit: "contain",
              }}
            />
            <img
              src={gtiLogo}
              alt="Gestão da Tecnologia da Informação"
              style={{
                height: "2.75rem",
                width: "auto",
                maxWidth: "40%",
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem",
          }}
        >
          <Button variant="primary" onClick={() => navigate("/")}>
            <Icon
              name="arrow-left"
              size="1em"
              style={{ marginRight: "0.5rem" }}
            />
            {t("about.back", "Voltar para o CerradoPDF")}
          </Button>
        </div>
      </div>
    </div>
  );
}
