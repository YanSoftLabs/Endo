import type { IntakeFormData } from "@/lib/schemas/intake";

export function generateLegalContent(
  intake: IntakeFormData,
  pages: ("privacy" | "terms" | "disclaimer" | "refund")[],
) {
  const { businessName, contactEmail, businessAddress, country } = intake;
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return {
    privacy: pages.includes("privacy")
      ? `Privacy Policy for ${businessName}

Effective date: ${date}

1. Information we collect
We collect information you provide directly — such as your name, email address, and any other details submitted through our website or contact forms.

2. How we use your information
We use your information to respond to enquiries, deliver our services, and improve your experience. We do not sell or rent your personal data to third parties.

3. Data storage and security
Your data is stored securely and protected using industry-standard measures. We retain information only as long as necessary to fulfil the purposes described in this policy.

4. Your rights
You may request access to, correction of, or deletion of your personal data at any time by contacting us.

5. Cookies
Our website may use cookies to improve functionality. You may disable cookies through your browser settings.

Contact: ${contactEmail}
Address: ${businessAddress}, ${country}`
      : undefined,

    terms: pages.includes("terms")
      ? `Terms & Conditions for ${businessName}

Effective date: ${date}

1. Acceptance
By accessing our website and using our services, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.

2. Services
${businessName} provides services as described on this website. We reserve the right to modify or discontinue services at any time with reasonable notice.

3. Intellectual property
All content on this website — including text, graphics, logos, and software — is the property of ${businessName} and protected by applicable copyright and intellectual property laws.

4. Limitation of liability
${businessName} is not liable for indirect, incidental, or consequential damages arising from use of our services beyond the fees paid for the specific service in question.

5. Governing law
These terms are governed by the laws of ${country}. Any disputes shall be subject to the exclusive jurisdiction of courts in ${country}.

Contact: ${contactEmail}`
      : undefined,

    disclaimer: pages.includes("disclaimer")
      ? `Disclaimer for ${businessName}

Effective date: ${date}

The information provided on this website is for general informational purposes only. While we strive to ensure accuracy, ${businessName} makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, or reliability of the information on this site.

Any reliance you place on such information is strictly at your own risk. ${businessName} will not be liable for any loss or damage — including indirect or consequential loss — arising from your use of or reliance on any content found on this website.

This website may contain links to external sites. We are not responsible for the content or privacy practices of those sites.

For specific professional advice relevant to your situation, please consult a qualified professional.

Contact: ${contactEmail}
Address: ${businessAddress}, ${country}`
      : undefined,

    refund: pages.includes("refund")
      ? `Refund Policy for ${businessName}

Effective date: ${date}

1. Eligibility
Refund requests must be submitted within 14 days of the purchase or service date.

2. How to request a refund
Contact us at ${contactEmail} with your order details and reason for the request. We aim to respond within 2 business days.

3. Processing
Approved refunds are processed within 5–10 business days to your original payment method.

4. Non-refundable items
Services that have been fully delivered or consumed are generally not eligible for refunds unless there is a demonstrable fault on our part.

5. Disputes
If you are unsatisfied with our decision, you may escalate through the relevant consumer protection authority in ${country}.

Contact: ${contactEmail}
Address: ${businessAddress}, ${country}`
      : undefined,

    showCookieNotice: intake.legalPages.cookieNotice,
  };
}
