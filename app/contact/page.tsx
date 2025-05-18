import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We&apos;d love to hear from you! Reach out through any of these
            channels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Mail className="h-5 w-5 mt-1 text-blue-600" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-gray-600">contact@jobigolk.lk</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Typically respond within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="h-5 w-5 mt-1 text-blue-600" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-gray-600">+94 77 0 172 451</p>
                  <p className="text-sm text-gray-500 mt-1">Mon-Fri, 9am-5pm</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 mt-1 text-blue-600" />
                <div>
                  <h3 className="font-medium">Office</h3>
                  <p className="text-gray-600">Kaluthara, Sri Lanka</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium">Business Hours</h3>
          </div>
          <p className="text-gray-700">Monday - Friday: 9:00 AM - 5:00 PM</p>
          <p className="text-gray-700">Saturday - Sunday: Closed</p>
        </div>
      </div>
    </section>
  );
}
