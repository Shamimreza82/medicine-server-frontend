import { AppShell } from '@/shared/components/app-shell';
import { PageHeader } from '@/shared/components/page-header';
import { Card } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description="Our commitment to protecting your privacy and personal data in accordance with the laws of Bangladesh."
        badge="v1.0"
      />

      <div className="space-y-8">
        <Card className="p-6 md:p-8">
          <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert">
            <p className="text-xs text-muted-foreground mb-6">Last Updated: May 16, 2026</p>
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">1. Introduction</h3>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to Medicine Hub. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and share your personal information when you visit or make use of our services, in accordance with the laws of the People’s Republic of Bangladesh.
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h3 className="text-lg font-bold text-foreground">2. Information We Collect</h3>
              <p className="text-muted-foreground leading-relaxed">
                We may collect several types of information from and about users of our platform, including:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li><strong>Personal Information:</strong> Name, email address, and contact details provided during registration or support inquiries.</li>
                <li><strong>Usage Data:</strong> Search queries for medicines or lab tests, pages viewed, and interaction duration.</li>
                <li><strong>Device Information:</strong> IP address, browser type, device type, and operating system.</li>
              </ul>
            </section>

            <section className="space-y-4 mt-8">
              <h3 className="text-lg font-bold text-foreground">3. How We Use Your Information</h3>
              <p className="text-muted-foreground leading-relaxed">
                The information we collect is used to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>Provide, maintain, and improve our medical information services.</li>
                <li>Analyze usage patterns to enhance user experience and search accuracy.</li>
                <li>Communicate with you regarding updates, security alerts, and support.</li>
                <li>Comply with legal obligations and regulatory requirements in Bangladesh.</li>
              </ul>
            </section>

            <section className="space-y-4 mt-8">
              <h3 className="text-lg font-bold text-foreground">4. Data Security</h3>
              <p className="text-muted-foreground leading-relaxed">
                We implement robust security measures designed to protect your personal information from unauthorized access, use, or disclosure. We adhere to the guidelines set forth by the Digital Security Act 2018 and the Cyber Security Act 2023 of Bangladesh. However, please note that no method of transmission over the internet is completely secure.
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h3 className="text-lg font-bold text-foreground">5. Your Rights</h3>
              <p className="text-muted-foreground leading-relaxed">
                Under existing data protection frameworks in Bangladesh, you have the right to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>Access and receive a copy of your personal data held by us.</li>
                <li>Request rectification of any inaccurate or incomplete information.</li>
                <li>Request erasure of your data, subject to legal retention requirements.</li>
              </ul>
            </section>

            <section className="space-y-4 mt-8">
              <h3 className="text-lg font-bold text-foreground">6. Compliance with Bangladesh Law</h3>
              <p className="text-muted-foreground leading-relaxed">
                Medicine Hub operates in full compliance with the laws of the People’s Republic of Bangladesh, including but not limited to the Information and Communication Technology (ICT) Act 2006 and the Digital Security Act 2018. We may disclose your information if required to do so by law or in response to valid requests by public authorities.
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h3 className="text-lg font-bold text-foreground">7. Cookies</h3>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section className="space-y-4 mt-8 border-t pt-8">
              <h3 className="text-lg font-bold text-foreground">8. Contact Us</h3>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions or concerns about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-2 text-muted-foreground">
                <p>Email: legal@medicinehub.com.bd</p>
                <p>Dhaka, Bangladesh</p>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
