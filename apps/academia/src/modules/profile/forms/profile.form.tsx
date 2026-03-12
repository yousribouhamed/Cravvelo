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
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface Props {
  profileData: StudentProfile;
}

export default function ProfileForm({ profileData }: Props) {
  const t = useTranslations("profile");
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
        setFormValues((prev) => ({ ...prev, photo_url: imageUrl }));
        setIsEditing(false);
        toast.success(t("saveSuccess"));
      } else {
        throw new Error(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error(t("saveError"), error);
      toast.error(t("saveError"));
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
      <CardHeader className="px-4 md:px-6">
        <CardTitle className="text-xl font-bold">{t("myProfile")}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 px-4 md:px-6">
        {/* Profile Picture */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <ProfileImageInput
            value={formValues.photo_url}
            onChange={(url) => handleChange("photo_url", url)}
            name={formValues.full_name}
            disabled={!isEditing || isLoading}
          />
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="full_name">{t("fullName")}</Label>
          <Input
            id="full_name"
            value={formValues.full_name}
            onChange={(e) => handleChange("full_name", e.target.value)}
            placeholder={t("fullNamePlaceholder")}
            disabled={!isEditing || isLoading}
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">{t("bio")}</Label>
          <Textarea
            id="bio"
            value={formValues.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            placeholder={t("bioPlaceholder")}
            disabled={!isEditing || isLoading}
            rows={3}
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phone">{t("phoneNumber")}</Label>
          <PhoneInput
            id="phone"
            value={formValues.phone}
            onChange={(value) => handleChange("phone", value || "")}
            placeholder={t("phoneNumberPlaceholder")}
            disabled={!isEditing || isLoading}
            defaultCountry="DZ"
            className={!isEditing || isLoading ? "opacity-60" : ""}
          />
        </div>

        {/* Email (read-only) */}
        <div className="space-y-2">
          <Label>{t("email")}</Label>
          <Input value={profileData.email} disabled />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-4 px-4 md:px-6">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {t("cancel")}
            </Button>
            <Button onClick={handleSave} disabled={isLoading} loading={isLoading}>
              {isLoading ? t("saving") : t("save")}
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>{t("edit")}</Button>
        )}
      </CardFooter>
    </Card>
  );
}
