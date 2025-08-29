"use client";

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <Navigation />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="oslo-gradient norse-pattern py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 hero-text-shadow">
              Contact Us
            </h1>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto">
              Get in touch with the Oslo Vikings organization
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Contact Form */}
              <div>
                <ContactForm />
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                
                {/* Contact Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl text-viking-charcoal">Get in Touch</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-viking-red rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-viking-charcoal">Email</h3>
                        <p className="text-gray-600">info@oslovikings.no</p>
                        <p className="text-gray-600">media@oslovikings.no</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-viking-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-viking-charcoal" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-viking-charcoal">Phone</h3>
                        <p className="text-gray-600">+47 XXX XX XXX</p>
                        <p className="text-gray-600">Emergency: +47 XXX XX XXX</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-viking-red rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-viking-charcoal">Address</h3>
                        <p className="text-gray-600">
                          Viking Stadium<br />
                          123 Football Street<br />
                          0123 Oslo, Norway
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-viking-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-viking-charcoal" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-viking-charcoal">Office Hours</h3>
                        <p className="text-gray-600">
                          Monday - Friday: 9:00 - 17:00<br />
                          Saturday: 10:00 - 15:00<br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Links */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-viking-charcoal">Quick Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Season Tickets</span>
                      <Button variant="outline" size="sm" className="border-viking-red text-viking-red hover:bg-viking-red hover:text-white">
                        Buy Now
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Group Sales</span>
                      <Button variant="outline" size="sm" className="border-viking-red text-viking-red hover:bg-viking-red hover:text-white">
                        Inquire
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Corporate Partnerships</span>
                      <Button variant="outline" size="sm" className="border-viking-red text-viking-red hover:bg-viking-red hover:text-white">
                        Contact
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Media Requests</span>
                      <Button variant="outline" size="sm" className="border-viking-red text-viking-red hover:bg-viking-red hover:text-white">
                        Submit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-viking-charcoal mb-4">Find Us</h2>
              <p className="text-gray-600">
                Viking Stadium is located in the heart of Oslo
              </p>
            </div>
            
            <div className="bg-gray-300 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <MapPin className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg font-medium">Interactive Map</p>
                <p className="text-sm">Google Maps integration would be added here</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}