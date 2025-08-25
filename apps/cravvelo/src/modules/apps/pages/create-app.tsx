"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Plus, X } from "lucide-react";
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
import { createApp } from "../actions/apps.actions";

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

export default function CreateAppForm({}: CreateAppProps) {
  const [imageInput, setImageInput] = useState("");
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
          return null; // or return the string as-is if you prefer
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
      form.reset();
      // You might want to redirect or show a success message here
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit((data) => createAppMutation.mutate(data))(e);
  };

  return (
    <div className="w-full mx-auto p-4 space-y-6">
      <div className="flex items-center justify-start gap-4">
        <Link href={"/applications"}>
          <Button variant={"outline"}>back</Button>
        </Link>

        <div>
          <h1 className="text-xl font-bold">Create New App</h1>
          <p className="text-muted-foreground mt-2">
            Add a new application to the marketplace
          </p>
        </div>
      </div>

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
              disabled={createAppMutation.isPending}
              className="min-w-[120px]"
              loading={createAppMutation.isPending}
            >
              Create App
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
