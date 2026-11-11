import { PageHero } from "@/components/marketing/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { APP_URL, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "The terms that govern your use of Schola — the multi-tenant school management platform.",
  path: "/legal/terms",
});

const LAST_UPDATED = "2026-05-17";

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${APP_URL}/` },
    { "@type": "ListItem", position: 2, name: "Legal", item: `${APP_URL}/legal/terms` },
    { "@type": "ListItem", position: 3, name: "Terms of Service", item: `${APP_URL}/legal/terms` },
  ],
};

export default function TermsPage() {
  return (
    <>
      <JsonLd json={breadcrumbLd} />
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        lede={`Last updated ${LAST_UPDATED}. These terms cover use of the Schola school platform.`}
      />
      <article className="mx-auto w-full max-w-3xl min-w-0 px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="prose-schola space-y-10">
          <section>
            <h2 className="text-foreground mb-3 text-2xl font-semibold tracking-tight">
              1. Acceptance of terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using Schola (the &quot;Service&quot;), you agree to be bound by these
              Terms of Service. If you do not agree, you may not use the Service. These terms apply
              to all visitors, registered users, and institutional administrators.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-2xl font-semibold tracking-tight">
              2. Description of service
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Schola is a multi-tenant school management platform that provides admissions,
              attendance, gradebook, fees, payroll, reporting, and related tooling to schools,
              colleges, institutes, and coaching centers (each, a &quot;Tenant&quot;).
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-2xl font-semibold tracking-tight">
              3. Accounts and eligibility
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You must register a school to use Schola. The individual completing registration must
              be authorized to bind the institution. Tenant administrators are responsible for all
              activity under their tenant, including the actions of teachers, staff, parents, and
              students they invite.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-2xl font-semibold tracking-tight">
              4. Tenant data and ownership
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You retain all ownership rights to data your Tenant uploads or generates in the
              Service (&quot;Tenant Data&quot;). You grant Schola a limited license to host,
              process, and display Tenant Data solely to operate the Service. You may export your
              Tenant Data at any time in standard formats (CSV, PDF).
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-2xl font-semibold tracking-tight">
              5. Acceptable use
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You will not (a) attempt to access another Tenant&apos;s data, (b) reverse-engineer
              the Service, (c) use the Service to send spam or unlawful content, or (d) interfere
              with the Service&apos;s operation. Schola reserves the right to suspend access for
              violations.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-2xl font-semibold tracking-tight">
              6. Fees and billing
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Pricing tiers and billing terms are described on our{" "}
              <a href="/pricing" className="text-foreground underline-offset-4 hover:underline">
                Pricing page
              </a>
              . During early access, the Service is offered at no charge. We will provide at least
              30 days&apos; notice before introducing a charge to any Tenant.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-2xl font-semibold tracking-tight">
              7. Termination
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You may terminate your Tenant at any time. Schola may terminate or suspend access for
              material breach of these terms or for non-payment. On termination, you may export
              Tenant Data for 30 days, after which we may delete it from production systems.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-2xl font-semibold tracking-tight">
              8. Warranties and disclaimers
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service is provided &quot;as is&quot;. To the maximum extent permitted by law,
              Schola disclaims all warranties, express or implied, including merchantability,
              fitness for a particular purpose, and non-infringement.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-2xl font-semibold tracking-tight">
              9. Limitation of liability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by law, Schola&apos;s aggregate liability arising out
              of or relating to the Service shall not exceed the amounts paid by you to Schola in
              the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-2xl font-semibold tracking-tight">
              10. Changes to these terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may revise these Terms from time to time. Material changes will be communicated to
              Tenant administrators by email at least 14 days before they take effect.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-2xl font-semibold tracking-tight">
              11. Contact
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Questions about these Terms? Reach us at{" "}
              <a
                href="mailto:hello@schola.reactbd.com"
                className="text-foreground underline-offset-4 hover:underline"
              >
                hello@schola.reactbd.com
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </>
  );
}
