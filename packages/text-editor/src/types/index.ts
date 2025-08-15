// Add these updated interfaces to your existing types file

export interface MenuButtonProps {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  title?: string;
}

export interface MenuBarProps {
  onPreview?: () => void;
  onClear?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  activeFormats: Set<string>;
  onFormatToggle: (format: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  isRtl?: boolean; // New prop for RTL support
}

export type TiptapEditorProps =
  | {
      value: string;
      readOnly: true;
      onChange?: (value: string) => void; // optional when readOnly is true
      isFullscreen?: boolean;
      onToggleFullscreen?: () => void;
      onPreview?: () => void;
      onClear?: () => void;
    }
  | {
      value: string;
      readOnly?: false; // false or undefined
      onChange: (value: string) => void; // required when not readOnly
      isFullscreen?: boolean;
      onToggleFullscreen?: () => void;
      onPreview?: () => void;
      onClear?: () => void;
    };

// Additional utility types for RTL support
export type TextDirection = "ltr" | "rtl";

export interface RTLDetectionResult {
  direction: TextDirection;
  confidence: number;
  detectedLanguage?: string;
}

export interface EditorDirectionConfig {
  autoDetect: boolean;
  defaultDirection: TextDirection;
  supportedLanguages: string[];
}
