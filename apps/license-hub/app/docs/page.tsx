import { mainSiteHref, SiteChrome, panelStyle, primaryButtonStyle, secondaryButtonStyle } from "../siteChrome";

const repoDocsHref = "https://github.com/veeduzyl-hue/mindforge-guard";
const workflowDocs = [
  {
    title: "Single-agent workflow guide",
    body: "Move from a sample agent action to a governance report that surfaces authority boundary, execution evidence, missing evidence, and risk/drift signals.",
    href: `${repoDocsHref}/blob/main/docs/product/current/v7_0_first_report.md`,
  },
  {
    title: "Single-agent positioning brief",
    body: "Read the commercial boundary freeze for the deterministic governance evidence layer story.",
    href: `${repoDocsHref}/blob/main/docs/commercial/v7_0_1_single_agent_governance_positioning.md`,
  },
  {
    title: "Download to first report UX",
    body: "Review the path from public entry point to local evidence review without turning version numbers or HR into the hero.",
    href: `${repoDocsHref}/blob/main/docs/commercial/v7_0_download_to_first_report_ux.md`,
  },
  {
    title: "What Guard does not do",
    body: "See the recommendation-only, non-executing, non-control-plane boundary in buyer-readable language.",
    href: `${repoDocsHref}/blob/main/docs/commercial/v7_0_license_hub_copy_candidate.md`,
  },
] as const;

const trustDocs = [
  {
    title: "First 10 Minutes With Guard",
    body: "Start with the current first-run path before you choose a paid license.",
    href: `${repoDocsHref}/blob/main/docs/first-10-minutes.md`,
  },
  {
    title: "Safety Boundary",
    body: "Understand what Guard does and does not do before it enters higher-risk delivery paths.",
    href: `${repoDocsHref}/blob/main/docs/trust/safety-boundary.md`,
  },
  {
    title: "Choose the Right Guard Edition",
    body: "Review the buyer-readable edition value map before upgrading.",
    href: `${repoDocsHref}/blob/main/docs/product/current/edition-value-map.md`,
  },
  {
    title: "Current Product Demos",
    body: "Run the current demos before upgrading or choosing a team rollout path.",
    href: `${repoDocsHref}/blob/main/docs/demos/current/README.md`,
  },
  {
    title: "Trust FAQ",
    body: "Use the current FAQ for trust, positioning, and commercial boundary questions.",
    href: `${repoDocsHref}/blob/main/docs/product/current/trust-faq.md`,
  },
] as const;

const trustDocsPrimary = trustDocs.slice(0, 3);
const trustDocsSecondary = trustDocs.slice(3);

