import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="bg-[#121212] size-full overflow-auto">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#ffaeaf] hover:text-[#ff9e9f] transition-colors mb-6"
          >
            <ArrowLeft className="size-5" />
            <span className="font-['Saira:Regular',sans-serif] text-[16px]">Back</span>
          </button>
          <h1 className="font-['Audiowide:Regular',sans-serif] text-[32px] md:text-[42px] text-white uppercase mb-2">
            Privacy Policy
          </h1>
          <p className="font-['Saira:Regular',sans-serif] text-[14px] text-[#9c9aa5]">
            Last Updated: December 10, 2024
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-white">
          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">1. Introduction</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              Welcome to Raven (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and handling your data in an open and transparent manner. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our nightlife recommendation application (the &quot;Service&quot;).
            </p>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">2. Information We Collect</h2>
            
            <h3 className="font-['Saira:Medium',sans-serif] text-[16px] text-white mb-3 mt-4">2.1 Information You Provide</h3>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0] mb-3">
              We collect information that you voluntarily provide when using our Service:
            </p>
            <ul className="list-disc list-inside space-y-2 font-['Saira:Regular',sans-serif] text-[14px] text-[#e0e0e0] ml-4">
              <li>Account information (email address, password)</li>
              <li>Profile preferences (music genres, nightlife preferences)</li>
              <li>Chat messages and queries submitted to our AI assistant</li>
              <li>Feedback and support communications</li>
            </ul>

            <h3 className="font-['Saira:Medium',sans-serif] text-[16px] text-white mb-3 mt-4">2.2 Automatically Collected Information</h3>
            <ul className="list-disc list-inside space-y-2 font-['Saira:Regular',sans-serif] text-[14px] text-[#e0e0e0] ml-4">
              <li>Device information (browser type, operating system, device identifiers)</li>
              <li>Usage data (features used, time spent, interaction patterns)</li>
              <li>Location data (if you grant permission)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">3. How We Use Your Information</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0] mb-3">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 font-['Saira:Regular',sans-serif] text-[14px] text-[#e0e0e0] ml-4">
              <li>To provide, operate, and maintain our Service</li>
              <li>To personalize your experience and provide tailored recommendations</li>
              <li>To improve, develop, and enhance our Service features</li>
              <li>To communicate with you, including customer support and updates</li>
              <li>To analyze usage patterns and optimize performance</li>
              <li>To detect, prevent, and address technical issues or fraudulent activity</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">4. Information Sharing and Disclosure</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0] mb-3">
              We do not sell your personal information. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 font-['Saira:Regular',sans-serif] text-[14px] text-[#e0e0e0] ml-4">
              <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf (hosting, analytics, customer support)</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental authority</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
              <li><strong>Protection of Rights:</strong> To protect our rights, privacy, safety, or property, and that of our users</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">5. Data Security</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              We implement appropriate technical and organizational security measures to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">6. Data Retention</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When you delete your account, we will delete or anonymize your personal information within a reasonable timeframe.
            </p>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">7. Your Rights and Choices</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0] mb-3">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc list-inside space-y-2 font-['Saira:Regular',sans-serif] text-[14px] text-[#e0e0e0] ml-4">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Objection:</strong> Object to processing of your personal information</li>
              <li><strong>Restriction:</strong> Request restriction of processing your data</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
            </ul>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0] mt-3">
              To exercise these rights, please contact us using the information provided in the Contact section below.
            </p>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">8. Third-Party Services</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              Our Service may contain links to third-party websites or integrate with third-party services (e.g., Google Sign-In). We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies before providing any information to them.
            </p>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">9. Children&apos;s Privacy</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              Our Service is intended for users aged 18 and older. We do not knowingly collect personal information from individuals under 18. If we become aware that we have collected personal information from someone under 18, we will take steps to delete that information promptly.
            </p>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">10. International Data Transfers</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using our Service, you consent to the transfer of your information to these countries.
            </p>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">11. Changes to This Privacy Policy</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date. You are advised to review this Privacy Policy periodically for any changes. Your continued use of the Service after changes constitutes acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">12. California Privacy Rights</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we collect, the right to delete personal information, and the right to opt-out of the sale of personal information. We do not sell personal information.
            </p>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">13. Contact Us</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              If you have any questions about this Privacy Policy or our data practices, please contact us through the contact form in the application or reach out to our support team.
            </p>
          </section>
        </div>

        {/* Footer spacing */}
        <div className="h-16"></div>
      </div>
    </div>
  );
}