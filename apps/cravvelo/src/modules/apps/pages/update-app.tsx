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

export default function UpdateAppForm({ appId }: UpdateAppProps) {
  const [imageInput, setImageInput] = useState("");
  const [originalSlug, setOriginalSlug] = useState("");
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

  // Image management
  const addImage = () => {
    if (imageInput && z.string().url().safeParse(imageInput).success) {
      const currentImages = form.getValues("images");
      if (!currentImages.includes(imageInput)) {
        form.setValue("images", [...currentImages, imageInput]);
        setImageInput("");
      }
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images");
    form.setValue(
      "images",
      currentImages.filter((_, i) => i !== index)
    );
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
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/logo.png"
                          type="url"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        URL to your app's logo image
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
                        <div className="flex gap-2">
                          <Input
                            placeholder="https://example.com/screenshot.png"
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
                                  {url}
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
                        Add URLs to screenshots or promotional images
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
              disabled={updateAppMutation.isPending}
              className="min-w-[120px]"
            >
              {updateAppMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update App
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
