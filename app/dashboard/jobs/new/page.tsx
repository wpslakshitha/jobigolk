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
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";

export default function NewJob() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rawPastedText, setRawPastedText] = useState("");

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

  // Inside NewJob component, before the return statement

  const handleParseAndFillPastedText = () => {
    if (!rawPastedText.trim()) {
      alert("Please paste JSON data into the text area.");
      return;
    }

    const text = rawPastedText; // Changed from let to const
    const newJobData = { ...jobData }; // Changed from let to const

    try {
      const jsonData = JSON.parse(text);

      // Basic check to see if it's a somewhat plausible job object
      if (
        jsonData &&
        typeof jsonData === "object" &&
        !Array.isArray(jsonData)
      ) {
        console.log("Attempting to fill from JSON:", jsonData);

        // Map JSON fields to your jobData structure
        // Ensure to only update fields that are present in the JSON
        // and match your form's state structure.

        if (jsonData.title !== undefined)
          newJobData.title = String(jsonData.title);
        if (jsonData.company !== undefined)
          newJobData.company = String(jsonData.company);
        if (jsonData.location !== undefined)
          newJobData.location = String(jsonData.location);

        if (jsonData.type !== undefined) {
          const jsonType = String(jsonData.type).trim();
          const availableTypes = [
            "Full-time",
            "Part-time",
            "Contract",
            "Freelance",
            "Internship",
          ];

          // If type doesn't match, add it to the list
          if (
            !availableTypes.some(
              (t) => t.toLowerCase() === jsonType.toLowerCase()
            )
          ) {
            availableTypes.push(jsonType);
          }
          newJobData.type = jsonType;
        }

        if (jsonData.category !== undefined) {
          const jsonCategory = String(jsonData.category).trim();
          const availableCategories = [
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

          // If category doesn't match, add it to the list
          if (
            !availableCategories.some(
              (cat) => cat.toLowerCase() === jsonCategory.toLowerCase()
            )
          ) {
            availableCategories.push(jsonCategory);
          }
          newJobData.category = jsonCategory;
        }

        if (jsonData.experience !== undefined) {
          const jsonExperience = String(jsonData.experience).trim();
          const availableExperiences = [
            "Entry Level",
            "1-2 years",
            "2-4 years",
            "3-5 years",
            "5+ years",
          ];

          // If experience doesn't match, add it to the list
          if (
            !availableExperiences.some(
              (exp) => exp.toLowerCase() === jsonExperience.toLowerCase()
            )
          ) {
            availableExperiences.push(jsonExperience);
          }
          newJobData.experience = jsonExperience;
        }

        if (jsonData.description !== undefined)
          newJobData.description = String(jsonData.description);

        const parseArrayOrString = (field: unknown): string[] => {
          if (Array.isArray(field)) {
            const arr = field.map(String).filter((s) => s.trim() !== "");
            return arr.length > 0 ? arr : [""];
          }
          if (typeof field === "string" && field.trim() !== "")
            return [field.trim()];
          return [""];
        };

        if (jsonData.responsibilities !== undefined) {
          newJobData.responsibilities = parseArrayOrString(
            jsonData.responsibilities
          );
        }
        if (jsonData.requirements !== undefined) {
          newJobData.requirements = parseArrayOrString(jsonData.requirements);
        }

        if (jsonData.contactEmail !== undefined)
          newJobData.contactEmail = String(jsonData.contactEmail);
        if (jsonData.contactPhone !== undefined)
          newJobData.contactPhone = String(jsonData.contactPhone);

        if (jsonData.applicationDeadline !== undefined) {
          const deadline = new Date(jsonData.applicationDeadline); // Expects YYYY-MM-DD or parsable date string
          if (!isNaN(deadline.getTime())) {
            newJobData.applicationDeadline = deadline
              .toISOString()
              .split("T")[0];
          } else {
            newJobData.applicationDeadline = ""; // Clear if invalid date
          }
        }

        if (
          jsonData.isRemote !== undefined &&
          typeof jsonData.isRemote === "boolean"
        ) {
          newJobData.isRemote = jsonData.isRemote;
        }
        if (
          jsonData.isUrgent !== undefined &&
          typeof jsonData.isUrgent === "boolean"
        ) {
          newJobData.isUrgent = jsonData.isUrgent;
        }
        if (
          jsonData.isFeatured !== undefined &&
          typeof jsonData.isFeatured === "boolean"
        ) {
          newJobData.isFeatured = jsonData.isFeatured;
        }

        setJobData(newJobData);
        console.log("Successfully filled form from JSON:", newJobData);
        alert("Form fields updated successfully from JSON data!"); // Or use a toast
      } else {
        // Parsed JSON, but it doesn't look like a job object (e.g., it's an array or empty object)
        console.error(
          "Parsed JSON does not seem to be a valid job object structure."
        );
        alert(
          "The pasted JSON data does not have the expected job structure. Please check the format."
        );
      }
    } catch (e) {
      console.error("Error parsing pasted text as JSON:", e);
      alert(
        "The pasted text is not valid JSON. Please paste data in JSON format only."
      );
    } finally {
      setRawPastedText("");
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

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quick Fill via Paste</CardTitle>
          <CardDescription>
            Copy job details from another source and paste below to attempt
            auto-filling the form.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="rawPastedText">Paste Job Details Here</Label>
            <Textarea
              id="rawPastedText"
              value={rawPastedText}
              onChange={(e) => setRawPastedText(e.target.value)}
              placeholder="Paste the full job description text here..."
              className="min-h-[150px]"
            />
          </div>
          <Button type="button" onClick={handleParseAndFillPastedText}>
            Parse and Fill Form
          </Button>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
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
                <Label htmlFor="type">Job Type</Label>
                <Input
                  id="type"
                  name="type"
                  placeholder="Enter job type"
                  value={jobData.type}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="Enter category"
                  value={jobData.category}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience Required</Label>
                <Input
                  id="experience"
                  name="experience"
                  placeholder="Enter experience level"
                  value={jobData.experience}
                  onChange={handleChange}
                />
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

        {/* Description Tab */}
        <Card className="mt-4">
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
                    onClick={() => removeListItem("responsibilities", index)}
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

        {/* Application Info Tab */}
        <Card className="mt-4">
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
