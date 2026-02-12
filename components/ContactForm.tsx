'use client';

import { useState } from 'react';
import {
  PROJECT_TYPES,
  BUDGET_TIERS,
  URGENCY_OPTIONS,
  PROJECT_LABELS,
  BUDGET_LABELS,
  URGENCY_LABELS,
} from '@/types/leads';

interface ContactFormProps {
  onSuccess?: () => void;
  className?: string;
}

export default function ContactForm({ onSuccess, className = '' }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name') || undefined,
          email: formData.get('email'),
          company: formData.get('company') || undefined,
          phone: formData.get('phone') || undefined,
          projectType: formData.get('projectType') || undefined,
          budgetTier: formData.get('budgetTier') || undefined,
          urgency: formData.get('urgency') || undefined,
          message: formData.get('message') || undefined,
          honeypot: formData.get('website'), // Hidden honeypot field
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      setSuccess(true);
      onSuccess?.();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-4xl mb-4 text-[#00ff00]">&#10003;</div>
        <h3 className="text-xl font-bold text-[#00ff00] mb-2">Message Sent!</h3>
        <p className="text-[#00ff00]/70">
          Thanks for reaching out. I&apos;ll get back to you within 24-48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {error && (
        <div className="p-3 bg-red-900/50 border border-red-500 text-red-300 rounded">
          {error}
        </div>
      )}

      {/* Email (only required field) */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold mb-1 text-[#00ff00]">
          Email <span className="text-red-400">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full p-3 bg-[#1a1a1a] border border-[#00ff00]/30 rounded text-[#00ff00] placeholder-[#00ff00]/40 focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00] outline-none transition"
          placeholder="you@company.com"
        />
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold mb-1 text-[#00ff00]">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          maxLength={100}
          className="w-full p-3 bg-[#1a1a1a] border border-[#00ff00]/30 rounded text-[#00ff00] placeholder-[#00ff00]/40 focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00] outline-none transition"
          placeholder="Your name"
        />
      </div>

      {/* Company & Phone Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="company" className="block text-sm font-semibold mb-1 text-[#00ff00]">
            Company
          </label>
          <input
            type="text"
            id="company"
            name="company"
            maxLength={100}
            className="w-full p-3 bg-[#1a1a1a] border border-[#00ff00]/30 rounded text-[#00ff00] placeholder-[#00ff00]/40 focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00] outline-none transition"
            placeholder="Your company"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold mb-1 text-[#00ff00]">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="w-full p-3 bg-[#1a1a1a] border border-[#00ff00]/30 rounded text-[#00ff00] placeholder-[#00ff00]/40 focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00] outline-none transition"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      {/* Project Type */}
      <div>
        <label htmlFor="projectType" className="block text-sm font-semibold mb-1 text-[#00ff00]">
          Project Type
        </label>
        <select
          id="projectType"
          name="projectType"
          className="w-full p-3 bg-[#1a1a1a] border border-[#00ff00]/30 rounded text-[#00ff00] focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00] outline-none transition"
        >
          <option value="">Select project type...</option>
          {PROJECT_TYPES.map(type => (
            <option key={type} value={type}>{PROJECT_LABELS[type]}</option>
          ))}
        </select>
      </div>

      {/* Budget & Urgency Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="budgetTier" className="block text-sm font-semibold mb-1 text-[#00ff00]">
            Budget Range
          </label>
          <select
            id="budgetTier"
            name="budgetTier"
            className="w-full p-3 bg-[#1a1a1a] border border-[#00ff00]/30 rounded text-[#00ff00] focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00] outline-none transition"
          >
            <option value="">Select budget...</option>
            {BUDGET_TIERS.map(tier => (
              <option key={tier} value={tier}>{BUDGET_LABELS[tier]}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="urgency" className="block text-sm font-semibold mb-1 text-[#00ff00]">
            Timeline
          </label>
          <select
            id="urgency"
            name="urgency"
            className="w-full p-3 bg-[#1a1a1a] border border-[#00ff00]/30 rounded text-[#00ff00] focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00] outline-none transition"
          >
            <option value="">Select timeline...</option>
            {URGENCY_OPTIONS.map(option => (
              <option key={option} value={option}>{URGENCY_LABELS[option]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold mb-1 text-[#00ff00]">
          Tell me about your project
        </label>
        <textarea
          id="message"
          name="message"
          maxLength={2000}
          rows={4}
          className="w-full p-3 bg-[#1a1a1a] border border-[#00ff00]/30 rounded text-[#00ff00] placeholder-[#00ff00]/40 focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00] outline-none transition resize-y"
          placeholder="Describe your project, goals, and any specific requirements..."
        />
      </div>

      {/* Honeypot - Hidden from humans, visible to bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website (leave blank)</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-6 bg-[#00ff00] text-[#1a1a1a] font-bold rounded hover:bg-[#00cc00] disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>

      <p className="text-xs text-[#00ff00]/50 text-center">
        By submitting, you agree to receive communications from CyberWorld Builders.
      </p>
    </form>
  );
}
