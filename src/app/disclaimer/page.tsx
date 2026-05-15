import { AppShell } from '@/shared/components/app-shell';
import { PageHeader } from '@/shared/components/page-header';
import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Legal"
        title="Disclaimer"
        description="Important information regarding the use of medical data on this platform."
        badge="v1.0"
      />

      <div className="space-y-8">
        <Card className="p-6 md:p-8 border-destructive/20 bg-destructive/5">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-2 rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-destructive">Medical Information Disclaimer</h3>
              <p className="text-sm text-muted-foreground mt-1">Please read this carefully before acting on any information provided by Medicine Hub.</p>
            </div>
          </div>

          <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert">
            <p className="text-xs text-muted-foreground mb-6">Last Updated: May 16, 2026</p>
            
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">1. No Medical Advice</h3>
              <p className="text-muted-foreground leading-relaxed">
                The information provided on Medicine Hub, including but not limited to text, graphics, images, and other material, is for informational and educational purposes only. No material on this site is intended to be a substitute for professional medical advice, diagnosis, or treatment. 
              </p>
              <p className="text-muted-foreground leading-relaxed font-semibold">
                Always seek the advice of your physician or other qualified healthcare provider in Bangladesh with any questions you may have regarding a medical condition or treatment.
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h3 className="text-lg font-bold text-foreground">2. No Doctor-Patient Relationship</h3>
              <p className="text-muted-foreground leading-relaxed">
                Use of Medicine Hub does not create a doctor-patient relationship between you and any personnel associated with this platform. The information is provided &quot;as is&quot; and should not be relied upon as clinical decision support for specific individual cases without professional verification.
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h3 className="text-lg font-bold text-foreground">3. Accuracy of Information</h3>
              <p className="text-muted-foreground leading-relaxed">
                While we strive to keep the medical information up-to-date and correct based on the latest pharmaceutical data available in Bangladesh, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, or services contained on the website for any purpose.
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h3 className="text-lg font-bold text-foreground">4. Drug Interactions and Side Effects</h3>
              <p className="text-muted-foreground leading-relaxed">
                The drug interaction checker and generic suggestions are based on general clinical data. Individual responses to medication vary significantly. The absence of a warning for a given drug or drug combination should not be construed to indicate that the drug or drug combination is safe, appropriate, or effective for any given patient.
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h3 className="text-lg font-bold text-foreground">5. Limitation of Liability</h3>
              <p className="text-muted-foreground leading-relaxed">
                Under the laws of the People’s Republic of Bangladesh, Medicine Hub and its developers shall not be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h3 className="text-lg font-bold text-foreground">6. External Links</h3>
              <p className="text-muted-foreground leading-relaxed">
                Through this website, you may be able to link to other websites which are not under the control of Medicine Hub. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
              </p>
            </section>

            <section className="space-y-4 mt-8 border-t pt-8">
              <h3 className="text-lg font-bold text-foreground">7. Professional Consultation</h3>
              <p className="text-muted-foreground leading-relaxed italic">
                If you think you may have a medical emergency, call your doctor or the emergency services in Bangladesh (e.g., 999 or 16263) immediately.
              </p>
            </section>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
