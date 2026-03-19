import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms and Conditions | Aster Homecare',
  description: 'Terms and Conditions of service for Aster Homecare UK LTD.',
}

export default function TermsPage() {
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-white mb-6">Terms and Conditions</h1>
            <p className="text-blue-100 text-lg">Last Updated: March 2026</p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
            <div className="prose prose-slate prose-lg max-w-none">
              <p>
                These Terms and Conditions govern the provision of domiciliary care services by Aster Homecare UK LTD ("Aster Homecare", "we", "us", or "our") 
                to you ("the Client", "Service User", or "you"). By accepting our services, you agree to be bound by these terms.
              </p>

              <h2>1. Provision of Service</h2>
              <p>
                1.1. We agree to provide care services in accordance with the Care Plan agreed upon during the initial assessment.<br/>
                1.2. All services are provided subject to the requirements of the Care Quality Commission (CQC) and applicable UK health and social care legislation.<br/>
                1.3. We reserve the right to review and amend the Care Plan if the Service User's needs change. Any adjustments will be discussed and agreed upon with the Service User or their authorised representative.
              </p>

              <h2>2. Assessments and Care Plans</h2>
              <p>
                2.1. Before commencing any service, Aster Homecare will conduct a full assessment of your needs, health, and risks within your home environment.<br/>
                2.2. A personalised Care Plan will be drawn up. We cannot undertake tasks that are not specifically detailed in the Care Plan or strictly agreed upon by management.<br/>
                2.3. Our staff are not authorised to administer medication unless this is expressly written into the Care Plan following a formal medication assessment.
              </p>

              <h2>3. Fees and Charges</h2>
              <p>
                3.1. Our fees are set out in the Pricing Schedule provided to you prior to the commencement of care.<br/>
                3.2. Invoices are issued on a regular basis (normally bi-weekly or monthly) and are strictly payable within 14 days of the invoice date.<br/>
                3.3. We review our fees annually. We will give you at least 28 days' written notice of any resulting changes to your fees.<br/>
                3.4. Late payments may incur interest charges and could result in the suspension of services.
              </p>

              <h2>4. Cancellations</h2>
              <p>
                4.1. If you wish to cancel a scheduled visit, you must give us at least 48 hours' notice.<br/>
                4.2. Cancellations made with less than 48 hours' notice will be charged at the full rate of the scheduled visit, except in cases of sudden hospital admission or medical emergency.<br/>
                4.3. Either party may terminate the care contract entirely by providing 14 days' written notice.
              </p>

              <h2>5. Staffing and Continuity</h2>
              <p>
                5.1. While we strive to provide continuity of care and assign regular carers to you, we cannot guarantee the attendance of specific individuals due to illness, holidays, or operational requirements.<br/>
                5.2. All our staff undergo rigorous pre-employment checks, including enhanced Disclosure and Barring Service (DBS) checks and full referencing.<br/>
                5.3. Service Users agree not to directly employ any Aster Homecare staff member or ex-staff member within 6 months of them leaving our employment.
              </p>

              <h2>6. Health and Safety</h2>
              <p>
                6.1. We have a duty of care to ensure the health and safety of our staff. Service Users must ensure their home is a safe working environment.<br/>
                6.2. If our staff identify severe risks or hazards in the home, we reserve the right to withdraw services until the hazard is rectified.<br/>
                6.3. Service Users must not subject our staff to any form of abuse, harassment, or discrimination. Aster Homecare operates a zero-tolerance policy in this regard and will withdraw services immediately if such behaviour occurs.
              </p>

              <h2>7. Confidentiality</h2>
              <p>
                Aster Homecare complies strictly with the Data Protection Act 2018 and the UK GDPR. Your information will remain confidential and will only be shared with relevant health and social care professionals as required for the safe delivery of your care. For full details, please refer to our Privacy Policy.
              </p>

              <h2>8. Governing Law</h2>
              <p>
                These Terms and Conditions shall be governed by and construed in accordance with the laws of England and Wales. 
                Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of England and Wales.
              </p>

              <h2>9. Contact details</h2>
              <p>
                Aster Homecare UK LTD<br/>
                7 Mackenzie Street, Slough, Berkshire, SL1 1XQ<br/>
                Email: info@asterhomecare.co.uk<br/>
                Phone: +44 (0)1753 000000
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