export default function DocsPage() {
  const cardButtonStyle = {
    ...secondaryButtonStyle,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center" as const,
    minHeight: 44,
    padding: "0 18px",
    lineHeight: 1.2,
    fontWeight: 700,
  };

  return (
    <SiteChrome
      eyebrow="Docs"
      title="MindForge Guard docs"
      lede="Use these docs to understand the deterministic governance evidence layer, the first single-agent workflow, and the commercial boundaries that keep Guard recommendation-only and human-review-oriented."
      showHeaderNote={false}
    >
      <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
        <h2 style={{ margin: 0 }}>Documentation paths</h2>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <article style={{ display: "grid", gap: 8, padding: 16, border: "1px solid #d8ccae", borderRadius: 12 }}>
            <strong>Product site</strong>
            <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>
              Use mindforge.run for the primary commercial story: Make AI-assisted work reviewable before it becomes trusted.
            </p>
            <a href={mainSiteHref} style={secondaryButtonStyle}>
              mindforge.run
            </a>
          </article>
          <article style={{ display: "grid", gap: 8, padding: 16, border: "1px solid #d8ccae", borderRadius: 12 }}>
            <strong>Repository docs</strong>
            <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>
              Use the public repository for workflow guides, install notes, commercial boundaries, and verification materials.
            </p>
            <a href={repoDocsHref} style={primaryButtonStyle}>
              Repo docs
            </a>
          </article>
          <article style={{ display: "grid", gap: 8, padding: 16, border: "1px solid #d8ccae", borderRadius: 12 }}>
            <strong>License Hub</strong>
            <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>
              Use License Hub after purchase to view licenses, delivery visibility, and account surfaces without changing Guard runtime posture.
            </p>
          </article>
        </div>
      </section>

      <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <h2 style={{ margin: 0 }}>Single-agent governance report docs</h2>
          <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>
            An Evidence Pack is the review bundle behind an AI-assisted action: task context, allowed scope, action trace, tool/data references, outputs, missing evidence, and reviewer notes.
          </p>
          <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>
            These docs explain how Guard turns that evidence bundle into a governance report so reviewers can inspect authority boundary, execution evidence, missing evidence, and risk/drift signals.
          </p>
        </div>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {workflowDocs.map((doc) => (
            <article key={doc.title} style={{ display: "grid", gap: 8, padding: 16, border: "1px solid #d8ccae", borderRadius: 12 }}>
              <strong>{doc.title}</strong>
              <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>{doc.body}</p>
              <a href={doc.href} style={{ ...cardButtonStyle, marginTop: "auto" }}>
                Open doc
              </a>
            </article>
          ))}
        </div>
      </section>

      <section style={{ ...panelStyle, display: "grid", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Secondary technical install</h2>
        <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>
          The recommended install target is v7.0.1 via <code>@veeduzyl/mindforge-guard@7.0.1</code>. Use <code>npm install -g @veeduzyl/mindforge-guard@7.0.1</code> in install/docs surfaces rather than the public hero story.
        </p>
        <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>
          Historical GitHub Release references belong in release-history or technical docs, not as public commercial headline subjects.
        </p>
      </section>

      <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <h2 style={{ margin: 0 }}>Trust and workflow pack</h2>
          <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>
            This is the canonical trust and workflow entry for License Hub visitors evaluating Guard before they choose a license.
          </p>
        </div>
        <div className="licenseHubTrustPack">
          <div className="licenseHubTrustPackCore">
            {trustDocsPrimary.map((doc) => (
              <article
                key={doc.title}
                className="licenseHubTrustCard licenseHubTrustCardTall"
                style={{
                  padding: 16,
                  border: "1px solid #d8ccae",
                  borderRadius: 12,
                  background: "#fffdf8",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <strong>{doc.title}</strong>
                <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>{doc.body}</p>
                <a href={doc.href} style={{ ...cardButtonStyle, marginTop: "auto" }}>
                  Open guide
                </a>
              </article>
            ))}
          </div>
          <div className="licenseHubTrustPackSupporting">
            {trustDocsSecondary.map((doc) => (
              <article
                key={doc.title}
                className="licenseHubTrustCard licenseHubTrustCardShort"
                style={{
                  padding: 16,
                  border: "1px solid #d8ccae",
                  borderRadius: 12,
                  background: "#fffdf8",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <strong>{doc.title}</strong>
                <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>{doc.body}</p>
                <a href={doc.href} style={{ ...cardButtonStyle, marginTop: "auto" }}>
                  Open guide
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .licenseHubTrustPack {
              display: grid;
              gap: 12px;
              max-width: 980px;
            }

            .licenseHubTrustPackCore {
              display: grid;
              gap: 12px;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              align-items: stretch;
            }

            .licenseHubTrustPackSupporting {
              display: grid;
              gap: 12px;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              align-items: stretch;
              max-width: 760px;
            }

            .licenseHubTrustCard {
              align-self: stretch;
            }

            .licenseHubTrustCardTall {
              min-height: 196px;
            }

            .licenseHubTrustCardShort {
              min-height: 184px;
            }

            @media (max-width: 960px) {
              .licenseHubTrustPackCore {
                grid-template-columns: repeat(2, minmax(0, 1fr));
              }

              .licenseHubTrustPackSupporting {
                grid-template-columns: repeat(2, minmax(0, 1fr));
                max-width: none;
              }
            }

            @media (max-width: 640px) {
              .licenseHubTrustPackCore,
              .licenseHubTrustPackSupporting {
                grid-template-columns: minmax(0, 1fr);
              }
            }
          `,
        }}
      />
    </SiteChrome>
  );
}
