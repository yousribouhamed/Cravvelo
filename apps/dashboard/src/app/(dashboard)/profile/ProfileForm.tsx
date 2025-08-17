// "use client";

// import React, { ChangeEvent, useRef, type FC } from "react";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@ui/components/ui/form";
// import { Input } from "@ui/components/ui/input";
// import { LoadingButton } from "@/src/components/loading-button";
// import { Textarea } from "@ui/components/ui/textarea";
// import { Button } from "@ui/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@ui/components/ui/card"
// import { computeSHA256 } from "@/src/lib/utils";
// import { maketoast } from "@/src/components/toasts";
// import { trpc } from "../../_trpc/client";

// import { format } from "date-fns";
// import { ar } from "date-fns/locale";
// import {
//   Calendar,
//   Mail,
//   Phone,
//   Shield,
//   User as UserIcon,
//   Clock,
//   Camera,
//   Edit,
//   Save,
//   X,
// } from "lucide-react";
// import { formSchema } from "./validators";
// import { ProfileFormProps } from "./types";

// // Animated Status Indicator Component
// const StatusIndicator: FC<{
//   active: boolean;
//   label: string;
//   description: string;
// }> = ({ active, label, description }) => (
//   <div className="text-center">
//     <div className="flex items-center justify-center mb-2">
//       <div className="relative">
//         <div
//           className={`w-2 h-2 rounded-full ${
//             active ? "bg-green-500" : "bg-gray-300"
//           }`}
//         >
//           {active && (
//             <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></div>
//           )}
//         </div>
//       </div>
//       <span
//         className={`mr-2 text-sm font-medium ${
//           active ? "text-green-600" : "text-gray-500"
//         }`}
//       >
//         {label}
//       </span>
//     </div>
//     <p className="text-xs text-gray-600">{description}</p>
//   </div>
// );

// const UserProfileForm: FC<ProfileFormProps> = ({ enhancedUserData }) => {
//   const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
//   const [loading, setLoading] = React.useState<boolean>(false);
//   const [editMode, setEditMode] = React.useState<boolean>(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       const file = event.target.files[0];

//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         maketoast.error();
//         return;
//       }

//       // Validate file type
//       if (!file.type.startsWith("image/")) {
//         maketoast.error();
//         return;
//       }

//       setSelectedFile(file);

//       const reader = new FileReader();
//       reader.onload = () => {
//         if (typeof reader.result === "string") {
//           setPreviewUrl(reader.result);
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       full_name:
//         enhancedUserData?.fullName || enhancedUserData?.user_name || "",
//       bio: enhancedUserData?.user_bio || "",
//       email:
//         enhancedUserData?.primaryEmailAddress?.emailAddress ||
//         enhancedUserData?.support_email ||
//         "",
//       phone:
//         enhancedUserData?.primaryPhoneNumber?.phoneNumber ||
//         enhancedUserData?.phone?.toString() ||
//         "",
//       username: enhancedUserData?.username || "",
//       website: enhancedUserData?.website || "",
//       location: enhancedUserData?.location || "",
//       occupation: enhancedUserData?.occupation || "",
//     },
//   });

//   const mutation = trpc.update_user_profile.useMutation({
//     onSuccess: () => {
//       maketoast.success();
//       setEditMode(false);
//       // Optionally refresh the page or refetch data
//       //  window.location.reload();
//     },
//     onError: (error) => {
//       maketoast.error();
//     },
//   });

