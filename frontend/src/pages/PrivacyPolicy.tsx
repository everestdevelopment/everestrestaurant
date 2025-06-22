
import React from 'react';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      
      {/* Page Header */}
      <div className="pt-32 pb-12 md:pt-40 md:pb-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              Your privacy matters to us
            </p>
          </div>
        </div>
      </div>
      
      {/* Privacy Policy Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">
        <div className="glass-card p-8 animate-fade-in space-y-8">
          <section>
            <h2 className="text-2xl font-display font-bold mb-4 text-white">Information We Collect</h2>
            <p className="text-gray-300 leading-relaxed">
              We collect information you provide directly to us, such as when you create an account, 
              make a reservation, place an order, or contact us. This may include your name, email address, 
              phone number, and payment information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold mb-4 text-white">How We Use Your Information</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Process your orders and reservations</li>
              <li>Communicate with you about your orders</li>
              <li>Send you promotional materials (with your consent)</li>
              <li>Improve our services and user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold mb-4 text-white">Information Sharing</h2>
            <p className="text-gray-300 leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy. We may share your information 
              with service providers who assist us in operating our website and conducting our business.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold mb-4 text-white">Data Security</h2>
            <p className="text-gray-300 leading-relaxed">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method of 
              transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold mb-4 text-white">Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-4 text-gray-300">
              <p>Email: privacy@everestrest.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Summit Avenue, Manhattan, NY 10001</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold mb-4 text-white">Updates to This Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            <p className="text-gray-400 text-sm mt-4">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
