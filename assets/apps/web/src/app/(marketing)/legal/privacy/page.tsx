import { PageHero } from "@/components/marketing/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { APP_URL, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Schola collects, processes, and protects personal information across the platform.",
  path: "/legal/privacy",
});

const LAST_UPDATED = "2026-05-17";

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${APP_URL}/` },
    { "@type": "ListItem", position: 2, name: "Legal", item: `${APP_URL}/legal/privacy` },
    { "@type": "ListItem", position: 3, name: "Privacy Policy", item: `${APP_URL}/legal/privacy` },
  ],
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd json={breadcrumbLd} />
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        lede={`Last updated ${LAST_UPDATED}. How Schola handles personal information for a school and the people in it.`}
      />
      <article className="mx-auto w-full max-w-3xl min-w-0 px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="space-y-10">
          <section>
            <h2 className="text-foreground mb-3 text-2xl font-semibold tracking-tight">
              1. Overview
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Schola is a multi-tenant school management platform. This Privacy Policy describes how
              we collect, use, and protect personal information when you use the Service. We act as
              a processor on behalf of each Tenant for student, parent, and staff data, and as a
              controller for our own account holders.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-2xl font-semibold tracking-tight">
              2. Information we collect
            </h2>
            <ul className="text-muted-foreground list-disc space-y-2 pl-6 leading-relaxed">
              <li>
                <strong className="text-foreground">Account information.</strong> Name, email, role,
                and authentication credentials of administrators, teachers, parents, and students.
              </li>
              <li>
                <strong className="text-foreground">Tenant data.</strong> Student records,
                attendance, grades, fees, and related school operations data provided by your
                institution.
              </li>
              <li>
                <strong className="text-foreground">Usage data.</strong> IP address, browser type,
                pages visited, and timestamps — used for security and product analytics.
              </li>
              <li>
                <strong className="text-foreground">Audit logs.</strong> A record of privileged
                actions taken inside your Tenant, as required by §10 of our product requirements.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-2xl font-semibold tracking-tight">
              3. How we protect data
            </h2>
            <ul className="text-muted-foreground list-disc space-y-2 pl-6 leading-relaxed">
              <li>
                <strong className="text-foreground">Tenant isolation.</strong> Every query in Schola
                filters by tenant identifier. Direct database access outside the isolation layer is
                forbidden.
              </li>
              <li>
                <strong className="text-foreground">Encryption in transit.</strong> All traffic is
                encrypted via TLS 1.2+.
              </li>
              <li>
                <strong className="text-foreground">PII encryption at rest.</strong> Sensitive
                fields — phone, date of birth, address — are encrypted using envelope encryption.
              </li>
              <li>
                <strong className="text-foreground">Password hashing.</strong> Argon2id with
                tenant-appropriate parameters.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-2xl font-semibold tracking-tight">
              4. How we use information
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We use personal information to provide the Service, send transactional notifications,
              prevent abuse, and improve product reliability. We do not sell personal information.
              We do not use Tenant Data to train third-party AI models.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-2xl font-semibold tracking-tight">
              5. Sub-processors
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We use a small set of sub-processors to operate the Service — hosting (MongoDB Atlas),
              email delivery (Resend), and media storage (ImageKit). Each is contractually obligated
              to maintain confidentiality and security at least as protective as ours.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-2xl font-semibold tracking-tight">
              6. Data retention
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain Tenant Data for the duration of your relationship with Schola plus 30 days
              after termination, during which you may export data. Audit log entries are retained
              for at least 12 months for compliance and security review.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-2xl font-semibold tracking-tight">
              7. Your rights
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Depending on your jurisdiction, you may have rights to access, correct, delete, or
              port your personal information. For Tenant Data, contact your school administrator
              first — they control how data is managed inside their Tenant.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-2xl font-semibold tracking-tight">
              8. Children&apos;s privacy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Schola is used in K-12 contexts where students under 13 may have accounts created by
              their school. We process this data only on the instructions of the school, under their
              authority as the educational institution.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-2xl font-semibold tracking-tight">
              9. International transfers
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Data may be processed in regions where our sub-processors operate. Enterprise tenants
              can request data residency options at signup.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-2xl font-semibold tracking-tight">
              10. Changes
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We will notify Tenant administrators by email of material changes to this Policy at
              least 14 days before they take effect.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-2xl font-semibold tracking-tight">
              11. Contact
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              For privacy questions or to exercise your rights, email{" "}
              <a
                href="mailto:privacy@schola.reactbd.com"
                className="text-foreground underline-offset-4 hover:underline"
              >
                privacy@schola.reactbd.com
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </>
  );
}
