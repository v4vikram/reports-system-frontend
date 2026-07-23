export type SectionType = "standard" | "custom";

export interface Section {
  id: string;
  reportId: string;
  name: string;
  // Export-page heading; falls back to `name` when unset. Not yet exposed in
  // the editor UI.
  title: string | null;
  // Only "standard" is rendered today — "custom" sections (freeform
  // content/image page instead of tables) have no UI yet, so this field
  // always reads "standard" for anything the app itself created.
  type: SectionType;
  content: string | null;
  image: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}
