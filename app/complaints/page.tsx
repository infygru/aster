import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Complaints Procedure | Aster Homecare',
  description: 'How to make a complaint or provide feedback to Aster Homecare UK LTD.',
}

export default function ComplaintsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-slate-900 text-white py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">Complaints Procedure</h1>
            <p className="text-blue-200 text-lg">We welcome all forms of feedback to improve our services.</p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
            <div className="prose prose-slate prose-lg max-w-none">
              <p>
                Aster Homecare UK LTD is committed to delivering a premier domiciliary care service. However, we recognise that there may be occasions when you feel our service has fallen short of your expectations. We openly welcome all feedback and treat all complaints seriously, respectfully, and confidentially.
              </p>

              <h2>1. How to raise a concern</h2>
              <p>
                If you are unhappy with any aspect of your care, we encourage you to speak directly to your Care Worker or their immediate supervisor in the first instance. Many issues can be resolved quickly at this informal stage. If you do not feel comfortable doing this, or if the issue is not resolved, you can progress to a formal complaint.
              </p>

              <h2>2. Making a formal complaint</h2>
              <p>You can make a formal complaint by contacting our Registered Manager via the following methods:</p>
              <ul>
                <li><strong>By Email:</strong> info@asterhomecare.co.uk</li>
                <li><strong>By Phone:</strong> +44 (0)1753 000000 (ask to speak to the Registered Manager)</li>
                <li><strong>In Writing:</strong> Registered Manager, Aster Homecare UK LTD, 7 Mackenzie Street, Slough, Berkshire, SL1 1XQ, United Kingdom.</li>
              </ul>
              <p>Please provide as much detail as possible, including dates, times, and the names of any staff members involved.</p>

              <h2>3. Our Complaints Process</h2>
              <p>When we receive a formal complaint, we will follow this procedure:</p>
              <ol>
                <li><strong>Acknowledgement:</strong> We will acknowledge receipt of your complaint in writing (or via email) within 3 working days.</li>
                <li><strong>Investigation:</strong> Our Registered Manager will conduct a thorough and impartial investigation. This may involve speaking with you, our care staff, and reviewing relevant care records.</li>
                <li><strong>Resolution:</strong> We aim to conclude our investigation and provide a full written response within 28 days. If the matter is complex and requires more time, we will keep you informed of our progress and expected timeframes.</li>
                <li><strong>Action:</strong> If your complaint is upheld, we will apologise, explain what went wrong, and detail the steps we are taking to ensure it does not happen again.</li>
              </ol>

              <h2>4. Escalating your complaint</h2>
              <p>
                If you are not satisfied with our final response, or if you prefer to raise your concerns externally, you may contact the relevant ombudsman or regulatory body.
              </p>
              <ul>
                <li>
                  <strong>Local Government and Social Care Ombudsman (LGSCO):</strong> If your care is funded by the local council, you can refer the matter to the LGSCO. Web: <a href="https://www.lgo.org.uk" target="_blank" rel="noopener noreferrer">www.lgo.org.uk</a>.
                </li>
                <li>
                  <strong>The Care Quality Commission (CQC):</strong> While the CQC cannot investigate individual complaints, they welcome information about care services to help them monitor quality. Web: <a href="https://www.cqc.org.uk" target="_blank" rel="noopener noreferrer">www.cqc.org.uk</a>.
                </li>
              </ul>

              <h2>5. Advocacy Support</h2>
              <p>
                If you need help raising a concern or making a complaint, you have the right to use an independent advocate. This is someone who can speak on your behalf and support you through the process. Your local authority can provide details of local advocacy services.
              </p>

            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
