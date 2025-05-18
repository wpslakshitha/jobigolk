import { Briefcase, Users, Globe } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About JobiGolk</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connecting job seekers with employers across Sri Lanka
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-gray-700 mb-4">
              Founded in 2024, JobiGolk started as a small initiative to help
              Sri Lankan job seekers find meaningful employment opportunities.
            </p>
            <p className="text-gray-700">
              Today, we&apos;ve grown into one of the leading job platforms in
              the country, serving thousands of job seekers and hundreds of
              employers.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700">
              To bridge the gap between talented professionals and companies
              looking for their skills, while making the job search process
              simple and effective.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Why Choose JobiGolk?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Briefcase className="h-10 w-10 mx-auto mb-4 text-blue-600" />
              <h3 className="font-medium mb-2">Wide Job Selection</h3>
              <p className="text-gray-600 text-sm">
                Thousands of jobs across all industries
              </p>
            </div>
            <div className="text-center">
              <Users className="h-10 w-10 mx-auto mb-4 text-blue-600" />
              <h3 className="font-medium mb-2">Verified Employers</h3>
              <p className="text-gray-600 text-sm">
                Only legitimate job opportunities
              </p>
            </div>
            <div className="text-center">
              <Globe className="h-10 w-10 mx-auto mb-4 text-blue-600" />
              <h3 className="font-medium mb-2">Nationwide Coverage</h3>
              <p className="text-gray-600 text-sm">
                Jobs from all regions of Sri Lanka
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/jobs"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Available Jobs
          </Link>
        </div>
      </div>
    </section>
  );
}
