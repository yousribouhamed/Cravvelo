"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Plus, X, Loader2 } from "lucide-react";
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
import Link from "next/link";
import { updateApp, getAppById } from "../actions/apps.actions";

// Import the same upload functions from your create form
import { uploadImageToS3, deleteImageFromS3 } from "@/modules/aws/s3";

const updateAppSchema = z.object({
  id: z.string().min(1, "App ID is required"),
  name: z.string().min(1, "App name is required").max(100, "App name too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  shortDesc: z
    .string()
    .min(1, "Short description is required")
    .max(200, "Short description too long"),
  longDesc: z.string().optional(),
  logoUrl: z.string().url("Invalid URL").or(z.literal("")).optional(),
  images: z.array(z.string().url()).default([]),
  category: z.string().optional(),
  configSchema: z.string().optional(),
  uiInjection: z.string().optional(),
});

type UpdateAppForm = z.infer<typeof updateAppSchema>;

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

interface UpdateAppProps {
  appId: string;
}

interface UploadedImage {
  url: string;
  fileName: string;
}

export default function UpdateAppForm({ appId }: UpdateAppProps) {
  const [imageInput, setImageInput] = useState("");
  const [originalSlug, setOriginalSlug] = useState("");

  // File upload states - same as create form
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoFileName, setLogoFileName] = useState<string>("");

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const queryClient = useQueryClient();

  const form = useForm<UpdateAppForm>({
    resolver: zodResolver(updateAppSchema),
    defaultValues: {
      id: appId,
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

  // Fetch existing app data
  const {
    data: app,
    isLoading: isLoadingApp,
    error: appError,
  } = useQuery({
    queryKey: ["app", appId],
    queryFn: async () => {
      const { data } = await getAppById({ id: appId });
      return data;
    },
    enabled: !!appId,
  });

  // Populate form when app data is loaded
  useEffect(() => {
    if (app) {
      setOriginalSlug(app.slug);

      // Helper function to safely parse JSON strings
      const safeJsonStringify = (value: any) => {
        if (value === null || value === undefined) return "";
        if (typeof value === "string") {
          try {
            // Try to parse it first to validate it's valid JSON
            JSON.parse(value);
            return value;
          } catch {
            // If it's not valid JSON, return as-is (might be plain text)
            return value;
          }
        }
        return JSON.stringify(value, null, 2);
      };

      // Initialize uploaded images state with existing images
      const existingImages = (app.images || []).map(
        (url: string, index: number) => ({
          url,
          fileName: `existing-image-${index}`, // We don't have the original filename, so we use a placeholder
        })
      );
      setUploadedImages(existingImages);

      form.reset({
        id: appId,
        name: app.name,
        slug: app.slug,
        shortDesc: app.shortDesc,
        longDesc: safeJsonStringify(app.longDesc),
        logoUrl: app.logoUrl || "",
        images: app.images || [],
        category: app.category || "",
        configSchema: safeJsonStringify(app.configSchema),
        uiInjection: safeJsonStringify(app.uiInjection),
      });
    }
  }, [app, appId, form]);

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
    // Only auto-generate slug if it hasn't been manually changed from the original
    const currentSlug = form.getValues("slug");
    if (name && (currentSlug === originalSlug || !currentSlug)) {
      form.setValue("slug", generateSlug(name));
    }
  };

  // Logo upload handler - same as create form
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

  // Remove logo - same as create form
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

  // Image upload handler - same as create form
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

  // Remove image - updated to handle both uploaded and existing images
  const removeImage = async (index: number) => {
    const imageToRemove = uploadedImages[index];

    // Only attempt to delete from S3 if it's not an existing image (has a real fileName)
    if (
      imageToRemove?.fileName &&
      !imageToRemove.fileName.startsWith("existing-image-")
    ) {
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

  // Legacy image management (URL input) - keeping this for backward compatibility
  const addImage = () => {
    if (imageInput && z.string().url().safeParse(imageInput).success) {
      const currentImages = form.getValues("images");
      if (!currentImages.includes(imageInput)) {
        const newUploadedImage = {
          url: imageInput,
          fileName: `url-input-${Date.now()}`, // Placeholder filename for URL inputs
        };
        const newUploadedImages = [...uploadedImages, newUploadedImage];
        const newImageUrls = [...currentImages, imageInput];

        setUploadedImages(newUploadedImages);
        form.setValue("images", newImageUrls);
        setImageInput("");
      }
    }
  };

  // Update app mutation
  const updateAppMutation = useMutation({
    mutationFn: async (data: UpdateAppForm) => {
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
        id: data.id,
        name: data.name,
        slug: data.slug,
        shortDesc: data.shortDesc,
        longDesc: safeJsonParse(data.longDesc),
        logoUrl: data.logoUrl || null,
        images: data.images || [],
        category: data.category || null,
        configSchema: safeJsonParse(data.configSchema),
        uiInjection: safeJsonParse(data.uiInjection),
      };

      console.log("Update payload being sent:", payload);

      await updateApp(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      queryClient.invalidateQueries({ queryKey: ["app", appId] });
      // You might want to redirect or show a success message here
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit((data) => updateAppMutation.mutate(data))(e);
  };

  if (isLoadingApp) {
    return (
      <div className="w-full mx-auto p-4 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading app data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (appError) {
    return (
      <div className="w-full mx-auto p-4 space-y-6">
        <Alert variant="destructive">
          <AlertDescription>
            {appError.message || "Failed to load app data"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
                        value={field.value}
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

            {/* Media - Updated with file upload functionality */}
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

                        {/* Alternative: Manual URL input */}
                        <div className="pt-2 border-t">
                          <Input
                            placeholder="Or enter logo URL manually: https://example.com/logo.png"
                            type="url"
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </div>
                      </div>
                      <FormDescription>
                        Upload your app's logo (JPEG/PNG, max 10MB) or enter URL
                        manually
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

                        {/* Alternative: Manual URL input */}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Or add image URL: https://example.com/screenshot.png"
                            value={imageInput}
                            onChange={(e) => setImageInput(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              (e.preventDefault(), addImage())
                            }
                          />
                          <Button
                            type="button"
                            onClick={addImage}
                            size="icon"
                            variant="outline"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
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
                        10MB each) or add URLs manually
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
                      {field.value?.length || 0}/200 characters
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

          {/* Success Message */}
          {updateAppMutation.isSuccess && (
            <Alert>
              <AlertDescription>App updated successfully!</AlertDescription>
            </Alert>
          )}

          {/* Error Display */}
          {updateAppMutation.error && (
            <Alert variant="destructive">
              <AlertDescription>
                {updateAppMutation.error.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Link href={"/applications"}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              onClick={handleSubmit}
              disabled={
                updateAppMutation.isPending || logoUploading || imageUploading
              }
              className="min-w-[120px]"
            >
              {updateAppMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                "Update App"
              )}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
