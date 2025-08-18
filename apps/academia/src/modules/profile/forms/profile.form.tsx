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

interface Props {
  profileData: StudentProfile;
}

export default function ProfileForm({ profileData }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    full_name: profileData.full_name || "",
    bio: profileData.bio || "",
    phone: profileData.phone || ("" as PhoneValue),
    photo_url: profileData.photo_url || "",
  });

  const handleChange = (field: string, value: string | PhoneValue) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // TODO: Call mutation to update profile
    console.log("حفظ الملف الشخصي:", formValues);
    setIsEditing(false);
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
            disabled={!isEditing}
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
            disabled={!isEditing}
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
            disabled={!isEditing}
            defaultCountry="DZ"
            className={!isEditing ? "opacity-60" : ""}
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
            <Button variant="outline" onClick={handleCancel}>
              إلغاء
            </Button>
            <Button onClick={handleSave}>حفظ</Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>تعديل</Button>
        )}
      </CardFooter>
    </Card>
  );
}
