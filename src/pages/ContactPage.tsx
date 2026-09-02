import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Mail, MessageSquare, HelpCircle, Send, CheckCircle, Clock, Shield } from 'lucide-react';

interface ContactPageProps {
  onGetStarted: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onGetStarted }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto">
            Have questions? We're here to help. Get in touch with our support team.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <p className="text-lg text-gray-600 mb-8">
                Whether you have a question about features, need technical support, or want to learn more
                about our community, our team is ready to answer all your questions.
              </p>

              <div className="space-y-6">
                <Card className="p-6 flex items-start space-x-4 hover:shadow-lg transition-all">
                  <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Email Support</h3>
                    <p className="text-gray-600 mb-2">
                      For general inquiries and support questions
                    </p>
                    <a href="mailto:support@engagementexperts.in" className="text-blue-600 hover:text-blue-700 font-semibold">
                      support@engagementexperts.in
                    </a>
                  </div>
                </Card>

                <Card className="p-6 flex items-start space-x-4 hover:shadow-lg transition-all">
                  <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
                    <HelpCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Help Center</h3>
                    <p className="text-gray-600 mb-2">
                      Find answers to common questions in our knowledge base
                    </p>
                    <a href="/help" className="text-blue-600 hover:text-blue-700 font-semibold">
                      Visit Help Center →
                    </a>
                  </div>
                </Card>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Support Hours</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-5 h-5 text-blue-600 mr-3" />
                    <span>Monday - Friday: 9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-5 h-5 text-blue-600 mr-3" />
                    <span>Saturday: 10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-5 h-5 text-blue-600 mr-3" />
                    <span>Sunday: Closed</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    * Email support available 24/7 with response within 24 hours
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

                {submitted && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-green-800 font-semibold">Message sent successfully!</p>
                      <p className="text-green-700 text-sm">We'll get back to you within 24 hours.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="How can we help?"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" icon={Send}>
                    Send Message
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    Your information is secure and will only be used to respond to your inquiry.
                    We respect your privacy.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">How quickly will I receive a response?</h3>
              <p className="text-gray-600">
                We aim to respond to all inquiries within 24 hours during business days. Urgent matters
                are prioritized and typically receive responses within a few hours.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">What information should I include?</h3>
              <p className="text-gray-600">
                Please provide as much detail as possible about your question or issue. Include any
                relevant account information, screenshots, or error messages to help us assist you better.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Can I call for support?</h3>
              <p className="text-gray-600">
                Currently, we provide support via email and our contact form. This allows us to document
                issues thoroughly and provide detailed responses. Phone support may be added in the future.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Is there a way to track my inquiry?</h3>
              <p className="text-gray-600">
                Once you submit an inquiry, you'll receive a confirmation email with a reference number.
                You can use this to follow up on your request if needed.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Not a Member Yet?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our community today and start participating in brand engagement activities
          </p>
          <Button size="lg" onClick={onGetStarted} className="bg-white text-blue-600 hover:bg-gray-100">
            Join Community Free
          </Button>
        </div>
      </section>
    </div>
  );
};
