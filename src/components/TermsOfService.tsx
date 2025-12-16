import { ArrowLeft } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
}

export function TermsOfService({ onBack }: TermsOfServiceProps) {
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
            Terms of Service
          </h1>
          <p className="font-['Saira:Regular',sans-serif] text-[14px] text-[#9c9aa5]">
            Last Updated: December 10, 2024
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-white">
          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">1. Acceptance of Terms</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              By accessing or using Raven (the &quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, do not use the Service. We reserve the right to modify these Terms at any time, and your continued use of the Service constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">2. Description of Service</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              Raven is an AI-powered nightlife recommendation application that provides personalized suggestions for bars, clubs, events, and entertainment venues. The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis and is currently in beta testing.
            </p>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">3. Eligibility</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              You must be at least 18 years old to use this Service. By using the Service, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these Terms. The Service may recommend age-restricted venues and activities; compliance with local laws and age restrictions is your sole responsibility.
            </p>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">4. User Accounts</h2>
            
            <h3 className="font-['Saira:Medium',sans-serif] text-[16px] text-white mb-3 mt-4">4.1 Account Creation</h3>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0] mb-3">
              To access certain features, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 font-['Saira:Regular',sans-serif] text-[14px] text-[#e0e0e0] ml-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access or security breach</li>
            </ul>

            <h3 className="font-['Saira:Medium',sans-serif] text-[16px] text-white mb-3 mt-4">4.2 Account Termination</h3>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              We reserve the right to suspend or terminate your account at any time, with or without notice, for violations of these Terms or any other reason we deem appropriate. You may delete your account at any time through the account settings.
            </p>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">5. User Conduct</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0] mb-3">
              You agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 font-['Saira:Regular',sans-serif] text-[14px] text-[#e0e0e0] ml-4">
              <li>Use the Service for any illegal purpose or in violation of any laws</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Interfere with or disrupt the Service or servers/networks connected to the Service</li>
              <li>Attempt to gain unauthorized access to any portion of the Service</li>
              <li>Use automated systems (bots, scrapers) to access the Service</li>
              <li>Transmit viruses, malware, or any other harmful code</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Collect or store personal data about other users without consent</li>
              <li>Use the Service to distribute spam or unsolicited communications</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">6. Content and Recommendations</h2>
            
            <h3 className="font-['Saira:Medium',sans-serif] text-[16px] text-white mb-3 mt-4">6.1 AI-Generated Content</h3>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              Recommendations and information provided by Raven are generated by artificial intelligence and should be used for informational purposes only. We do not guarantee the accuracy, completeness, or reliability of any recommendations. You are solely responsible for evaluating and verifying information before making decisions based on it.
            </p>

            <h3 className="font-['Saira:Medium',sans-serif] text-[16px] text-white mb-3 mt-4">6.2 Third-Party Venues</h3>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              Raven provides recommendations for third-party venues and events. We are not affiliated with, endorsed by, or responsible for these third parties. Your interactions with recommended venues are solely between you and those establishments.
            </p>

            <h3 className="font-['Saira:Medium',sans-serif] text-[16px] text-white mb-3 mt-4">6.3 User-Generated Content</h3>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              If you submit feedback, suggestions, or other content to us, you grant us a worldwide, perpetual, irrevocable, royalty-free license to use, modify, reproduce, and distribute such content for any purpose.
            </p>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">7. Intellectual Property</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              The Service, including all content, features, functionality, software, logos, and trademarks, is owned by Raven and is protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our Service without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">8. Disclaimer of Warranties</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0] mb-3">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside space-y-2 font-['Saira:Regular',sans-serif] text-[14px] text-[#e0e0e0] ml-4">
              <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
              <li>Warranties that the Service will be uninterrupted, secure, or error-free</li>
              <li>Warranties regarding the accuracy, reliability, or completeness of content or recommendations</li>
              <li>Warranties that defects will be corrected</li>
            </ul>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0] mt-3">
              You use the Service at your own risk. Some jurisdictions do not allow the exclusion of certain warranties, so some of the above exclusions may not apply to you.
            </p>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">9. Limitation of Liability</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0] mb-3">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, RAVEN, ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside space-y-2 font-['Saira:Regular',sans-serif] text-[14px] text-[#e0e0e0] ml-4">
              <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
              <li>Damages resulting from your use or inability to use the Service</li>
              <li>Damages resulting from any conduct or content of third parties</li>
              <li>Unauthorized access to or alteration of your transmissions or data</li>
              <li>Personal injury or property damage arising from your use of the Service</li>
              <li>Any experiences at recommended venues or events</li>
            </ul>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0] mt-3">
              OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE PAST SIX MONTHS, OR $100, WHICHEVER IS GREATER.
            </p>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">10. Indemnification</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              You agree to indemnify, defend, and hold harmless Raven, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys&apos; fees) arising from: (a) your use of the Service; (b) your violation of these Terms; (c) your violation of any rights of another party; or (d) your conduct in connection with the Service.
            </p>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">11. Beta Testing</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              The Service is currently in beta testing. As a beta user, you acknowledge that the Service may contain bugs, errors, or other issues, and that features may be added, modified, or removed at any time without notice. Your feedback and bug reports are appreciated and may be used to improve the Service.
            </p>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">12. Alcohol and Safety Disclaimer</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              Raven may recommend venues that serve alcohol. You are responsible for consuming alcohol responsibly and complying with all applicable laws. Never drink and drive. We encourage you to arrange safe transportation, use designated drivers, or use ride-sharing services. Raven assumes no liability for your alcohol consumption or any related incidents.
            </p>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">13. Dispute Resolution and Arbitration</h2>
            
            <h3 className="font-['Saira:Medium',sans-serif] text-[16px] text-white mb-3 mt-4">13.1 Informal Resolution</h3>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              Before filing a claim, you agree to contact us and attempt to resolve any dispute informally. We will attempt to resolve the dispute informally by contacting you.
            </p>

            <h3 className="font-['Saira:Medium',sans-serif] text-[16px] text-white mb-3 mt-4">13.2 Binding Arbitration</h3>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              If we cannot resolve a dispute informally, any dispute will be resolved through binding arbitration rather than in court, except that you may assert claims in small claims court if they qualify. The arbitration will be conducted under the rules of a recognized arbitration association.
            </p>

            <h3 className="font-['Saira:Medium',sans-serif] text-[16px] text-white mb-3 mt-4">13.3 Class Action Waiver</h3>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              You agree to resolve disputes with us on an individual basis only. You waive any right to bring claims as a plaintiff or class member in any class, consolidated, or representative action.
            </p>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">14. Governing Law</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Raven operates, without regard to its conflict of law provisions. Any legal action must be brought in the courts of that jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">15. Severability</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">16. Entire Agreement</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and Raven regarding the Service and supersede all prior agreements and understandings.
            </p>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">17. Changes to Terms</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms with a new &quot;Last Updated&quot; date. Your continued use of the Service after such changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">18. Contact Information</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              If you have any questions about these Terms, please contact us through the contact form in the application or reach out to our support team.
            </p>
          </section>

          <section>
            <h2 className="font-['Saira:Medium',sans-serif] text-[20px] text-[#ffaeaf] mb-4">19. Survival</h2>
            <p className="font-['Saira:Regular',sans-serif] text-[14px] leading-relaxed text-[#e0e0e0]">
              All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity obligations, and limitations of liability.
            </p>
          </section>
        </div>

        {/* Footer spacing */}
        <div className="h-16"></div>
      </div>
    </div>
  );
}
