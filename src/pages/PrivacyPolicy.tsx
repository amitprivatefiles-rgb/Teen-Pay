import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={onBack} icon={ArrowLeft} className="mb-6">
          Back to Home
        </Button>

        <Card className="p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: December 29, 2025</p>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="leading-relaxed">
                Welcome to Engagement Experts. We respect your privacy and are committed to protecting your personal data.
                This privacy policy explains how we collect, use, and safeguard your information when you use our
                community engagement platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              <p className="leading-relaxed mb-3">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account registration information (name, email address, contact details)</li>
                <li>Profile information and preferences</li>
                <li>Communication data when you contact us</li>
                <li>Usage data and platform interaction information</li>
                <li>Device and browser information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="leading-relaxed mb-3">We use the collected information for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Providing and maintaining our platform services</li>
                <li>Managing your account and authentication</li>
                <li>Facilitating engagement activities between businesses and users</li>
                <li>Improving our platform features and user experience</li>
                <li>Communicating with you about platform updates and activities</li>
                <li>Ensuring platform security and preventing fraud</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
              <p className="leading-relaxed mb-3">
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>With businesses on the platform when you participate in their engagement activities</li>
                <li>With service providers who assist in operating our platform</li>
                <li>When required by law or to protect our legal rights</li>
                <li>In connection with a business transfer or acquisition</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
              <p className="leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal data against
                unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over
                the Internet or electronic storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
              <p className="leading-relaxed">
                We retain your personal information for as long as necessary to provide our services and comply with
                legal obligations. You may request deletion of your account and associated data at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
              <p className="leading-relaxed mb-3">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and receive a copy of your personal data</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Request deletion of your data</li>
                <li>Object to or restrict certain processing activities</li>
                <li>Withdraw consent at any time</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies and Tracking</h2>
              <p className="leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience, analyze platform usage,
                and improve our services. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
              <p className="leading-relaxed">
                Our platform is not intended for users under the age of 18. We do not knowingly collect personal
                information from children. If you believe we have collected information from a child, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to Privacy Policy</h2>
              <p className="leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any changes by posting
                the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
              <p className="leading-relaxed">
                If you have questions or concerns about this privacy policy or our data practices, please contact us at:
              </p>
              <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                <p className="font-medium text-gray-900">Engagement Experts Privacy Team</p>
                <p className="text-gray-700">Email: privacy@engagementexperts.in</p>
                <p className="text-gray-700">Support: support@engagementexperts.in</p>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
};
