"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NewJob() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Job form state
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    category: "",
    salary: "",
    experience: "",
    description: "",
    responsibilities: [""],
    requirements: [""],
    contactEmail: "",
    contactPhone: "",
    applicationDeadline: "",
    isRemote: false,
    isUrgent: false,
    isFeatured: false,
  });

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setJobData((prev) => ({ ...prev, [name]: checked }));
  };

  // Handle list item change (responsibilities, requirements)
  const handleListItemChange = (
    listName: "responsibilities" | "requirements",
    index: number,
    value: string
  ) => {
    setJobData((prev) => {
      const newList = [...prev[listName]];
      newList[index] = value;
      return { ...prev, [listName]: newList };
    });
  };

  // Add new list item
  const addListItem = (listName: "responsibilities" | "requirements") => {
    setJobData((prev) => {
      return { ...prev, [listName]: [...prev[listName], ""] };
    });
  };

  // Remove list item
  const removeListItem = (
    listName: "responsibilities" | "requirements",
    index: number
  ) => {
    setJobData((prev) => {
      // Don't remove if it's the only item in the list
      if (prev[listName].length <= 1) {
        const newList = [...prev[listName]];
        newList[0] = "";
        return { ...prev, [listName]: newList };
      }

      // Remove the item at the specified index
      const newList = prev[listName].filter((_, i) => i !== index);
      return { ...prev, [listName]: newList };
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (
        !jobData.title ||
        !jobData.company ||
        !jobData.location ||
        !jobData.type ||
        !jobData.category ||
        !jobData.experience ||
        !jobData.description ||
        !jobData.contactEmail ||
        !jobData.applicationDeadline
      ) {
        throw new Error("Please fill all required fields");
      }

      // Validate date format
      const deadlineDate = new Date(jobData.applicationDeadline + "T00:00:00");
      if (isNaN(deadlineDate.getTime())) {
        throw new Error("Invalid application deadline date");
      }

      // Format the data for API submission
      const formattedData = {
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        type: jobData.type,
        category: jobData.category,
        salary: jobData.salary,
        experience: jobData.experience,
        description: jobData.description,
        responsibilities: jobData.responsibilities.filter(
          (item) => item.trim() !== ""
        ),
        requirements: jobData.requirements.filter((item) => item.trim() !== ""),
        contactEmail: jobData.contactEmail,
        contactPhone: jobData.contactPhone,
        applicationDeadline: deadlineDate.toISOString(),
        isRemote: jobData.isRemote,
        isUrgent: jobData.isUrgent,
        isFeatured: jobData.isFeatured,
      };

      // Send data to the API
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create job");
      }

      // Redirect to jobs list on success
      router.push("/dashboard/jobs");
      router.refresh(); // Ensure the list is updated
    } catch (error) {
      console.error("Error submitting job:", error);
      // You can add toast notification here:
      // toast({
      //   title: "Error",
      //   description: error instanceof Error ? error.message : "Failed to create job",
      //   variant: "destructive",
      // });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Post a New Job</h1>
          <p className="text-gray-500">
            Create a new job listing to attract qualified candidates
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Job Details</TabsTrigger>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="application">Application Info</TabsTrigger>
          </TabsList>

          {/* Job Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the basic details about the job position
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g. Senior Software Engineer"
                      value={jobData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      id="company"
                      name="company"
                      placeholder="e.g. TechLanka Solutions"
                      value={jobData.company}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g. Colombo"
                      value={jobData.location}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Job Type *</Label>
                    <Select
                      value={jobData.type}
                      onValueChange={(value) =>
                        handleSelectChange("type", value)
                      }
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Freelance">Freelance</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={jobData.category}
                      onValueChange={(value) =>
                        handleSelectChange("category", value)
                      }
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Human Resources">
                          Human Resources
                        </SelectItem>
                        <SelectItem value="Customer Service">
                          Customer Service
                        </SelectItem>
                        <SelectItem value="Content">Content</SelectItem>
                        <SelectItem value="Project Management">
                          Project Management
                        </SelectItem>
                        <SelectItem value="Administration">
                          Administration
                        </SelectItem>
                        <SelectItem value="Hospitality">Hospitality</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience Required *</Label>
                    <Select
                      value={jobData.experience}
                      onValueChange={(value) =>
                        handleSelectChange("experience", value)
                      }
                    >
                      <SelectTrigger id="experience">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Entry Level">Entry Level</SelectItem>
                        <SelectItem value="1-2 years">1-2 years</SelectItem>
                        <SelectItem value="2-4 years">2-4 years</SelectItem>
                        <SelectItem value="3-5 years">3-5 years</SelectItem>
                        <SelectItem value="5+ years">5+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input
                    id="salary"
                    name="salary"
                    placeholder="e.g. Rs. 100,000 - Rs. 150,000"
                    value={jobData.salary}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isRemote"
                      checked={jobData.isRemote}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("isRemote", checked as boolean)
                      }
                    />
                    <Label htmlFor="isRemote">This is a remote position</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Description Tab */}
          <TabsContent value="description" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
                <CardDescription>
                  Provide detailed information about the job
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the job role and responsibilities"
                    value={jobData.description}
                    onChange={handleChange}
                    className="min-h-[150px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Responsibilities *</Label>
                  {jobData.responsibilities.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={item}
                        onChange={(e) =>
                          handleListItemChange(
                            "responsibilities",
                            index,
                            e.target.value
                          )
                        }
                        placeholder={`Responsibility ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          removeListItem("responsibilities", index)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addListItem("responsibilities")}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Responsibility
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Requirements *</Label>
                  {jobData.requirements.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={item}
                        onChange={(e) =>
                          handleListItemChange(
                            "requirements",
                            index,
                            e.target.value
                          )
                        }
                        placeholder={`Requirement ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeListItem("requirements", index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addListItem("requirements")}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Requirement
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Application Info Tab */}
          <TabsContent value="application" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Information</CardTitle>
                <CardDescription>
                  Provide details on how candidates can apply
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      placeholder="e.g. careers@company.com"
                      value={jobData.contactEmail}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      placeholder="e.g. +94 11 234 5678"
                      value={jobData.contactPhone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="applicationDeadline">
                    Application Deadline *
                  </Label>
                  <Input
                    id="applicationDeadline"
                    name="applicationDeadline"
                    type="date"
                    value={jobData.applicationDeadline}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2 pt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isUrgent"
                      checked={jobData.isUrgent}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("isUrgent", checked as boolean)
                      }
                    />
                    <Label htmlFor="isUrgent">Mark as Urgent Hiring</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isFeatured"
                      checked={jobData.isFeatured}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("isFeatured", checked as boolean)
                      }
                    />
                    <Label htmlFor="isFeatured">
                      Feature this job (additional fee may apply)
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/jobs")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Save className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Job
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
