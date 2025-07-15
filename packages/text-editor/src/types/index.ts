export interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onPreview: () => void;
  onClear: () => void;
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
}

export interface MenuButtonProps {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  title?: string;
}
