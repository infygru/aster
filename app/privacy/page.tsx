import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Aster Homecare',
  description: 'How Aster Homecare UK LTD collects, uses, and protects your personal data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section
        className="relative overflow-hidden text-white"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #1D4ED8 100%)' }}
      >
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-12 -right-12 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
        </div>
        <div className="relative container-custom py-16 md:py-24">
          <div className="max-w-3xl">
            <p className="text-blue-300 font-semibold text-sm uppercase tracking-widest mb-4">
              Legal & Compliance
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-white mb-6">Privacy Policy</h1>
            <p className="text-blue-100 text-lg">Last Updated: March 2026</p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
            <div className="prose prose-slate prose-lg max-w-none">
              <p>
                Aster Homecare UK LTD ("we", "our", or "us") is committed to protecting and respecting your privacy. 
                This Privacy Policy explains how we collect, use, and safeguard your personal data when you visit our website 
                or use our care services, in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
              </p>

              <h2>1. Information We Collect</h2>
              <p>We may collect and process the following data about you:</p>
              <ul>
                <li><strong>Identity Data:</strong> First name, last name, title, date of birth, and gender.</li>
                <li><strong>Contact Data:</strong> Billing address, delivery address, email address, and telephone numbers.</li>
                <li><strong>Health and Special Category Data:</strong> Medical history, ongoing health conditions, medication records, and specific care requirements necessary to provide safe and effective care.</li>
                <li><strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone setting, operating system, and platform.</li>
                <li><strong>Usage Data:</strong> Information about how you use our website, products, and services.</li>
              </ul>

              <h2>2. How We Collect Your Data</h2>
              <p>We use different methods to collect data from and about you, including:</p>
              <ul>
                <li><strong>Direct Interactions:</strong> You may give us your Identity, Contact, and Health Data by filling in forms (like our free assessment form) or by corresponding with us by post, phone, email, or otherwise.</li>
                <li><strong>Automated Technologies:</strong> As you interact with our website, we may automatically collect Technical Data about your equipment and browsing actions using cookies.</li>
                <li><strong>Third Parties:</strong> We may receive personal data about you from third parties such as the NHS, local authorities, GPs, or family members arranging care on your behalf.</li>
              </ul>

              <h2>3. How We Use Your Personal Data</h2>
              <p>We will only use your personal data when the law allows us to. Most commonly, we use your personal data in the following circumstances:</p>
              <ul>
                <li>To provide, manage, and coordinate your domiciliary care services.</li>
                <li>To perform a contract we are about to enter into or have entered into with you.</li>
                <li>To comply with regulatory obligations (e.g., Care Quality Commission requirements).</li>
                <li>Where it is necessary for our legitimate interests, and your interests and fundamental rights do not override those interests.</li>
                <li>To safeguard the vital interests of the data subject.</li>
              </ul>

              <h2>4. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorised way, altered, or disclosed. 
                In addition, we limit access to your personal data to those employees, agents, contractors, and third parties who have a business need to know. 
                They will only process your personal data on our instructions and are subject to a strict duty of confidentiality.
              </p>

              <h2>5. Data Retention</h2>
              <p>
                We will only retain your personal data for as long as necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements. 
                Care records are typically retained for a minimum of 8 years after the conclusion of service, in line with NHS and CQC standard guidelines.
              </p>

              <h2>6. Your Legal Rights</h2>
              <p>Under data protection laws, you have rights including:</p>
              <ul>
                <li><strong>Request access:</strong> Provide you with a copy of the personal data we hold about you.</li>
                <li><strong>Request correction:</strong> Correct any incomplete or inaccurate data we hold.</li>
                <li><strong>Request erasure:</strong> Ask us to delete or remove personal data where there is no good reason for us continuing to process it.</li>
                <li><strong>Object to processing:</strong> Object where we are relying on a legitimate interest.</li>
                <li><strong>Request restriction:</strong> Suspend the processing of your personal data.</li>
                <li><strong>Request transfer:</strong> Transfer your data to you or a third party.</li>
              </ul>
              <p>To exercise any of these rights, please contact our Data Protection Officer.</p>

              <h2>7. Contact forms and email links</h2>
              <p>
                Should you choose to contact us using our contact form or an email link, none of the data that you supply will be stored by this website 
                or passed to/be processed by any third party data processors. Instead, the data will be collated into an email and sent to us securely.
              </p>

              <h2>8. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:<br/>
                <strong>Email:</strong> info@asterhomecare.co.uk<br/>
                <strong>Address:</strong> 7 Mackenzie Street, Slough, Berkshire, SL1 1XQ, United Kingdom<br/>
                <strong>Phone:</strong> +44 (0)1753 000000
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
