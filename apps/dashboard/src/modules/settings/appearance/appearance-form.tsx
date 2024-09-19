"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button, buttonVariants } from "@ui/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@ui/components/ui/radio-group";
import ThemeLabel from "@/src/components/theme-label";
import SectionBottomActions from "@/src/components/section-bottom-actions";

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark"], {
    required_error: "Please select a theme.",
  }),
  font: z.enum(["inter", "manrope", "system"], {
    invalid_type_error: "Select a font",
    required_error: "Please select a font.",
  }),
});

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

const defaultValues: Partial<AppearanceFormValues> = {
  theme: "light",
};

export function AppearanceForm() {
  const userThemeFormMethods = useForm({
    defaultValues: {
      theme: "light",
    },
  });

  const {
    formState: {
      isSubmitting: isUserThemeSubmitting,
      isDirty: isUserThemeDirty,
    },
    reset: resetUserThemeReset,
  } = userThemeFormMethods;

  function onSubmit(data: AppearanceFormValues) {}

  return (
    <div className="w-full mx-auto h-fit min-h-[200px] bg-white shadow border rounded-2xl  p-4">
      <Form {...userThemeFormMethods}>
        <form onSubmit={() => {}}>
          <div className="border-subtle flex flex-col justify-between border-x px-6 py-8 sm:flex-row">
            <ThemeLabel
              variant="system"
              value={undefined}
              label={"system"}
              defaultChecked={true}
              register={userThemeFormMethods.register}
              fieldName="appTheme"
            />
            <ThemeLabel
              variant="light"
              value="light"
              label={"light"}
              defaultChecked={true}
              register={userThemeFormMethods.register}
              fieldName="appTheme"
            />
            <ThemeLabel
              variant="dark"
              value="dark"
              label={"dark"}
              defaultChecked={false}
              register={userThemeFormMethods.register}
              fieldName="appTheme"
            />
          </div>
          <SectionBottomActions className="mb-6" align="end">
            <Button
              disabled={false}
              type="submit"
              data-testid="update-app-theme-btn"
              color="primary"
            >
              update
            </Button>
          </SectionBottomActions>
        </form>
      </Form>
    </div>
  );
}