//   // Helper function to filter out empty values
//   const filterEmptyValues = (obj: any) => {
//     const filtered: any = {};
//     Object.keys(obj).forEach((key) => {
//       const value = obj[key];
//       if (value !== "" && value !== null && value !== undefined) {
//         filtered[key] = value;
//       }
//     });
//     return filtered;
//   };

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     try {
//       setLoading(true);

//       // Filter out empty values to only send fields with actual data
//       const filteredValues = filterEmptyValues(values);

//       // Check if there's at least one field to update
//       if (Object.keys(filteredValues).length === 0 && !selectedFile) {
//         maketoast.error();
//         setLoading(false);
//         return;
//       }

//       let avatarUrl = "";

//       if (selectedFile) {
//         // Upload new avatar
//         const checksum = await computeSHA256(selectedFile);
//         const { success } = await getOurSignedUrl({
//           checksum,
//           fileSize: selectedFile.size,
//           fileType: selectedFile.type,
//         });

//         if (!success || !success?.url) {
//           throw new Error("فشل في الحصول على رابط التحميل");
//         }

//         await fetch(success.url, {
//           method: "PUT",
//           body: selectedFile,
//           headers: {
//             "Content-Type": selectedFile.type,
//           },
//         });

//         avatarUrl = success.url.split("?")[0];
//       }

//       // Build update object with only non-empty values
//       const updateData: any = {};

//       // Add avatar if uploaded
//       if (avatarUrl) {
//         updateData.avatarUrl = avatarUrl;
//       }

//       // Map form fields to API fields, only if they have values
//       if (filteredValues.full_name) {
//         updateData.user_name = filteredValues.full_name;
//       }

//       if (filteredValues.bio) {
//         updateData.user_bio = filteredValues.bio;
//       }

//       if (filteredValues.email) {
//         updateData.support_email = filteredValues.email;
//       }

//       if (filteredValues.phone) {
//         updateData.phoneNumber = Number(filteredValues.phone);
//       }

//       if (filteredValues.website) {
//         updateData.website = filteredValues.website;
//       }

//       if (filteredValues.location) {
//         updateData.location = filteredValues.location;
//       }

//       if (filteredValues.occupation) {
//         updateData.occupation = filteredValues.occupation;
//       }

//       // Only proceed if there's something to update
//       if (Object.keys(updateData).length > 0) {
//         await mutation.mutateAsync(updateData);
//       } else {
//         maketoast.error();
//       }
//     } catch (err) {
//       console.error("Profile update error:", err);
//       maketoast.error();
//     } finally {
//       setLoading(false);
//     }
//   }

//   const resetForm = () => {
//     form.reset();
//     setSelectedFile(null);
//     setPreviewUrl(null);
//     setEditMode(false);
//   };

//   return (
//     <div className="w-full mx-auto space-y-6">
//       {/* Profile Header Card */}
//       <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
//         <CardContent className="p-8">
//           <div className="flex items-center space-x-6 rtl:space-x-reverse">
//             <div className="relative">
//               <Avatar className="w-24 h-24 ring-4 ring-white/20">
//                 <AvatarImage
//                   src={previewUrl || enhancedUserData?.imageUrl || ""}
//                   alt={enhancedUserData?.fullName || "Profile"}
//                 />
//                 <AvatarFallback className="bg-white/20 text-white text-xl">
//                   {enhancedUserData?.initials || "AB"}
//                 </AvatarFallback>
//               </Avatar>
//               {editMode && (
//                 <Button
//                   type="button"
//                   size="sm"
//                   className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-white text-gray-600 hover:bg-gray-100"
//                   onClick={() => fileInputRef.current?.click()}
//                 >
//                   <Camera className="w-4 h-4" />
//                 </Button>
//               )}
//             </div>
//             <div className="flex-1">
//               <h1 className="text-3xl font-bold mb-2">
//                 {enhancedUserData?.fullName || "مستخدم"}
//               </h1>
//               <p className="text-white/80 mb-2">
//                 {enhancedUserData?.user_bio || "لا توجد سيرة ذاتية"}
//               </p>
//               <div className="flex items-center gap-4 text-sm text-white/70">
//                 <div className="flex items-center gap-1">
//                   <Calendar className="w-4 h-4" />
//                   <span>
//                     انضم في{" "}
//                     {format(
//                       new Date(enhancedUserData?.createdAt || new Date()),
//                       "PPP",
//                       { locale: ar }
//                     )}
//                   </span>
//                 </div>
//                 {enhancedUserData?.lastSignInAt && (
//                   <div className="flex items-center gap-1">
//                     <Clock className="w-4 h-4" />
//                     <span>
//                       آخر دخول{" "}
//                       {format(new Date(enhancedUserData.lastSignInAt), "PPP", {
//                         locale: ar,
//                       })}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               {!editMode ? (
//                 <Button
//                   onClick={() => setEditMode(true)}
//                   variant="outline"
//                   className="bg-white/10 border-white/20 text-white hover:bg-white/20"
//                 >
//                   <Edit className="w-4 h-4 mr-2" />
//                   تعديل الملف الشخصي
//                 </Button>
//               ) : (
//                 <Button
//                   onClick={resetForm}
//                   variant="outline"
//                   className="bg-white/10 border-white/20 text-white hover:bg-white/20"
//                 >
//                   <X className="w-4 h-4 mr-2" />
//                   إلغاء
//                 </Button>
//               )}
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Account Security Status with Animated Indicators */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Shield className="w-5 h-5" />
//             حالة الأمان
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <StatusIndicator
//               active={enhancedUserData?.twoFactorEnabled}
//               label={enhancedUserData?.twoFactorEnabled ? "مفعل" : "غير مفعل"}
//               description="المصادقة الثنائية"
//             />
//             <StatusIndicator
//               active={!enhancedUserData?.banned}
//               label={enhancedUserData?.banned ? "محظور" : "نشط"}
//               description="حالة الحساب"
//             />
//             <StatusIndicator
//               active={!enhancedUserData?.locked}
//               label={enhancedUserData?.locked ? "مقفل" : "مفتوح"}
//               description="حالة الوصول"
//             />
//           </div>
//         </CardContent>
//       </Card>

//       {/* Profile Form */}
//       <Card>
//         <CardHeader>
//           <CardTitle>المعلومات الشخصية</CardTitle>
//           <CardDescription>
//             قم بتحديث معلوماتك الشخصية وإعدادات الملف الشخصي. يمكنك تعديل حقل
//             واحد أو أكثر.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//               {/* Hidden file input */}
//               <input
//                 ref={fileInputRef}
//                 id="image-upload"
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleFileChange}
//               />

