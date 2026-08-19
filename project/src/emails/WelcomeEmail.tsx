import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { DEMO_MODE, FREE_LETTER_LIMIT, SUBSCRIPTION_PRICE_EUR } from "@/lib/constants";
import { formatEur } from "@/lib/format-currency";
import type { AppLanguage } from "@/lib/letters/types";
import { WELCOME_EMAIL_COPY } from "./copy";
import { LOGO_URL, styles } from "./theme";

export function WelcomeEmail({ language = "en" }: { language?: AppLanguage }) {
  const copy = WELCOME_EMAIL_COPY[language];
  const align = copy.dir === "rtl" ? "right" : "left";

  return (
    <Html lang={language} dir={copy.dir}>
      <Head />
      <Preview>{copy.preview(FREE_LETTER_LIMIT)}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <table role="presentation" cellPadding={0} cellSpacing={0}>
              <tr>
                <td>
                  <Img src={LOGO_URL} width={32} height={32} alt="Papkram" style={styles.logoImg} />
                </td>
                <td style={styles.wordmark}>Papkram</td>
              </tr>
            </table>
          </Section>

          <Section style={{ ...styles.body_section, textAlign: align }}>
            <span style={styles.pill}>{DEMO_MODE ? copy.pillDemo : copy.pill}</span>
            <Heading style={{ ...styles.heading, textAlign: align }}>
              {DEMO_MODE ? copy.headingDemo : copy.heading}
            </Heading>
            <Text style={{ ...styles.text, textAlign: align }}>
              {copy.intro(FREE_LETTER_LIMIT)}
            </Text>

            {copy.features.map((feature) => (
              <div key={feature.label} style={{ ...styles.featureCard, textAlign: align }}>
                <Text style={{ ...styles.featureLabel, textAlign: align }}>{feature.label}</Text>
                <Text style={{ ...styles.featureText, textAlign: align }}>{feature.text}</Text>
              </div>
            ))}

            <Text style={{ ...styles.muted, textAlign: align }}>{copy.riskNote}</Text>
            <Text style={{ ...styles.muted, textAlign: align }}>
              {DEMO_MODE ? copy.demoNote : copy.priceNote(formatEur(SUBSCRIPTION_PRICE_EUR))}
            </Text>

            <Button href="https://papkram.de/upload" style={styles.button}>
              {copy.cta}
            </Button>
          </Section>

          <Hr style={{ borderColor: "#fef3c7", margin: 0 }} />
          <Section style={styles.footer}>
            <Text style={{ ...styles.footerText, textAlign: align }}>{copy.footer}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default WelcomeEmail;
