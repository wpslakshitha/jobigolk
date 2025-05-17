"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Search, Briefcase, MapPin, Clock, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSearchParams } from "next/navigation";

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
      badgeColors[job.type as keyof typeof badgeColors] || badgeColors.default,
  };
};

const locations = [
  "All Locations",
  "Colombo",
  "Kandy",
  "Galle",
  "Negombo",
  "Kurunegala",
  "Remote",
];

const jobTypes = [
  "All Types",
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
];

const categories = [
  "All Categories",
  "Technology",
  "Marketing",
  "Finance",
  "Design",
  "Sales",
  "Human Resources",
  "Customer Service",
  "Content",
  "Project Management",
  "Administration",
  "Hospitality",
];

const experienceLevels = [
  "All Experience",
  "Entry Level",
  "1-2 years",
  "2-4 years",
  "3-5 years",
  "5+ years",
];

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      }
    >
      <JobsPageContent />
    </Suspense>
  );
}

function JobsPageContent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedExperience, setSelectedExperience] =
    useState("All Experience");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const searchQuery = searchParams.get("search");
        const url = searchQuery
          ? `/api/jobs?search=${encodeURIComponent(searchQuery)}`
          : "/api/jobs";

        const response = await fetch(url);
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [searchParams]);

  const enhancedJobs = jobs.map((job) => ({
    ...job,
    ...getJobColors(job),
  }));

  const filteredJobs = enhancedJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      selectedLocation === "All Locations" || job.location === selectedLocation;

    const matchesType =
      selectedType === "All Types" || job.type === selectedType;

    const matchesCategory =
      selectedCategory === "All Categories" ||
      job.category === selectedCategory;

    const matchesExperience =
      selectedExperience === "All Experience" ||
      job.experience.includes(selectedExperience);

    return (
      matchesSearch &&
      matchesLocation &&
      matchesType &&
      matchesCategory &&
      matchesExperience
    );
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "newest") {
      return (
        new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      );
    } else if (sortBy === "oldest") {
      return (
        new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime()
      );
    } else if (sortBy === "company") {
      return a.company.localeCompare(b.company);
    }
    return 0;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLocation("All Locations");
    setSelectedType("All Types");
    setSelectedCategory("All Categories");
    setSelectedExperience("All Experience");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Find Your Dream Job in Sri Lanka
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We couldn&apos;t find any jobs matching your search criteria.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search jobs, companies, or keywords"
                  className="pl-10 py-6 text-base"
                  value=""
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white py-6 px-8"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-5 w-5" />
                Filters
              </Button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <Select
                    value={selectedLocation}
                    onValueChange={setSelectedLocation}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Type
                  </label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypes.map((type) => (
                        <SelectItem key="type" value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key="category" value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience
                  </label>
                  <Select
                    value={selectedExperience}
                    onValueChange={setSelectedExperience}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key="level" value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 lg:col-span-4 flex justify-between items-center">
                  <Button
                    variant="outline"
                    className="text-gray-600"
                    onClick={clearFilters}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>

                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Sort by:</span>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="company">Company Name</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Display search results header if searching */}
      {searchParams.get("search") && (
        <div className="container mx-auto max-w-6xl px-4 mb-8">
          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Search Results for:{" "}
                <span className="text-blue-600">
                  &quot;{searchParams.get("search")}&quot;
                </span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {filteredJobs.length} matching jobs found
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-gray-600 hover:bg-gray-50"
            >
              <X className="h-4 w-4 mr-2" />
              Clear search
            </Button>
          </div>
        </div>
      )}

      {/* Job Listings Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              {filteredJobs.length} Jobs Found
            </h2>
            <div className="text-gray-500 text-sm">
              Showing {Math.min(filteredJobs.length, 12)} of{" "}
              {filteredJobs.length} jobs
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
              <p className="text-gray-500 mb-4">
                We couldn&apos;t find any jobs matching your search criteria.
              </p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {sortedJobs.slice(0, 12).map((job) => (
                <Link href={`/jobs/${job.id}`} key={job.id}>
                  <Card
                    className={`hover:shadow-md transition-all duration-200 overflow-hidden border-l-2 ${job.color} hover:-translate-y-0.5 h-full cursor-pointer`}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-sm overflow-hidden bg-gray-100 flex-shrink-0 border">
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs sm:text-sm">
                            {job.company.charAt(0)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base sm:text-lg mb-1 line-clamp-2">
                            {job.title}
                          </h3>
                          <p className="text-gray-600 text-xs sm:text-sm truncate">
                            {job.company}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-3 flex flex-wrap gap-y-1">
                        <div className="flex items-center text-gray-500 text-xs mr-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            {new Date(job.postedDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <Badge className={`text-xs ${job.badgeColor}`}>
                          {job.type}
                        </Badge>
                        <Badge variant="outline" className="bg-gray-50 text-xs">
                          {job.category}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center text-gray-600 text-xs sm:text-sm">
                        <Briefcase className="h-3 w-3 mr-1 text-gray-400" />
                        <span>{job.experience}</span>
                      </div>
                      <div className="mt-2 border-t pt-2 flex justify-between items-center">
                        <div className="font-medium text-gray-800 text-xs sm:text-sm">
                          {job.salary}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-500 text-xs h-6"
                        >
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <div className="flex space-x-2">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <Button variant="outline" className="bg-blue-50">
                1
              </Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Job Categories Section */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse Jobs by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore job opportunities across different industries and sectors
              in Sri Lanka
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories
              .filter((category) => category !== "All Categories")
              .map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center justify-center bg-white hover:bg-blue-50 border"
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowFilters(true);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="font-medium">{category}</span>
                  <span className="text-sm text-gray-500 mt-1">
                    {jobs.filter((job) => job.category === category).length}{" "}
                    jobs
                  </span>
                </Button>
              ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about finding jobs in Sri Lanka
            </p>
          </div>

          <Accordion
            type="single"
            collapsible
            className="bg-white rounded-lg shadow-sm"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                How do I apply for jobs on this platform?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                Click on any job listing to view details and application
                instructions. Most listings will provide direct application
                links or contact information.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                Are these job listings verified?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                Yes, we verify all job postings before they appear on our
                platform to ensure they&apos;re from legitimate employers.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                How often are new jobs added?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                New jobs are added daily. We recommend checking back regularly
                or using our search filters to find the latest opportunities.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                Can I save job listings to view later?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                Currently, you need to create an account to save jobs.
                We&apos;re working on adding this feature for guest users in the
                future.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Dream Job?
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">
            Browse thousands of job opportunities across Sri Lanka and take the
            next step in your career journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-600 hover:bg-blue-50 py-6 px-8 text-lg">
              Browse All Jobs
            </Button>
            <Button
              variant="outline"
              className="text-white border-white hover:bg-blue-700 py-6 px-8 text-lg"
            >
              Upload Your CV
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
