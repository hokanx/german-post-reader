import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { FREE_LETTER_LIMIT, SUBSCRIPTION_PRICE_EUR } from "@/lib/constants";
import { formatEur } from "@/lib/format-currency";

export function WelcomeEmail() {
  return (
    <Html>
      <Head />
      <Preview>{`Your first ${FREE_LETTER_LIMIT} letters are free — no card required`}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Heading style={styles.heading}>German Post, translated.</Heading>
          </Section>
          <Section style={styles.section}>
            <Text style={styles.text}>
              Welcome. Your account is ready — you have {FREE_LETTER_LIMIT} free
              letter analyses to start with, no card required.
            </Text>
            <Text style={styles.text}>
              Upload a photo or PDF of any German letter and we&apos;ll give
              you a plain-language summary, flag any deadlines, and draft a
              reply in German — with a translation so you know exactly what
              it says, in English, Arabic, or Turkish.
            </Text>
            <Text style={styles.text}>
              If a letter mentions an amount or date we&apos;re not fully
              sure about, we&apos;ll say so plainly rather than guess.
            </Text>
            <Text style={styles.text}>
              After your free letters, unlocking unlimited letters is{" "}
              {formatEur(SUBSCRIPTION_PRICE_EUR)} per year.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#fff7ed",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "32px",
    maxWidth: "480px",
    border: "2px solid #1a0a2e",
    borderRadius: "22px",
  },
  header: {
    marginBottom: "16px",
  },
  heading: {
    color: "#1a0a2e",
    fontSize: "24px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    margin: 0,
  },
  section: {
    marginTop: "8px",
  },
  text: {
    color: "#1a0a2e",
    fontSize: "16px",
    lineHeight: "24px",
  },
};

export default WelcomeEmail;
