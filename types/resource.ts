export type Category =
  | "UI Inspiration"
  | "UI Components"
  | "Animations"
  | "Backgrounds"
  | "Icons"
  | "Fonts"
  | "Mockups"
  | "AI Tools"
  | "Developer Tools"
  | "Design Assets"
  | "Productivity"
  | "References";

export interface Resource {
  /** Stable unique id, used for favorites persistence */
  id: string;
  name: string;
  url: string;
  description: string;
  category: Category;
  tags: string[];
  /** Shown in the Featured section */
  featured?: boolean;
  /** ISO date — powers the "Recently added" section */
  dateAdded: string;
  /** Optional personal note — reserved for future expansion */
  note?: string;
  /** Optional rating (1–5) — reserved for future expansion */
  rating?: number;
}
