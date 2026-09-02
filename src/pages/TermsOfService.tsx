import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={onBack} icon={ArrowLeft} className="mb-6">
          Back to Home
        </Button>

        <Card className="p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: December 29, 2025</p>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">
                By accessing and using Engagement Experts, you accept and agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Platform Description</h2>
              <p className="leading-relaxed">
                Engagement Experts is a community engagement platform that connects businesses with community members for
                authentic brand interactions. The platform facilitates engagement activities, feedback collection,
                and community participation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  <strong>3.1 Registration:</strong> You must create an account to access certain platform features.
                  You agree to provide accurate and complete information during registration.
                </p>
                <p className="leading-relaxed">
                  <strong>3.2 Account Security:</strong> You are responsible for maintaining the confidentiality
                  of your account credentials and for all activities under your account.
                </p>
                <p className="leading-relaxed">
                  <strong>3.3 Eligibility:</strong> You must be at least 18 years old to use this platform.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Conduct</h2>
              <p className="leading-relaxed mb-3">Users agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide authentic and genuine engagement with brands</li>
                <li>Not engage in fraudulent, deceptive, or manipulative activities</li>
                <li>Not create multiple accounts or use automated systems</li>
                <li>Respect intellectual property rights</li>
                <li>Not violate any applicable laws or regulations</li>
                <li>Not harass, abuse, or harm other users or businesses</li>
                <li>Maintain professional and respectful communication</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Business Accounts</h2>
              <p className="leading-relaxed mb-3">Businesses using the platform agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate information about their company</li>
                <li>Create legitimate engagement opportunities</li>
                <li>Comply with all applicable advertising and consumer protection laws</li>
                <li>Not request inappropriate or illegal activities from users</li>
                <li>Honor commitments made to community members</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Platform Features</h2>
              <p className="leading-relaxed">
                Certain platform features are available only to registered users. We reserve the right to modify,
                suspend, or discontinue any platform features at any time without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Content and Intellectual Property</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  <strong>7.1 Platform Content:</strong> All content, features, and functionality on EngageHub
                  are owned by us and protected by intellectual property laws.
                </p>
                <p className="leading-relaxed">
                  <strong>7.2 User Content:</strong> You retain ownership of content you submit but grant us
                  a license to use, display, and distribute it in connection with operating the platform.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Prohibited Activities</h2>
              <p className="leading-relaxed mb-3">The following activities are strictly prohibited:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Posting false, misleading, or fake reviews</li>
                <li>Using the platform for spam or unsolicited marketing</li>
                <li>Attempting to manipulate or game the platform</li>
                <li>Accessing the platform through unauthorized means</li>
                <li>Reverse engineering or attempting to extract source code</li>
                <li>Interfering with platform security features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Privacy and Data Protection</h2>
              <p className="leading-relaxed">
                Your use of the platform is subject to our Privacy Policy. By using EngageHub, you consent to
                our collection and use of information as described in the Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Termination</h2>
              <p className="leading-relaxed">
                We reserve the right to suspend or terminate your account at any time for violation of these
                terms or for any other reason at our discretion. You may also terminate your account at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Disclaimers</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  <strong>11.1 As-Is Basis:</strong> The platform is provided "as is" without warranties of any kind,
                  either express or implied.
                </p>
                <p className="leading-relaxed">
                  <strong>11.2 No Guarantee:</strong> We do not guarantee specific outcomes from platform participation
                  or any particular level of engagement.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Limitation of Liability</h2>
              <p className="leading-relaxed">
                To the maximum extent permitted by law, EngageHub shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages arising from your use of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Dispute Resolution</h2>
              <p className="leading-relaxed">
                Any disputes arising from these terms or your use of the platform shall be resolved through binding
                arbitration in accordance with applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Changes to Terms</h2>
              <p className="leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of significant changes.
                Continued use of the platform after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Governing Law</h2>
              <p className="leading-relaxed">
                These terms shall be governed by and construed in accordance with applicable laws, without regard
                to conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Contact Information</h2>
              <p className="leading-relaxed mb-4">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-medium text-gray-900">Engagement Experts Legal Team</p>
                <p className="text-gray-700">Email: legal@engagementexperts.in</p>
                <p className="text-gray-700">Support: support@engagementexperts.in</p>
              </div>
            </section>

            <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Important Notice:</strong> By using Engagement Experts, you acknowledge that you have read,
                understood, and agree to be bound by these Terms of Service and our Privacy Policy.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
