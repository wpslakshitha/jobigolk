// app/image-generator/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button"; // Assuming Shadcn/UI setup
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusCircle, XCircle, Download, Loader2 } from "lucide-react"; // Lucide icons
import Image from "next/image"; // For displaying images

interface GeneratedImage {
  id: string; // For key prop
  src: string; // base64 data URL
  title: string; // Original title for download filename
}

export default function ImageGeneratorPage() {
  const [jobTitles, setJobTitles] = useState<string[]>([""]); // Start with one empty title
  const [contactPhone, setContactPhone] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactWebsite, setContactWebsite] = useState<string>("");
  const [bottomText, setBottomText] = useState<string>(
    "For more job opportunities, visit our website!"
  );
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (index: number, value: string) => {
    const newTitles = [...jobTitles];
    newTitles[index] = value;
    setJobTitles(newTitles);
  };

  const addTitleField = () => {
    setJobTitles([...jobTitles, ""]);
  };

  const removeTitleField = (index: number) => {
    if (jobTitles.length > 1) {
      const newTitles = jobTitles.filter((_, i) => i !== index);
      setJobTitles(newTitles);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    const titlesToSubmit = jobTitles.filter((title) => title.trim() !== "");
    if (titlesToSubmit.length === 0) {
      setError("Please enter at least one job title.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/generate-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitles: titlesToSubmit,
          contactPhone,
          contactEmail,
          contactWebsite,
          bottomText,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate images");
      }

      const data = await response.json();
      if (data.images && data.images.length > 0) {
        const imagesWithIds: GeneratedImage[] = data.images.map(
          (src: string, index: number) => ({
            id: `img-${Date.now()}-${index}`,
            src: src,
            title: titlesToSubmit[index] || `generated-image-${index + 1}`,
          })
        );
        setGeneratedImages(imagesWithIds);
      } else {
        setError("No images were generated.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = (imageSrc: string, filename: string) => {
    const link = document.createElement("a");
    link.href = imageSrc;
    // Sanitize filename
    const safeFilename = filename
      .replace(/[^a-z0-9_-\s]/gi, "_")
      .replace(/\s+/g, "-")
      .toLowerCase();
    link.download = `${safeFilename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllImages = async () => {
    if (generatedImages.length === 0) return;

    // For simplicity, triggering individual downloads.
    // For many images, zipping them on server-side would be better.
    for (let i = 0; i < generatedImages.length; i++) {
      downloadImage(generatedImages[i].src, generatedImages[i].title);
      // Add a small delay if needed to prevent browser blocking popups
      if (generatedImages.length > 5 && i < generatedImages.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Job Post Image Generator
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-card p-6 rounded-lg shadow-md"
      >
        <div>
          <Label className="text-lg font-semibold mb-2 block">Job Titles</Label>
          {jobTitles.map((title, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <Input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(index, e.target.value)}
                placeholder={`Job Title ${index + 1}`}
                className="flex-grow"
              />
              {jobTitles.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTitleField(index)}
                >
                  <XCircle className="h-5 w-5 text-destructive" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addTitleField}
            className="mt-2"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Add Another Title
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="contactPhone" className="font-semibold">
              Contact Phone
            </Label>
            <Input
              id="contactPhone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="e.g., +94 XX XXX XXXX"
            />
          </div>
          <div>
            <Label htmlFor="contactEmail" className="font-semibold">
              Contact Email
            </Label>
            <Input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="e.g., info@example.com"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="contactWebsite" className="font-semibold">
            Contact Website / Page URL
          </Label>
          <Input
            id="contactWebsite"
            value={contactWebsite}
            onChange={(e) => setContactWebsite(e.target.value)}
            placeholder="e.g., www.example.com or fb.com/yourpage"
          />
        </div>
        <div>
          <Label htmlFor="bottomText" className="font-semibold">
            Footer Text
          </Label>
          <Textarea
            id="bottomText"
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
            placeholder="e.g., For more jobs, visit..."
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
            </>
          ) : (
            "Generate Images"
          )}
        </Button>
      </form>

      {error && <p className="text-destructive mt-4 text-center">{error}</p>}

      {generatedImages.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">
              Generated Images ({generatedImages.length})
            </h2>
            <Button
              onClick={downloadAllImages}
              variant="secondary"
              disabled={isLoading}
            >
              <Download className="h-4 w-4 mr-2" /> Download All
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {generatedImages.map((image) => (
              <div
                key={image.id}
                className="border rounded-lg overflow-hidden shadow-sm bg-card"
              >
                <div
                  className="relative w-full"
                  style={{ paddingBottom: "100%" }}
                >
                  {" "}
                  {/* Aspect ratio 1:1 */}
                  <Image
                    src={image.src}
                    alt={image.title || "Generated Image"}
                    layout="fill"
                    objectFit="contain" // or "cover"
                  />
                </div>
                <div className="p-2 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadImage(image.src, image.title)}
                  >
                    <Download className="h-3 w-3 mr-1" /> Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
