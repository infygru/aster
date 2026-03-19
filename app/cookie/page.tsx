import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy | Aster Homecare',
  description: 'Learn about how Aster Homecare UK LTD uses cookies on our website.',
}

export default function CookiePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-slate-900 text-white py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">Cookie Policy</h1>
            <p className="text-blue-200 text-lg">Last Updated: March 2024</p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
            <div className="prose prose-slate prose-lg max-w-none">
              <p>
                This Cookie Policy explains how Aster Homecare UK LTD ("we", "us", or "our") uses cookies and similar technologies 
                to recognise you when you visit our website. It explains what these technologies are, why we use them, and your rights to control our use of them.
              </p>

              <h2>1. What are cookies?</h2>
              <p>
                Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
                Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
              </p>

              <h2>2. Why do we use cookies?</h2>
              <p>We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on our online properties.</p>

              <h2>3. Types of Cookies We Use</h2>
              <ul>
                <li><strong>Essential Cookies:</strong> These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas.</li>
                <li><strong>Performance and Functionality Cookies:</strong> These are used to enhance the performance and functionality of our website but are non-essential to their use. However, without these cookies, certain functionality (like videos) may become unavailable.</li>
                <li><strong>Analytics and Customisation Cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are.</li>
              </ul>

              <h2>4. How can I control cookies?</h2>
              <p>
                You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager or by amending your web browser controls to accept or refuse cookies.
                If you choose to reject cookies, you may still use our website, though your access to some functionality and areas of our website may be restricted.
              </p>

              <h2>5. Changes to this policy</h2>
              <p>
                We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. 
                Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
              </p>

              <h2>6. Contact Us</h2>
              <p>
                If you have any questions about our use of cookies or other technologies, please email us at info@asterhomecare.co.uk.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
