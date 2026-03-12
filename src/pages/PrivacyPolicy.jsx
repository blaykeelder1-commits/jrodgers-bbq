import usePageTitle from '../hooks/usePageTitle';
import './PrivacyPolicy.css';

function PrivacyPolicy() {
  usePageTitle('Privacy Policy');

  return (
    <div className="privacy-page">
      <div className="privacy-header">
        <div className="container">
          <h1>Privacy Policy</h1>
          <p>Last updated: March 12, 2026</p>
        </div>
      </div>

      <div className="privacy-content">
        <div className="container">
          <div className="privacy-body">
            <section>
              <h2>Introduction</h2>
              <p>
                J Rodgers BBQ & Soul Food ("we," "us," or "our") respects your privacy
                and is committed to protecting the personal information you share with us.
                This Privacy Policy explains what information we collect, how we use it,
                and your rights regarding that information.
              </p>
            </section>

            <section>
              <h2>Information We Collect</h2>
              <p>We may collect the following types of information when you use our website:</p>
              <ul>
                <li>
                  <strong>Contact Information:</strong> Name, email address, and phone
                  number when you submit our contact or catering inquiry forms.
                </li>
                <li>
                  <strong>Order Information:</strong> Your name, phone number, email,
                  and order details when you place an online order.
                </li>
                <li>
                  <strong>Event Details:</strong> Event date, guest count, event type,
                  and any additional details you provide in catering inquiries.
                </li>
              </ul>
            </section>

            <section>
              <h2>How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Process and fulfill your online orders</li>
                <li>Respond to your contact form inquiries</li>
                <li>Provide catering quotes and coordinate event details</li>
                <li>Communicate with you about your orders or inquiries</li>
              </ul>
            </section>

            <section>
              <h2>Third-Party Services</h2>
              <p>We use the following third-party services to operate our website:</p>
              <ul>
                <li>
                  <strong>Web3Forms:</strong> Processes contact and catering form
                  submissions. Web3Forms' privacy policy can be found at{' '}
                  <a href="https://web3forms.com/privacy" target="_blank" rel="noopener noreferrer">
                    web3forms.com/privacy
                  </a>.
                </li>
                <li>
                  <strong>Square:</strong> Processes payments securely. Square's privacy
                  policy can be found at{' '}
                  <a href="https://squareup.com/us/en/legal/general/privacy" target="_blank" rel="noopener noreferrer">
                    squareup.com/us/en/legal/general/privacy
                  </a>.
                </li>
                <li>
                  <strong>Google Maps:</strong> Displays our restaurant location on the
                  Contact page.
                </li>
                <li>
                  <strong>Vercel:</strong> Hosts our website. Vercel's privacy policy
                  can be found at{' '}
                  <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                    vercel.com/legal/privacy-policy
                  </a>.
                </li>
              </ul>
            </section>

            <section>
              <h2>Data Storage</h2>
              <p>
                We do not store your personal information on our servers. Form submissions
                are processed through Formspree, and payment information is handled
                entirely by Square. Order details may be temporarily stored in your
                browser's local storage for your convenience during the ordering process.
              </p>
            </section>

            <section>
              <h2>Cookies</h2>
              <p>
                Our website uses browser local storage to save your shopping cart
                between visits. We do not use tracking cookies or analytics cookies.
                Third-party services embedded on our site (such as Google Maps) may
                use their own cookies.
              </p>
            </section>

            <section>
              <h2>Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Request information about the personal data we hold about you</li>
                <li>Request correction or deletion of your personal data</li>
                <li>Opt out of any future communications from us</li>
              </ul>
            </section>

            <section>
              <h2>Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <p>
                <strong>J Rodgers BBQ & Soul Food</strong><br />
                1444 Industrial Parkway<br />
                Saraland, AL 36571<br />
                Phone: (251) 675-3282<br />
                Email: info@jrodgersbbq.com
              </p>
            </section>

            <section>
              <h2>Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Any changes will
                be posted on this page with an updated revision date.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
