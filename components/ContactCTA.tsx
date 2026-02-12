'use client';

import { useState } from 'react';
import ContactForm from './ContactForm';

export default function ContactCTA() {
  const [showForm, setShowForm] = useState(false);

  return (
    <section id="contact" className="py-16 bg-[#0a0a0a]">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#00ff00]">
            Ready to Get Started?
          </h2>
          <p className="text-[#00ff00]/70">
            Tell me about your project and I&apos;ll get back to you within 24-48 hours
            with ideas on how we can work together.
          </p>
        </div>

        {showForm ? (
          <div className="bg-[#1a1a1a] border border-[#00ff00]/20 rounded-lg p-6">
            <ContactForm onSuccess={() => setShowForm(false)} />
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-4 bg-[#00ff00] text-[#1a1a1a] font-bold text-lg rounded-lg hover:bg-[#00cc00] transition-colors"
            >
              Start a Conversation
            </button>
            <p className="mt-4 text-sm text-[#00ff00]/50">
              No commitment required. Just exploring is fine.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
