"use client";
import React from "react";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Info,
  Unlock,
  Lock,
  Building,
  Calendar,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface Job {
  id: string;
  title: string;
  company: string;
  logo?: string;
  location: string;
  type: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  contactEmail: string;
  contactPhone: string;
  applicationDeadline: string;
  postedDate: string;
  status?: string;
  color: string; // Add this
  badgeColor: string; // Add this
}

export default function JobDetails() {
  const params = useParams();
  const router = useRouter();
  const jobid = params.jobid as string;

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [unlockProgress, setUnlockProgress] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  // Find the job data based on the jobId
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${jobid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch job");
        }
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error("Error fetching job:", error);
        router.push("/jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [jobid, router]);

  const getDefaultBadgeColor = (type: string) => {
    const badgeColors = {
      "Full-time": "bg-blue-100 text-blue-800",
      "Part-time": "bg-purple-100 text-purple-800",
      Contract: "bg-orange-100 text-orange-800",
      Freelance: "bg-green-100 text-green-800",
    };
    return (
      badgeColors[type as keyof typeof badgeColors] ||
      "bg-gray-100 text-gray-800"
    );
  };

  const getDefaultColor = (type: string) => {
    const colors = {
      "Full-time": "border-blue-300",
      "Part-time": "border-purple-300",
      Contract: "border-orange-300",
      Freelance: "border-green-300",
    };
    return colors[type as keyof typeof colors] || "border-gray-300";
  };
  // If job not found, redirect to jobs page
  useEffect(() => {
    if (!isLoading && !job) {
      router.push("/jobs");
    }
  }, [job, isLoading, router]);

  // Handle unlock button click
  const handleUnlock = () => {
    if (isUnlocked) {
      // If already unlocked, reset the state
      setUnlockProgress(0);
      setIsUnlocked(false);
      return;
    }

    // Redirect to ad page
    setIsRedirecting(true);

    // Choose which ad link to open based on progress
    if (unlockProgress < 50) {
      // First step - open first ad link
      window.open(
        "https://makeuppillow.com/kvu21nvt2m?key=33e57387d79ee904e728b08a78a0c869",
        "_blank"
      );

      // Start progress if not already visited
      if (unlockProgress === 0) {
        setUnlockProgress(50);
      }
    } else {
      // Second step - open second ad link
      window.open(
        "https://makeuppillow.com/k1x8339fbu?key=8819098d37d8511ca8efcd5d5e92e07b",
        "_blank"
      );

      // Complete the progress after second ad visit
      setUnlockProgress(100);
      setTimeout(() => {
        setIsUnlocked(true);
        // Close the dialog after unlocking
        setTimeout(() => {
          setIsDialogOpen(false);
        }, 1000);
      }, 500);
    }
  };

  // Effect to handle when user returns from ad page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isRedirecting) {
        setIsRedirecting(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isRedirecting]);

  // Prevent dialog from being closed manually before unlocking
  const handleDialogChange = (open: boolean) => {
    if (!isUnlocked) {
      // Keep dialog open if not unlocked
      setIsDialogOpen(true);
    } else {
      setIsDialogOpen(open);
    }
  };

  if (isLoading || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  return (
    <div
      className={`min-h-screen bg-gray-50 py-12 ${
        isDialogOpen ? "blur-sm" : ""
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Button>
        </div>

        {/* Job Details Card */}
        <Card
          className={`border-t-4 ${
            job.color ? job.color.split(" ")[0] : getDefaultColor(job.type)
          }`}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  {job.title}
                  {isUnlocked && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  {job.company} • {job.location}
                </CardDescription>
              </div>
              <Badge
                className={job.badgeColor || getDefaultBadgeColor(job.type)}
              >
                {job.type}
              </Badge>{" "}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Job Preview - Always visible */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">{job.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">Posted {job.postedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">{job.company}</span>
              </div>
            </div>

            {/* Job Details Content - Only visible after unlocking */}
            {isUnlocked && (
              <div className="border-t pt-6 mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Job Description
                  </h3>
                  <p className="text-gray-700">{job.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Responsibilities
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {job.responsibilities.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {job.requirements.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 p-5 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-blue-800">
                    How to Apply
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <span className="text-blue-800">
                        Email your CV to:{" "}
                        <a
                          href={`mailto:${job.contactEmail}`}
                          className="font-medium underline"
                        >
                          {job.contactEmail}
                        </a>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <span className="text-blue-800">
                        Call for inquiries:{" "}
                        <a
                          href={`tel:${job.contactPhone}`}
                          className="font-medium"
                        >
                          {job.contactPhone}
                        </a>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <span className="text-blue-800">
                        Application Deadline:{" "}
                        {new Date(job.applicationDeadline).toLocaleString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Unlock Dialog - Cannot be closed until unlocked */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              Unlock Job Details
              {isUnlocked ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Lock className="h-5 w-5 text-orange-500" />
              )}
            </DialogTitle>
            <DialogDescription>
              Complete the steps below to view full job information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Unlock Progress</span>
                <span className="font-medium">{unlockProgress}%</span>
              </div>
              <Progress value={unlockProgress} className="h-2" />
            </div>
            {/* Unlock Instructions */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-medium text-blue-900">
                    රැකියා විස්තර අගුළු හැරීමේ උපදෙස්
                  </h4>
                  <p className="text-sm text-blue-700">
                    1. &quot;Unlock Job&quot; බොත්තම ක්ලික් කරන්න
                  </p>
                  <p className="text-sm text-blue-700">
                    2. විවෘත වන පළමු දැන්වීම් පිටුව නරඹන්න
                  </p>
                  <p className="text-sm text-blue-700">
                    3. ආපසු මෙම පිටුවට පැමිණෙන්න
                  </p>
                  <p className="text-sm text-blue-700">
                    4. &quot;Unlock Job&quot; බොත්තම නැවත ක්ලික් කරන්න
                  </p>
                  <p className="text-sm text-blue-700">
                    5. විවෘත වන දෙවන දැන්වීම් පිටුව නරඹන්න
                  </p>
                  <p className="text-sm text-blue-700">
                    6. ආපසු මෙම පිටුවට පැමිණෙන්න
                  </p>
                </div>
              </div>
            </div>
            {/* Status Message */}
            {isUnlocked ? (
              <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-medium text-green-800 mb-1">
                  Job Details Unlocked!
                </h4>
                <p className="text-sm text-green-700">
                  You can now view the complete job details.
                </p>
              </div>
            ) : (
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 text-center">
                <Lock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <h4 className="font-medium text-orange-800 mb-1">
                  {unlockProgress === 0
                    ? "Job Details Locked"
                    : "Step 1 Completed"}
                </h4>
                <p className="text-sm text-orange-700">
                  {unlockProgress === 0
                    ? "Follow the instructions above to unlock the complete job details."
                    : "Please complete Step 2 to fully unlock the job details."}
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleUnlock}
              className={`w-full ${
                isUnlocked
                  ? "bg-orange-500 hover:bg-orange-600"
                  : unlockProgress >= 50
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isUnlocked ? (
                <>
                  <Unlock className="h-4 w-4 mr-2" />
                  Reset Unlock
                </>
              ) : unlockProgress >= 50 ? (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Complete Unlock (Step 2)
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Start Unlock (Step 1)
                </>
              )}
            </Button>
          </DialogFooter>{" "}
        </DialogContent>
      </Dialog>
    </div>
  );
}
