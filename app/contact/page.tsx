'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/ToastProvider';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const infoGridRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-4');
        }
      });
    }, observerOptions);

    if (infoGridRef.current) {
      observer.observe(infoGridRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Success
      showToast('Message sent successfully. We\'ll respond shortly.', 'success');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: 'General Inquiry',
        message: '',
      });

      // Smooth scroll to success message (if we add one)
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error submitting form:', error);
      showToast('Something went wrong — please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-ivory min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-ivory py-20 md:py-30">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-heading text-4xl md:text-5xl font-bold text-charcoal mb-6">
              Get in Touch with Vici Peptides
            </h1>
            <p className="text-charcoal text-lg md:text-xl max-w-2xl mx-auto">
              For all inquiries, research support, or supplier verification requests — please reach out below.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 md:py-24 bg-ivory">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-charcoal font-semibold mb-2"
                >
                  First Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-ivory border-2 border-taupe rounded-lg text-charcoal placeholder-stone focus:outline-none focus:border-charcoal transition-all duration-400 font-serif"
                  placeholder="Enter your first name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-charcoal font-semibold mb-2"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-ivory border-2 border-taupe rounded-lg text-charcoal placeholder-stone focus:outline-none focus:border-charcoal transition-all duration-400 font-serif"
                  placeholder="Enter your last name"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-charcoal font-semibold mb-2"
                >
                  Email Address <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-ivory border-2 border-taupe rounded-lg text-charcoal placeholder-stone focus:outline-none focus:border-charcoal transition-all duration-400 font-serif"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-charcoal font-semibold mb-2"
                >
                  Subject <span className="text-red-600">*</span>
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-ivory border-2 border-taupe rounded-lg text-charcoal focus:outline-none focus:border-charcoal transition-all duration-400 font-serif"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Order Support">Order Support</option>
                  <option value="Lab Collaboration">Lab Collaboration</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-charcoal font-semibold mb-2"
                >
                  Message <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-ivory border-2 border-taupe rounded-lg text-charcoal placeholder-stone focus:outline-none focus:border-charcoal transition-all duration-400 resize-none font-serif"
                  placeholder="Please provide details about your inquiry..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-ivory border-2 border-charcoal text-charcoal font-semibold py-4 px-6 rounded-lg hover:bg-charcoal hover:text-ivory transition-all duration-400 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center uppercase tracking-wide"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Info Grid Section */}
      <section className="py-16 md:py-24 bg-taupe">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div
              ref={infoGridRef}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 opacity-0 translate-y-4 transition-all duration-700 ease-out"
            >
              {/* Email */}
              <div className="bg-ivory border-2 border-taupe rounded-lg p-6 hover:border-charcoal transition-all duration-400" style={{ boxShadow: '0 2px 8px rgba(43, 43, 43, 0.1)' }}>
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 rounded-full border-2 border-stone bg-taupe">
                    <svg
                      className="w-8 h-8 text-charcoal"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-heading font-semibold text-charcoal mb-2">
                    Email
                  </h3>
                  <a
                    href="mailto:info@vicipeptides.com"
                    className="text-charcoal hover:text-charcoal/80 transition-colors duration-400"
                  >
                    info@vicipeptides.com
                  </a>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="bg-ivory border-2 border-taupe rounded-lg p-6 hover:border-charcoal transition-all duration-400" style={{ boxShadow: '0 2px 8px rgba(43, 43, 43, 0.1)' }}>
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 rounded-full border-2 border-stone bg-taupe">
                    <svg
                      className="w-8 h-8 text-charcoal"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-heading font-semibold text-charcoal mb-2">
                    Operating Hours
                  </h3>
                  <p className="text-charcoal text-sm">
                    24 Hours / 24/7
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

