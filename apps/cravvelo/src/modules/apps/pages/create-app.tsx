"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createApp } from "../actions/apps.actions";

import { uploadImageToS3, deleteImageFromS3 } from "@/modules/aws/s3";

const createAppSchema = z.object({
  name: z.string(),
  slug: z.string(),
  shortDesc: z.string(),
  longDesc: z.string().optional(),
  logoUrl: z.string(),
  images: z.array(z.string().url()).default([]),
  category: z.string().optional(),
  configSchema: z.string().optional(),
  uiInjection: z.string().optional(),
});

type CreateAppForm = z.infer<typeof createAppSchema>;

const CATEGORIES = [
  "Productivity",
  "Communication",
  "E-commerce",
  "Analytics",
  "Marketing",
  "Social",
  "Development",
  "Design",
  "System",
  "Other",
];

interface CreateAppProps {}

interface UploadedImage {
  url: string;
  fileName: string;
}

export default function CreateAppForm({}: CreateAppProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoFileName, setLogoFileName] = useState<string>("");

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const queryClient = useQueryClient();

  const form = useForm<CreateAppForm>({
    resolver: zodResolver(createAppSchema),
    defaultValues: {
      name: "",
      slug: "",
      shortDesc: "",
      longDesc: "",
      logoUrl: "",
      images: [],
      category: "",
      configSchema: "",
      uiInjection: "",
    },
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (name: string) => {
    form.setValue("name", name);
    if (name && !form.getValues("slug")) {
      form.setValue("slug", generateSlug(name));
    }
  };

  // Logo upload handler
  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload JPEG or PNG images only.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size too large. Maximum size is 10MB.");
      return;
    }

    setLogoFile(file);
    setLogoUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadImageToS3(formData);

      if (result.success && result.url && result.fileName) {
        form.setValue("logoUrl", result.url);
        setLogoFileName(result.fileName);
      } else {
        alert(result.error || "Failed to upload logo");
      }
    } catch (error) {
      console.error("Logo upload error:", error);
      alert("Failed to upload logo. Please try again.");
    } finally {
      setLogoUploading(false);
    }
  };

  // Remove logo
  const removeLogo = async () => {
    if (logoFileName) {
      try {
        await deleteImageFromS3(logoFileName);
      } catch (error) {
        console.error("Failed to delete logo from S3:", error);
      }
    }

    setLogoFile(null);
    setLogoFileName("");
    form.setValue("logoUrl", "");
  };

  // Image upload handler
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate each file
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const invalidFiles = files.filter(
      (file) =>
        !allowedTypes.includes(file.type) || file.size > 10 * 1024 * 1024
    );

    if (invalidFiles.length > 0) {
      alert(
        "Some files are invalid. Please upload JPEG or PNG images under 10MB."
      );
      return;
    }

    setImageUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const result = await uploadImageToS3(formData);
        if (result.success && result.url && result.fileName) {
          return { url: result.url, fileName: result.fileName };
        }
        throw new Error(result.error || "Upload failed");
      });

      const results = await Promise.all(uploadPromises);
      const newUploadedImages = [...uploadedImages, ...results];
      const newImageUrls = newUploadedImages.map((img) => img.url);

      setUploadedImages(newUploadedImages);
      form.setValue("images", newImageUrls);
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Failed to upload some images. Please try again.");
    } finally {
      setImageUploading(false);
      // Reset file input
      event.target.value = "";
    }
  };

  // Remove image
  const removeImage = async (index: number) => {
    const imageToRemove = uploadedImages[index];

    if (imageToRemove?.fileName) {
      try {
        await deleteImageFromS3(imageToRemove.fileName);
      } catch (error) {
        console.error("Failed to delete image from S3:", error);
      }
    }

    const newUploadedImages = uploadedImages.filter((_, i) => i !== index);
    const newImageUrls = newUploadedImages.map((img) => img.url);

    setUploadedImages(newUploadedImages);
    form.setValue("images", newImageUrls);
  };

  // Create app mutation
  const createAppMutation = useMutation({
    mutationFn: async (data: CreateAppForm) => {
      // Helper function to safely parse JSON or return null
      const safeJsonParse = (jsonString: string | undefined) => {
        if (!jsonString || jsonString.trim() === "") return null;
        try {
          return JSON.parse(jsonString);
        } catch (error) {
          console.warn("Invalid JSON provided:", error);
          return null;
        }
      };

      const payload = {
        name: data.name,
        slug: data.slug,
        shortDesc: data.shortDesc,
        longDesc: safeJsonParse(data.longDesc),
        logoUrl: data.logoUrl || undefined,
        images: data.images || [],
        category: data.category || undefined,
        configSchema: safeJsonParse(data.configSchema),
        uiInjection: safeJsonParse(data.uiInjection),
      };

      console.log("Payload being sent:", payload);

      await createApp(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
    },

    onError: (error) => {
      console.log("something went wrong");
      console.log(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit((data) => createAppMutation.mutate(data))(e);
  };

  return (
    <div className="w-full mx-auto p-4 space-y-6">
      <Form {...form}>
        <div onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>App Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter app name"
                          {...field}
                          onChange={(e) => handleNameChange(e.target.value)}
                        />
                      </FormControl>
                      <FormDescription>
                        The display name of your application
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Slug *</FormLabel>
                      <FormControl>
                        <Input placeholder="app-slug" {...field} />
                      </FormControl>
                      <FormDescription>
                        Unique identifier for the app URL (lowercase, numbers,
                        hyphens only)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Help users find your app by selecting the most relevant
                        category
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Media */}
            <Card>
              <CardHeader>
                <CardTitle>Media & Assets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo Upload</FormLabel>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png"
                              onChange={handleLogoUpload}
                              disabled={logoUploading}
                            />
                          </label>

                          {logoFile && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={removeLogo}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        {field.value && (
                          <div className="flex items-center gap-3 p-3 bg-muted rounded">
                            <img
                              src={field.value}
                              alt="Logo preview"
                              className="w-12 h-12 object-cover rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/api/placeholder/48/48";
                              }}
                            />
                            <span className="text-sm text-muted-foreground">
                              Logo uploaded successfully
                            </span>
                          </div>
                        )}
                      </div>
                      <FormDescription>
                        Upload your app's logo (JPEG/PNG, max 10MB)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Screenshots & Images</FormLabel>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png"
                              multiple
                              onChange={handleImageUpload}
                              disabled={imageUploading}
                            />
                          </label>
                        </div>

                        {field.value.length > 0 && (
                          <div className="space-y-2">
                            {field.value.map((url, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 p-2 bg-muted rounded"
                              >
                                <img
                                  src={url}
                                  alt={`Screenshot ${index + 1}`}
                                  className="w-12 h-12 object-cover rounded"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "/api/placeholder/48/48";
                                  }}
                                />
                                <span className="flex-1 text-sm truncate">
                                  Image {index + 1}
                                </span>
                                <Button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  size="icon"
                                  variant="ghost"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <FormDescription>
                        Upload screenshots or promotional images (JPEG/PNG, max
                        10MB each)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Descriptions */}
          <Card>
            <CardHeader>
              <CardTitle>Descriptions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="shortDesc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of your app..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A concise description shown in app listings (max 200
                      characters)
                    </FormDescription>
                    <div className="text-sm text-muted-foreground">
                      {field.value.length}/200 characters
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longDesc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed description in JSON format..."
                        className="min-h-[120px] font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Rich text content in JSON format for the app detail page
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="configSchema"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Configuration Schema</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='{"type": "object", "properties": {...}}'
                        className="min-h-[100px] font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      JSON schema defining the app's configuration options
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="uiInjection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UI Injection Rules</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='{"inject": {...}, "rules": {...}}'
                        className="min-h-[100px] font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      JSON rules for UI injection and customization
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Error Display */}
          {createAppMutation.error && (
            <Alert variant="destructive">
              <AlertDescription>
                {createAppMutation.error.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                createAppMutation.isPending || logoUploading || imageUploading
              }
              className="min-w-[120px]"
            >
              {createAppMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Create App"
              )}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
