"use client";

import React, { ChangeEvent, useRef, type FC } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { Input } from "@ui/components/ui/input";
import { Textarea } from "@ui/components/ui/textarea";
import { Button } from "@ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import { computeSHA256 } from "@/src/lib/utils";
import { maketoast } from "@/src/components/toasts";
import { trpc } from "@/src/app/_trpc/client";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  Calendar,
  Mail,
  Phone,
  Shield,
  Clock,
  Camera,
  Edit,
  Save,
  X,
} from "lucide-react";
import { formSchema } from "./validators";
import { ProfileFormProps } from "./types";

// Animated Status Indicator Component
const StatusIndicator: FC<{
  active: boolean;
  label: string;
  description: string;
}> = ({ active, label, description }) => (
  <div className="text-center">
    <div className="flex items-center justify-center mb-2">
      <div className="relative">
        <div
          className={`w-2 h-2 rounded-full ${
            active ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          {active && (
            <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></div>
          )}
        </div>
      </div>
      <span
        className={`mr-2 text-sm font-medium ${
          active ? "text-green-600" : "text-gray-500"
        }`}
      >
        {label}
      </span>
    </div>
    <p className="text-xs text-gray-600">{description}</p>
  </div>
);

const UserProfileForm: FC<ProfileFormProps> = ({ enhancedUserData }) => {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [editMode, setEditMode] = React.useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        maketoast.error("حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        maketoast.error("نوع الملف غير مدعوم. يرجى اختيار صورة");
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPreviewUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name:
        enhancedUserData?.fullName || enhancedUserData?.user_name || "",
      bio: enhancedUserData?.user_bio || "",
      email:
        enhancedUserData?.primaryEmailAddress?.emailAddress ||
        enhancedUserData?.support_email ||
        "",
      phone:
        enhancedUserData?.primaryPhoneNumber?.phoneNumber ||
        enhancedUserData?.phone?.toString() ||
        "",
      username: enhancedUserData?.username || "",
      website: enhancedUserData?.website || "",
      location: enhancedUserData?.location || "",
      occupation: enhancedUserData?.occupation || "",
    },
  });

  const accountMutation = trpc.update_user_profile.useMutation({
    onSuccess: () => {
      maketoast.success("تم تحديث الملف الشخصي بنجاح");
      setEditMode(false);
      // Refresh the page to show updated data
      window.location.reload();
    },
    onError: (error) => {
      console.error("Account update error:", error);
      maketoast.error("فشل في تحديث الملف الشخصي");
    },
  });

  const signedUrlMutation = trpc.getSignedUrl.useMutation();

  // Helper function to filter out empty values
  const filterEmptyValues = (obj: any) => {
    const filtered: any = {};
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (value !== "" && value !== null && value !== undefined) {
        filtered[key] = value;
      }
    });
    return filtered;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isClerkLoaded || !clerkUser) {
      maketoast.error("جاري تحميل بيانات المستخدم...");
      return;
    }

    try {
      setLoading(true);

      // Filter out empty values to only send fields with actual data
      const filteredValues = filterEmptyValues(values);

      // Check if there's at least one field to update
      if (Object.keys(filteredValues).length === 0 && !selectedFile) {
        maketoast.error("لم يتم إجراء أي تغييرات");
        setLoading(false);
        return;
      }

      let avatarUrl = "";

      // Handle avatar upload
      if (selectedFile) {
        const checksum = await computeSHA256(selectedFile);
        const result = await signedUrlMutation.mutateAsync({
          checksum,
          fileSize: selectedFile.size,
          fileType: selectedFile.type,
        });

        if (!result?.success?.url) {
          throw new Error("فشل في الحصول على رابط التحميل");
        }

        await fetch(result.success.url, {
          method: "PUT",
          body: selectedFile,
          headers: {
            "Content-Type": selectedFile.type,
          },
        });

        avatarUrl = result.success.url.split("?")[0];
      }

      // Prepare Clerk updates - only update firstName and username
      // Note: We'll handle lastName in the account update to avoid Clerk API issues
      const clerkUpdates: {
        firstName?: string;
        username?: string;
      } = {};

      // Update Clerk firstName if changed (extract from full_name)
      if (filteredValues.full_name) {
        const nameParts = filteredValues.full_name.trim().split(/\s+/).filter(Boolean);
        const newFirstName = nameParts[0] || "";
        
        // Only update firstName if it's different and not empty
        if (newFirstName && newFirstName !== (clerkUser.firstName || "")) {
          clerkUpdates.firstName = newFirstName;
        }
      }

      // Update username if changed
      if (filteredValues.username && filteredValues.username !== (enhancedUserData.username || "")) {
        clerkUpdates.username = filteredValues.username;
      }

      // Update Clerk user - only if there are actual changes
      if (Object.keys(clerkUpdates).length > 0) {
        try {
          await clerkUser.update(clerkUpdates);
        } catch (clerkError: any) {
          console.error("Clerk update error:", clerkError);
          // Log the error details for debugging
          if (clerkError?.errors) {
            console.error("Clerk error details:", clerkError.errors);
          }
          // Continue with account update even if Clerk update fails
          maketoast.error("فشل في تحديث بيانات Clerk، سيتم تحديث بيانات الحساب فقط");
        }
      }

      // Build account update object with only non-empty values
      const updateData: any = {};

      // Add avatar if uploaded
      if (avatarUrl) {
        updateData.avatarUrl = avatarUrl;
      }

      // Map form fields to API fields, only if they have values
      if (filteredValues.full_name) {
        updateData.user_name = filteredValues.full_name;
        // Also update firstName and lastName in account
        const nameParts = filteredValues.full_name.trim().split(" ");
        if (nameParts.length > 0) {
          updateData.firstName = nameParts[0];
          if (nameParts.length > 1) {
            updateData.lastName = nameParts.slice(1).join(" ");
          }
        }
      }

      if (filteredValues.bio) {
        updateData.user_bio = filteredValues.bio;
      }

      if (filteredValues.email) {
        updateData.support_email = filteredValues.email;
      }

      if (filteredValues.phone) {
        // Remove non-numeric characters and send as number (will be converted to string in tRPC route)
        const cleanedPhone = filteredValues.phone.replace(/\D/g, "");
        if (cleanedPhone) {
          const phoneNumber = Number(cleanedPhone);
          if (!isNaN(phoneNumber)) {
            updateData.phoneNumber = phoneNumber;
          }
        }
      }

      if (filteredValues.website) {
        updateData.website = filteredValues.website;
      }

      if (filteredValues.location) {
        // Store location in city or country field
        updateData.city = filteredValues.location;
      }

      if (filteredValues.occupation) {
        updateData.profession = filteredValues.occupation;
      }

      // Only proceed if there's something to update
      if (Object.keys(updateData).length > 0) {
        await accountMutation.mutateAsync(updateData);
      } else if (Object.keys(clerkUpdates).length > 0) {
        // If only Clerk updates were made, show success
        maketoast.success("تم تحديث الملف الشخصي بنجاح");
        setEditMode(false);
        window.location.reload();
      } else {
        maketoast.error("لم يتم إجراء أي تغييرات");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      maketoast.error("حدث خطأ أثناء تحديث الملف الشخصي");
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    form.reset();
    setSelectedFile(null);
    setPreviewUrl(null);
    setEditMode(false);
  };

  return (
    <div className="w-full mx-auto space-y-6 mt-4">
      {/* Profile Header Card */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="p-8">
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <div className="relative">
              <Avatar className="w-24 h-24 ring-4 ring-white/20">
                <AvatarImage
                  src={
                    previewUrl ||
                    enhancedUserData?.avatarUrl ||
                    enhancedUserData?.imageUrl ||
                    ""
                  }
                  alt={enhancedUserData?.fullName || "Profile"}
                />
                <AvatarFallback className="bg-white/20 text-white text-xl">
                  {enhancedUserData?.initials || "AB"}
                </AvatarFallback>
              </Avatar>
              {editMode && (
                <Button
                  type="button"
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-white text-gray-600 hover:bg-gray-100"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {enhancedUserData?.fullName || "مستخدم"}
              </h1>
              <p className="text-white/80 mb-2">
                {enhancedUserData?.user_bio || "لا توجد سيرة ذاتية"}
              </p>
              <div className="flex items-center gap-4 text-sm text-white/70">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    انضم في{" "}
                    {format(
                      new Date(enhancedUserData?.createdAt || new Date()),
                      "PPP",
                      { locale: ar }
                    )}
                  </span>
                </div>
                {enhancedUserData?.lastSignInAt && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      آخر دخول{" "}
                      {format(
                        new Date(enhancedUserData.lastSignInAt),
                        "PPP",
                        {
                          locale: ar,
                        }
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!editMode ? (
                <Button
                  onClick={() => setEditMode(true)}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  تعديل الملف الشخصي
                </Button>
              ) : (
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4 mr-2" />
                  إلغاء
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Security Status with Animated Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            حالة الأمان
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatusIndicator
              active={enhancedUserData?.twoFactorEnabled}
              label={
                enhancedUserData?.twoFactorEnabled ? "مفعل" : "غير مفعل"
              }
              description="المصادقة الثنائية"
            />
            <StatusIndicator
              active={!enhancedUserData?.banned}
              label={enhancedUserData?.banned ? "محظور" : "نشط"}
              description="حالة الحساب"
            />
            <StatusIndicator
              active={!enhancedUserData?.locked}
              label={enhancedUserData?.locked ? "مقفل" : "مفتوح"}
              description="حالة الوصول"
            />
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>المعلومات الشخصية</CardTitle>
          <CardDescription>
            قم بتحديث معلوماتك الشخصية وإعدادات الملف الشخصي. يمكنك تعديل حقل
            واحد أو أكثر.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* @ts-expect-error - Type mismatch due to multiple react-hook-form versions */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control as any}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم الكامل</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل اسمك الكامل"
                          {...field}
                          disabled={!editMode}
                        />
                      </FormControl>
                      <FormDescription>
                        اسمك كما سيظهر للمستخدمين الآخرين
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم المستخدم</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="اسم المستخدم الفريد"
                          {...field}
                          disabled={!editMode}
                        />
                      </FormControl>
                      <FormDescription>
                        اسم المستخدم الفريد الخاص بك
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control as any}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        البريد الإلكتروني
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@email.com"
                          {...field}
                          disabled={!editMode}
                        />
                      </FormControl>
                      <FormDescription>
                        البريد الإلكتروني للتواصل والإشعارات
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        رقم الهاتف
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+966 50 123 4567"
                          {...field}
                          disabled={!editMode}
                        />
                      </FormControl>
                      <FormDescription>
                        رقم الهاتف للتواصل الطارئ
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control as any}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المهنة</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="مطور برمجيات، مصمم، مدرس..."
                          {...field}
                          disabled={!editMode}
                        />
                      </FormControl>
                      <FormDescription>مهنتك أو مجال عملك</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الموقع</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="الرياض، السعودية"
                          {...field}
                          disabled={!editMode}
                        />
                      </FormControl>
                      <FormDescription>موقعك الجغرافي</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control as any}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الموقع الإلكتروني</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://yourwebsite.com"
                        {...field}
                        disabled={!editMode}
                      />
                    </FormControl>
                    <FormDescription>
                      موقعك الإلكتروني الشخصي أو المهني
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>السيرة الذاتية</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[120px] resize-none"
                        placeholder="اكتب نبذة قصيرة عن نفسك..."
                        {...field}
                        disabled={!editMode}
                      />
                    </FormControl>
                    <FormDescription>
                      نبذة موجزة عن شخصيتك واهتماماتك (الحد الأقصى 500 حرف)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {editMode && (
                <div className="flex items-center justify-end gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={loading}
                  >
                    إلغاء
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || accountMutation.isLoading || signedUrlMutation.isLoading}
                    className="min-w-[120px]"
                  >
                    {loading || accountMutation.isLoading || signedUrlMutation.isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        جاري الحفظ...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        حفظ التغييرات
                      </span>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Account Details */}
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الحساب</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">معرف المستخدم</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded font-mono">
                {enhancedUserData?.id || "غير متوفر"}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">تاريخ الإنشاء</h4>
              <p className="text-sm text-gray-600">
                {enhancedUserData?.createdAt
                  ? format(
                      new Date(enhancedUserData.createdAt),
                      "PPP",
                      {
                        locale: ar,
                      }
                    )
                  : "غير متوفر"}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">آخر تحديث</h4>
              <p className="text-sm text-gray-600">
                {enhancedUserData?.updatedAt
                  ? format(
                      new Date(enhancedUserData.updatedAt),
                      "PPP",
                      {
                        locale: ar,
                      }
                    )
                  : "غير متوفر"}
              </p>
            </div>
            {enhancedUserData?.lastSignInAt && (
              <div>
                <h4 className="font-semibold mb-2">آخر دخول</h4>
                <p className="text-sm text-gray-600">
                  {format(new Date(enhancedUserData.lastSignInAt), "PPP", {
                    locale: ar,
                  })}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileForm;
