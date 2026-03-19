import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GDPR Compliance | Aster Homecare',
  description: 'Information on how Aster Homecare UK LTD complies with GDPR regulations.',
}

export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-slate-900 text-white py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">GDPR Compliance Statement</h1>
            <p className="text-blue-200 text-lg">Aster Homecare UK LTD Data Protection Commitment</p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
            <div className="prose prose-slate prose-lg max-w-none">
              <p>
                Aster Homecare UK LTD is fully committed to conducting its business in accordance with all applicable data protection laws and regulations, 
                in line with the highest standards of ethical conduct. This statement outlines our commitment to compliance with the General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
              </p>

              <h2>Commitment to GDPR</h2>
              <p>We process all personal data strictly in accordance with GDPR principles. Personal data will be:</p>
              <ul>
                <li>Processed lawfully, fairly, and in a transparent manner.</li>
                <li>Collected for specified, explicit, and legitimate purposes.</li>
                <li>Adequate, relevant, and limited to what is necessary.</li>
                <li>Accurate and, where necessary, kept up to date.</li>
                <li>Kept in a form which permits identification of data subjects for no longer than is necessary.</li>
                <li>Processed securely against unauthorised or unlawful processing.</li>
              </ul>

              <h2>Data Protection Officer (DPO)</h2>
              <p>
                We have appointed a Data Protection Officer who is responsible for overseeing questions in relation to this compliance statement. 
                If you have any questions, including any requests to exercise your legal rights, please contact the DPO at info@asterhomecare.co.uk.
              </p>

              <h2>Staff Training</h2>
              <p>
                All Aster Homecare staff handle highly sensitive health and social care data. Due to the sensitive nature of this data, all employees undergo robust, mandatory GDPR and Data Protection training during their induction and annually thereafter. Staff understand the legal duty of confidentiality and are bound by stringent non-disclosure agreements.
              </p>

              <h2>Your Data Rights</h2>
              <p>
                Under the UK GDPR, you have the right to be informed, the right of access, the right to rectification, the right to erasure ("the right to be forgotten"), 
                the right to restrict processing, the right to data portability, the right to object, and rights in relation to automated decision making and profiling.
              </p>

              <h2>Data Breaches</h2>
              <p>
                In the highly unlikely event of a data breach, Aster Homecare has a robust Data Breach Response Plan in place. 
                Our policy ensures that the Information Commissioner's Office (ICO) and any affected data subjects are notified rapidly, in full compliance with the strict 72-hour regulatory timeframe mandated by the GDPR.
              </p>

              <p className="mt-8 text-sm text-slate-500">
                For a detailed breakdown of how we process specific data categories, please refer to our full Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