//               {/* Personal Information */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField
//                   control={form.control}
//                   name="full_name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>الاسم الكامل</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="أدخل اسمك الكامل"
//                           {...field}
//                           disabled={!editMode}
//                         />
//                       </FormControl>
//                       <FormDescription>
//                         اسمك كما سيظهر للمستخدمين الآخرين
//                       </FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="username"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>اسم المستخدم</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="اسم المستخدم الفريد"
//                           {...field}
//                           disabled={!editMode}
//                         />
//                       </FormControl>
//                       <FormDescription>
//                         اسم المستخدم الفريد الخاص بك
//                       </FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* Contact Information */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="flex items-center gap-2">
//                         <Mail className="w-4 h-4" />
//                         البريد الإلكتروني
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="email"
//                           placeholder="example@email.com"
//                           {...field}
//                           disabled={!editMode}
//                         />
//                       </FormControl>
//                       <FormDescription>
//                         البريد الإلكتروني للتواصل والإشعارات
//                       </FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="phone"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="flex items-center gap-2">
//                         <Phone className="w-4 h-4" />
//                         رقم الهاتف
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="tel"
//                           placeholder="+966 50 123 4567"
//                           {...field}
//                           disabled={!editMode}
//                         />
//                       </FormControl>
//                       <FormDescription>
//                         رقم الهاتف للتواصل الطارئ
//                       </FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* Additional Information */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField
//                   control={form.control}
//                   name="occupation"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>المهنة</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="مطور برمجيات، مصمم، مدرس..."
//                           {...field}
//                           disabled={!editMode}
//                         />
//                       </FormControl>
//                       <FormDescription>مهنتك أو مجال عملك</FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="location"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>الموقع</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="الرياض، السعودية"
//                           {...field}
//                           disabled={!editMode}
//                         />
//                       </FormControl>
//                       <FormDescription>موقعك الجغرافي</FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <FormField
//                 control={form.control}
//                 name="website"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>الموقع الإلكتروني</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="url"
//                         placeholder="https://yourwebsite.com"
//                         {...field}
//                         disabled={!editMode}
//                       />
//                     </FormControl>
//                     <FormDescription>
//                       موقعك الإلكتروني الشخصي أو المهني
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="bio"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>السيرة الذاتية</FormLabel>
//                     <FormControl>
//                       <Textarea
//                         className="min-h-[120px] resize-none"
//                         placeholder="اكتب نبذة قصيرة عن نفسك..."
//                         {...field}
//                         disabled={!editMode}
//                       />
//                     </FormControl>
//                     <FormDescription>
//                       نبذة موجزة عن شخصيتك واهتماماتك (الحد الأقصى 500 حرف)
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {editMode && (
//                 <div className="flex items-center justify-end gap-4 pt-6">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={resetForm}
//                     disabled={loading}
//                   >
//                     إلغاء
//                   </Button>
//                   <LoadingButton pending={loading} type="submit">
//                     <Save className="w-4 h-4 ml-2" />
//                     حفظ التغييرات
//                   </LoadingButton>
//                 </div>
//               )}
//             </form>
//           </Form>
//         </CardContent>
//       </Card>

//       {/* Account Details */}
//       <Card>
//         <CardHeader>
//           <CardTitle>تفاصيل الحساب</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <h4 className="font-semibold mb-2">معرف المستخدم</h4>
//               <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded font-mono">
//                 {enhancedUserData?.id || "غير متوفر"}
//               </p>
//             </div>
//             <div>
//               <h4 className="font-semibold mb-2">تاريخ الإنشاء</h4>
//               <p className="text-sm text-gray-600">
//                 {enhancedUserData?.createdAt
//                   ? format(new Date(enhancedUserData.createdAt), "PPP", {
//                       locale: ar,
//                     })
//                   : "غير متوفر"}
//               </p>
//             </div>
//             <div>
//               <h4 className="font-semibold mb-2">آخر تحديث</h4>
//               <p className="text-sm text-gray-600">
//                 {enhancedUserData?.updatedAt
//                   ? format(new Date(enhancedUserData.updatedAt), "PPP", {
//                       locale: ar,
//                     })
//                   : "غير متوفر"}
//               </p>
//             </div>
//             {enhancedUserData?.lastSignInAt && (
//               <div>
//                 <h4 className="font-semibold mb-2">آخر دخول</h4>
//                 <p className="text-sm text-gray-600">
//                   {format(new Date(enhancedUserData.lastSignInAt), "PPP", {
//                     locale: ar,
//                   })}
//                 </p>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default UserProfileForm;

interface ProfileFormProps {}

export default function ProfileForm() {
  return <div>ProfileForm</div>;
}
