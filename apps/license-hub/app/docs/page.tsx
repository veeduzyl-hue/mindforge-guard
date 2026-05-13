import { mainSiteHref, SiteChrome, panelStyle, primaryButtonStyle, secondaryButtonStyle } from "../siteChrome";

const repoDocsHref = "https://github.com/veeduzyl-hue/mindforge-guard";
const v7FirstReportDocs = [
  {
    title: "First Governance Report workflow",
    body: "Install v7.0.1, use the HR self-service Evidence Pack, run pack validate, then run report single-agent.",
    href: `${repoDocsHref}/blob/main/docs/product/current/v7_0_first_report.md`,
  },
  {
    title: "Download to first report UX",
    body: "Review the path from License Hub or mindforge.run to a first local governance report.",
    href: `${repoDocsHref}/blob/main/docs/commercial/v7_0_download_to_first_report_ux.md`,
  },
  {
    title: "Report Experience by Edition",
    body: "Community, Pro, Pro+, and Enterprise report reading boundaries without extra runtime authority.",
    href: `${repoDocsHref}/blob/main/docs/product/current/v7_0_first_report.md#report-experience-by-edition`,
  },
  {
    title: "What Guard does not do",
    body: "Recommendation-only, non-executing, non-control-plane, and human-review-oriented boundaries.",
    href: `${repoDocsHref}/blob/main/docs/commercial/v7_0_license_hub_copy_candidate.md#suggested-module-what-guard-does-not-do`,
  },
] as const;

const trustDemoPackDocs = [
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

const trustDemoCoreDocs = trustDemoPackDocs.slice(0, 3);
const trustDemoSupportingDocs = trustDemoPackDocs.slice(3);

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
      lede="Product docs explain MindForge Guard. License Hub docs explain purchase, signed license delivery, and account access."
      showHeaderNote={false}
    >
      <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
        <h2 style={{ margin: 0 }}>Documentation paths</h2>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <article style={{ display: "grid", gap: 8, padding: 16, border: "1px solid #d8ccae", borderRadius: 12 }}>
            <strong>Launch status</strong>
            <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>
              License Hub is live. For current product and documentation context, use the repository docs and the main site.
            </p>
          </article>
          <article style={{ display: "grid", gap: 8, padding: 16, border: "1px solid #d8ccae", borderRadius: 12 }}>
            <strong>Product site</strong>
            <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>
              Use mindforge.run for the main Guard story, positioning, and buyer-facing product explanation.
            </p>
            <a href={mainSiteHref} style={secondaryButtonStyle}>
              mindforge.run
            </a>
          </article>
          <article style={{ display: "grid", gap: 8, padding: 16, border: "1px solid #d8ccae", borderRadius: 12 }}>
            <strong>Repository docs</strong>
            <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>
              Use the public repository for edition boundaries, license install guidance, and verification materials.
            </p>
            <a href={repoDocsHref} style={primaryButtonStyle}>
              Repo docs
            </a>
          </article>
          <article style={{ display: "grid", gap: 8, padding: 16, border: "1px solid #d8ccae", borderRadius: 12 }}>
            <strong>FAQ and License Hub</strong>
            <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>
              Use FAQ for buyer questions, then use License Hub after purchase to view licenses and download signed JSON.
            </p>
          </article>
        </div>
      </section>

      <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <h2 style={{ margin: 0 }}>v7.0.1 First Governance Report</h2>
          <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>
            Start from the published package <code>@veeduzyl/mindforge-guard@7.0.1</code>, validate an Evidence Pack,
            and read the report as a human-review-oriented artifact.
          </p>
          <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>
            v7.0.1 is the recommended install target because it restores the packaged CLI entrypoint. Historical
            context: v7.0.0 First Governance Report materials and GitHub Release v7.0.0 remain available for release history.
          </p>
        </div>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {v7FirstReportDocs.map((doc) => (
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

      <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <h2 style={{ margin: 0 }}>Trust and demo pack</h2>
          <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>
            This is the canonical trust and demo entry for License Hub visitors evaluating Guard before they choose a license.
          </p>
        </div>
        <div className="licenseHubTrustPack">
          <div className="licenseHubTrustPackCore">
            {trustDemoCoreDocs.map((doc) => (
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
            {trustDemoSupportingDocs.map((doc) => (
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
