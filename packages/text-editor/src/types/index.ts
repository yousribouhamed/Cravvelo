// Add these updated interfaces to your existing types file

export interface MenuButtonProps {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  title?: string;
}

export interface MenuBarProps {
  onPreview: () => void;
  onClear: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  activeFormats: Set<string>;
  onFormatToggle: (format: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  isRtl?: boolean; // New prop for RTL support
}

export interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onPreview: () => void;
  onClear: () => void;
}

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
