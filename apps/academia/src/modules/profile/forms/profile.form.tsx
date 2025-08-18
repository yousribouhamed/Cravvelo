"use client";

import { useState } from "react";
import { StudentProfile } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/ui/phone-input";
import ProfileImageInput from "../components/image-input";
import type { Value as PhoneValue } from "react-phone-number-input";
import { updateStudentProfile } from "../actions/profile.actions";
import { uploadImageToS3, deleteImageFromS3 } from "@/modules/aws/s3";
import { getKeyFromUrl } from "@/modules/aws/utils";

interface Props {
  profileData: StudentProfile;
}

export default function ProfileForm({ profileData }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    full_name: profileData.full_name || "",
    bio: profileData.bio || "",
    phone: profileData.phone || ("" as PhoneValue),
    photo_url: profileData.photo_url || "",
  });

  const handleChange = (field: string, value: string | PhoneValue) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  // Helper function to convert base64 to File
  const base64ToFile = (base64String: string, filename: string): File => {
    const arr = base64String.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      let imageUrl = formValues.photo_url;

      // Check if the image is a base64 string (newly uploaded/cropped image)
      if (
        formValues.photo_url &&
        formValues.photo_url.startsWith("data:image/")
      ) {
        // Delete old image from S3 if it exists
        if (
          profileData.photo_url &&
          profileData.photo_url !== formValues.photo_url
        ) {
          try {
            const oldKey = getKeyFromUrl(profileData.photo_url);
            await deleteImageFromS3(oldKey);
          } catch (error) {
            console.warn("Failed to delete old image:", error);
            // Continue with upload even if deletion fails
          }
        }

        // Convert base64 to File and upload to S3
        const file = base64ToFile(
          formValues.photo_url,
          `profile-${Date.now()}.jpg`
        );
        const formData = new FormData();
        formData.append("file", file);

        const uploadResult = await uploadImageToS3(formData);

        if (uploadResult.success && uploadResult.url) {
          imageUrl = uploadResult.url;
        } else {
          throw new Error(uploadResult.error || "Failed to upload image");
        }
      }

      // Call the update profile action
      const result = await updateStudentProfile({
        full_name: formValues.full_name,
        phone_number: formValues.phone as string,
        bio: formValues.bio,
        image_url: imageUrl,
      });

      if (result.success) {
        // Update form values with the new image URL
        setFormValues((prev) => ({ ...prev, photo_url: imageUrl }));
        setIsEditing(false);
        console.log("تم حفظ الملف الشخصي بنجاح");
      } else {
        throw new Error(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("خطأ في حفظ الملف الشخصي:", error);
      // You might want to show a toast notification here
      alert("حدث خطأ أثناء حفظ الملف الشخصي. حاول مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form values to original data
    setFormValues({
      full_name: profileData.full_name || "",
      bio: profileData.bio || "",
      phone: profileData.phone || ("" as PhoneValue),
      photo_url: profileData.photo_url || "",
    });
    setIsEditing(false);
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">ملفي الشخصي</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* صورة الملف الشخصي */}
        <div className="flex items-center space-x-4">
          <ProfileImageInput
            value={formValues.photo_url}
            onChange={(url) => handleChange("photo_url", url)}
            name={formValues.full_name}
            disabled={!isEditing || isLoading}
          />
        </div>

        {/* الاسم الكامل */}
        <div className="space-y-2">
          <Label htmlFor="full_name">الاسم الكامل</Label>
          <Input
            id="full_name"
            value={formValues.full_name}
            onChange={(e) => handleChange("full_name", e.target.value)}
            placeholder="أدخل اسمك الكامل"
            disabled={!isEditing || isLoading}
          />
        </div>

        {/* السيرة الذاتية */}
        <div className="space-y-2">
          <Label htmlFor="bio">نبذة عنك</Label>
          <Textarea
            id="bio"
            value={formValues.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            placeholder="أخبرنا قليلاً عن نفسك"
            disabled={!isEditing || isLoading}
            rows={3}
          />
        </div>

        {/* رقم الهاتف */}
        <div className="space-y-2">
          <Label htmlFor="phone">رقم الهاتف</Label>
          <PhoneInput
            id="phone"
            value={formValues.phone}
            onChange={(value) => handleChange("phone", value || "")}
            placeholder="أدخل رقم هاتفك"
            disabled={!isEditing || isLoading}
            defaultCountry="DZ"
            className={!isEditing || isLoading ? "opacity-60" : ""}
          />
        </div>

        {/* البريد الإلكتروني (دائماً للقراءة فقط) */}
        <div className="space-y-2">
          <Label>البريد الإلكتروني</Label>
          <Input value={profileData.email} disabled />
        </div>
      </CardContent>

      <CardFooter className="flex justify-end space-x-4">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "جاري الحفظ..." : "حفظ"}
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>تعديل</Button>
        )}
      </CardFooter>
    </Card>
  );
}
