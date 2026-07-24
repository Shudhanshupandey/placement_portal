export type NotificationType =
  | "drive"
  | "interview"
  | "selection"
  | "announcement"
  | "application"
  | "document"
  | "system";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  link?: string;
  createdAtMs: number;
  /** "all" for broadcasts, or a specific student uid. */
  recipientId: string;
}
