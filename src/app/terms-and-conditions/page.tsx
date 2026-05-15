import { AppShell } from '@/shared/components/app-shell';
import { PageHeader } from '@/shared/components/page-header';
import { Card } from '@/components/ui/card';

export default function TermsAndConditionsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Legal"
        title="Terms and Conditions"
        description="Please read these terms carefully before using our medical information services."
        badge="v1.0"
      />

      <div className="space-y-8">
        <Card className="p-6 md:p-8">
          <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert">
            <p className="text-xs text-muted-foreground mb-6">Last Updated: May 16, 2026</p>
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">1. Acceptance of Terms</h3>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using Medicine Hub, you agree to be bound by these Terms and Conditions and all applicable laws and regulations in Bangladesh. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section className="space-y-4 mt-8 text-destructive border-l-4 border-destructive pl-4 bg-destructive/5 py-2">
              <h3 className="text-lg font-bold">2. Medical Disclaimer</h3>
              <p className="font-semibold leading-relaxed">
                The content on Medicine Hub is for informational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this platform.
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h3 className="text-lg font-bold text-foreground">3. Use License</h3>
              <p className="text-muted-foreground leading-relaxed">
                Permission is granted to temporarily access the materials (information or software) on Medicine Hub for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license, you may not:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>Modify or copy the materials.</li>
                <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial).</li>
                <li>Attempt to decompile or reverse engineer any software contained on the platform.</li>
                <li>Remove any copyright or other proprietary notations from the materials.</li>
              </ul>
            </section>

            <section className="space-y-4 mt-8">
              <h3 className="text-lg font-bold text-foreground">4. User Responsibilities</h3>
              <p className="text-muted-foreground leading-relaxed">
                Users are responsible for ensuring the security of their account credentials. Any activity conducted through your account will be deemed your responsibility. You agree not to use the platform for any unlawful purpose as defined by the Information and Communication Technology (ICT) Act 2006 and the Digital Security Act 2018.
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h3 className="text-lg font-bold text-foreground">5. Limitations</h3>
              <p className="text-muted-foreground leading-relaxed">
                In no event shall Medicine Hub or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Medicine Hub, even if Medicine Hub has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h3 className="text-lg font-bold text-foreground">6. Accuracy of Materials</h3>
              <p className="text-muted-foreground leading-relaxed">
                The materials appearing on Medicine Hub could include technical, typographical, or photographic errors. Medicine Hub does not warrant that any of the materials on its website are accurate, complete, or current. Medicine Hub may make changes to the materials contained on its website at any time without notice.
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h3 className="text-lg font-bold text-foreground">7. Governing Law</h3>
              <p className="text-muted-foreground leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws of the People’s Republic of Bangladesh. You irrevocably submit to the exclusive jurisdiction of the courts in Dhaka, Bangladesh.
              </p>
            </section>

            <section className="space-y-4 mt-8 border-t pt-8">
              <h3 className="text-lg font-bold text-foreground">8. Modifications</h3>
              <p className="text-muted-foreground leading-relaxed">
                Medicine Hub may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
