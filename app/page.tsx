"use client";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Briefcase,
  MapPin,
  Clock,
  Code,
  TrendingUp,
  Settings,
  Heart,
  BookOpen,
  DollarSign,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface JobCategory {
  id: string;
  name: string;
  nameSi: string;
  icon: string;
  count: number;
  color: string;
}

// Dynamic icon component
const DynamicIcon = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  const icons: { [key: string]: React.ReactNode } = {
    Code: <Code className={className || "h-6 w-6"} />,
    TrendingUp: <TrendingUp className={className || "h-6 w-6"} />,
    Settings: <Settings className={className || "h-6 w-6"} />,
    Heart: <Heart className={className || "h-6 w-6"} />,
    BookOpen: <BookOpen className={className || "h-6 w-6"} />,
    DollarSign: <DollarSign className={className || "h-6 w-6"} />,
  };

  return icons[name] || <Briefcase className={className || "h-6 w-6"} />;
};

interface Job {
  id: string;
  title: string;
  company: string;
  logo?: string;
  location: string;
  type: string;
  category: string;
  salary: string;
  experience: string;
  postedDate: string;
  status?: string;
}

export default function Home() {
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recent jobs
        const jobsResponse = await fetch("/api/jobs");
        if (!jobsResponse.ok) throw new Error("Failed to fetch jobs");
        const jobsData = await jobsResponse.json();
        setRecentJobs(jobsData.slice(0, 6));

        // Fetch category counts
        const categoriesResponse = await fetch("/api/jobs/categories");
        if (!categoriesResponse.ok)
          throw new Error("Failed to fetch categories");
        const categoriesData = await categoriesResponse.json();

        // Map to our category structure with real counts
        const updatedCategories = [
          {
            id: "it",
            name: "Information Technology",
            nameSi: "තොරතුරු තාක්ෂණ",
            icon: "Code",
            count: categoriesData.it || 0,
            color: "bg-blue-100 text-blue-600",
          },
          {
            id: "marketing",
            name: "Marketing",
            nameSi: "අලෙවිකරණ",
            icon: "TrendingUp",
            count: categoriesData.marketing || 0,
            color: "bg-green-100 text-green-600",
          },
          {
            id: "engineering",
            name: "Engineering",
            nameSi: "ඉංජිනේරු",
            icon: "Settings",
            count: categoriesData.engineering || 0,
            color: "bg-orange-100 text-orange-600",
          },
          {
            id: "healthcare",
            name: "Healthcare",
            nameSi: "සෞඛ්‍ය සේවා",
            icon: "Heart",
            count: categoriesData.healthcare || 0,
            color: "bg-red-100 text-red-600",
          },
          {
            id: "education",
            name: "Education",
            nameSi: "අධ්‍යාපන",
            icon: "BookOpen",
            count: categoriesData.education || 0,
            color: "bg-purple-100 text-purple-600",
          },
          {
            id: "finance",
            name: "Finance",
            nameSi: "මූල්‍ය",
            icon: "DollarSign",
            count: categoriesData.finance || 0,
            color: "bg-yellow-100 text-yellow-600",
          },
        ];

        setJobCategories(updatedCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getJobColors = (job: Job) => {
    const borderColors = {
      "Full-time": "border-blue-300",
      "Part-time": "border-purple-300",
      Contract: "border-orange-300",
      Freelance: "border-green-300",
      default: "border-gray-300",
    };

    const badgeColors = {
      "Full-time": "bg-blue-100 text-blue-800",
      "Part-time": "bg-purple-100 text-purple-800",
      Contract: "bg-orange-100 text-orange-800",
      Freelance: "bg-green-100 text-green-800",
      default: "bg-gray-100 text-gray-800",
    };

    return {
      color:
        borderColors[job.type as keyof typeof borderColors] ||
        borderColors.default,
      badgeColor:
        badgeColors[job.type as keyof typeof badgeColors] ||
        badgeColors.default,
    };
  };

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Hero Section with Search */}
        <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-md">
                Find Your Dream Job in Sri Lanka
              </h1>
              <p className="text-xl mb-10 text-blue-100">
                Browse thousands of job opportunities across the island
              </p>
              <form
                onSubmit={handleSearch}
                className="flex flex-col md:flex-row gap-3 shadow-lg rounded-lg overflow-hidden"
              >
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="රැකියා සොයන්න... (Search for jobs...)"
                    className="pl-12 py-7 w-full bg-white text-black rounded-l-lg border-0 text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-7 px-10 rounded-r-lg text-lg border-0"
                >
                  සොයන්න (Search)
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Job Categories Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                රැකියා ප්‍රවර්ග (Job Categories)
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Browse job opportunities by category and find the perfect role
                for your skills and experience
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 sm:gap-6 gap-4">
              {jobCategories.map((category) => (
                <Link
                  href={`/jobs?category=${category.id}`}
                  key={category.id}
                  className="block"
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-t-4 border-t-blue-500 hover:-translate-y-1">
                    <CardContent className="sm:p-6 p-2 flex flex-col items-center text-center">
                      <div
                        className={`${category.color} p-4 rounded-full mb-4`}
                      >
                        {DynamicIcon({ name: category.icon })}
                      </div>
                      <h3 className="font-semibold mb-1">{category.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {category.nameSi}
                      </p>
                      <Badge
                        variant="outline"
                        className={`mt-2 ${category.color.split(" ")[0]}`}
                      >
                        {category.count}+ Jobs
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Recent Job Listings</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Browse our latest job opportunities
              </p>
            </div>

            {/* Mobile horizontal scroll */}
            <div className="sm:hidden pb-4 -mx-4 px-4">
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {recentJobs.map((job) => {
                  const colors = getJobColors(job);
                  return (
                    <div
                      key={job.id}
                      className="min-w-full bg-white rounded-lg shadow border-l-4 ${colors.color} p-4"
                      onClick={() => {
                        window.location.href = `/jobs/${job.id}`;
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border">
                          {job.logo ? (
                            <Image
                              src={job.logo}
                              alt={job.company}
                              width={40}
                              height={40}
                              className="object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                              {job.company.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-base truncate">
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {job.company}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 space-y-1">
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{job.location}</span>
                        </div>
                        <Badge className={`text-xs ${colors.badgeColor}`}>
                          {job.type}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Desktop grid layout */}
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {isLoading ? (
                <div className="col-span-full flex justify-center py-12">
                  <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
              ) : recentJobs.length > 0 ? (
                recentJobs.map((job) => {
                  const colors = getJobColors(job);
                  return (
                    <Card
                      key={job.id}
                      className={`hover:shadow-lg transition-all duration-300 overflow-hidden border-l-4 ${colors.color} hover:-translate-y-1`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start mb-4">
                          <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 mr-4 flex-shrink-0 border">
                            {job.logo ? (
                              <Image
                                src={job.logo}
                                alt={job.company}
                                width={48}
                                height={48}
                                className="object-contain"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                                {job.company.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-xl mb-1">
                              {job.title}
                            </h3>
                            <p className="text-gray-700">{job.company}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-y-2 mb-4">
                          <div className="flex items-center text-gray-500 mr-4">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">{job.location}</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="text-sm">
                              {new Date(job.postedDate).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                        <Badge className={`mb-4 ${colors.badgeColor}`}>
                          {job.type}
                        </Badge>
                      </CardContent>
                      <div className="border-t">
                        <Link href={`/jobs/${job.id}`}>
                          <Button
                            variant="ghost"
                            className="w-full rounded-none h-12 font-medium"
                          >
                            වැඩිදුර කියවන්න (View Details)
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No recent jobs found</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Briefcase className="h-8 w-8 text-blue-400" />
                <span className="font-bold text-xl">JobiGolk</span>
              </div>
              <p className="text-gray-400 mb-6">
                The leading job portal in Sri Lanka connecting employers with
                qualified talent across the island.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/jobs"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Job Categories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/employers"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    For Employers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Job Categories */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Job Categories</h3>
              <ul className="space-y-3">
                {jobCategories.slice(0, 5).map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/jobs?category=${category.id}`}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-400">
                    123 Main Street, Colombo 03, Sri Lanka
                  </span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-400">+94 11 234 5678</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-400">info@jobigolk.lk</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-gray-800 text-center text-gray-500">
            <p>© {new Date().getFullYear()} JobiGolk. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
