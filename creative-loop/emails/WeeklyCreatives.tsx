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
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface WeeklyCreativesEmailProps {
  businessName: string;
  weekLabel: string; // e.g. "March 17, 2025"
  previewImages: string[]; // up to 3 image URLs
  dashboardUrl: string;
  postCount: number;
}

export function WeeklyCreativesEmail({
  businessName,
  weekLabel,
  previewImages = [],
  dashboardUrl,
  postCount = 7,
}: WeeklyCreativesEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        {businessName}&apos;s {postCount} creatives for the week of {weekLabel} are ready ✨
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>CreativeLoop</Text>
            <Text style={headerSub}>Your weekly content, ready to post</Text>
          </Section>

          {/* Greeting */}
          <Section style={section}>
            <Heading style={h1}>
              Your week&apos;s content is ready! 🎉
            </Heading>
            <Text style={paragraph}>
              Hey {businessName}! We&apos;ve generated {postCount} fresh marketing
              posts for the week of <strong>{weekLabel}</strong>. Each one is
              tailored to your brand — just download and post.
            </Text>
          </Section>

          {/* Preview images */}
          {previewImages.length > 0 && (
            <Section style={imageSection}>
              <Row>
                {previewImages.slice(0, 3).map((src, i) => (
                  <Column key={i} style={imageCol}>
                    <Img
                      src={src}
                      width="160"
                      height="160"
                      alt={`Post preview ${i + 1}`}
                      style={previewImg}
                    />
                  </Column>
                ))}
              </Row>
              <Text style={imageCaption}>
                Previews of this week&apos;s generated images
              </Text>
            </Section>
          )}

          {/* CTA */}
          <Section style={ctaSection}>
            <Button href={dashboardUrl} style={button}>
              View This Week&apos;s Creatives →
            </Button>
            <Text style={ctaNote}>
              Download images, captions, hashtags &amp; video scripts for all {postCount} days
            </Text>
          </Section>

          <Hr style={hr} />

          {/* What's included */}
          <Section style={section}>
            <Heading style={h2}>What&apos;s included this week</Heading>
            <Row style={featureRow}>
              <Column style={featureCol}>
                <Text style={featureIcon}>🖼️</Text>
                <Text style={featureLabel}>7 AI Images</Text>
                <Text style={featureDesc}>Brand-colored visuals for each day</Text>
              </Column>
              <Column style={featureCol}>
                <Text style={featureIcon}>✍️</Text>
                <Text style={featureLabel}>7 Captions</Text>
                <Text style={featureDesc}>Platform-optimized with hashtags</Text>
              </Column>
              <Column style={featureCol}>
                <Text style={featureIcon}>🎬</Text>
                <Text style={featureLabel}>7 Scripts</Text>
                <Text style={featureDesc}>30-60s Reels/TikTok scripts</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* Feedback nudge */}
          <Section style={section}>
            <Text style={paragraph}>
              Last week&apos;s creatives not quite right? Rate them in the
              dashboard and we&apos;ll use your feedback to make this week&apos;s
              even better. 🎯
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this because you&apos;re subscribed to
              CreativeLoop. © 2026 CreativeLoop.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const main = { backgroundColor: "#f3f4f6", fontFamily: "Arial, sans-serif" };
const container = { maxWidth: "600px", margin: "0 auto", backgroundColor: "#ffffff", borderRadius: "12px", overflow: "hidden" };
const header = { background: "linear-gradient(135deg, #4f46e5, #7c3aed)", padding: "32px 40px" };
const logo = { color: "#ffffff", fontSize: "28px", fontWeight: "700", margin: "0 0 4px" };
const headerSub = { color: "#c7d2fe", fontSize: "14px", margin: "0" };
const section = { padding: "32px 40px" };
const h1 = { color: "#111827", fontSize: "24px", fontWeight: "700", margin: "0 0 16px" };
const h2 = { color: "#312e81", fontSize: "18px", fontWeight: "700", margin: "0 0 20px" };
const paragraph = { color: "#374151", fontSize: "16px", lineHeight: "1.6", margin: "0 0 16px" };
const imageSection = { padding: "0 40px 24px", textAlign: "center" as const };
const imageCol = { padding: "0 8px", textAlign: "center" as const };
const previewImg = { borderRadius: "8px", border: "2px solid #e0e7ff" };
const imageCaption = { color: "#9ca3af", fontSize: "12px", marginTop: "12px" };
const ctaSection = { padding: "0 40px 32px", textAlign: "center" as const };
const button = { backgroundColor: "#4f46e5", color: "#ffffff", padding: "14px 32px", borderRadius: "8px", fontWeight: "700", fontSize: "16px", textDecoration: "none", display: "inline-block" };
const ctaNote = { color: "#6b7280", fontSize: "13px", marginTop: "12px" };
const hr = { borderColor: "#e5e7eb", margin: "0" };
const featureRow = { margin: "0" };
const featureCol = { textAlign: "center" as const, padding: "0 12px" };
const featureIcon = { fontSize: "28px", margin: "0 0 8px" };
const featureLabel = { color: "#111827", fontWeight: "700", fontSize: "15px", margin: "0 0 4px" };
const featureDesc = { color: "#6b7280", fontSize: "13px", margin: "0" };
const footer = { backgroundColor: "#f9fafb", padding: "24px 40px" };
const footerText = { color: "#9ca3af", fontSize: "12px", margin: "0", textAlign: "center" as const };
