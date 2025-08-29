"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<FormStatus>({ type: 'idle' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading' });

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would send the data to your backend
      console.log('Form submitted:', formData);
      
      setStatus({
        type: 'success',
        message: 'Thank you for your message! We\'ll get back to you soon.',
      });
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Something went wrong. Please try again later.',
      });
    }
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email && formData.subject && formData.message;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-viking-charcoal flex items-center gap-2">
          <Mail className="w-6 h-6" />
          Send us a Message
        </CardTitle>
      </CardHeader>
      <CardContent>
        {status.type === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-viking-charcoal mb-2">Message Sent!</h3>
            <p className="text-gray-600 mb-6">{status.message}</p>
            <Button 
              onClick={() => setStatus({ type: 'idle' })}
              className="bg-viking-red hover:bg-viking-red-dark"
            >
              Send Another Message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-viking-red focus:border-transparent"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-viking-red focus:border-transparent"
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-viking-red focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-viking-red focus:border-transparent"
                placeholder="What's this about?"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-viking-red focus:border-transparent resize-none"
                placeholder="Tell us what's on your mind..."
              />
            </div>

            {status.type === 'error' && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{status.message}</span>
              </div>
            )}
            
            <Button 
              type="submit"
              disabled={!isFormValid || status.type === 'loading'}
              className="w-full bg-viking-red hover:bg-viking-red-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status.type === 'loading' ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}