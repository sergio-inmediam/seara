export interface Event {
  id: number;
  title: string;
  speaker?: string | null;
  location?: string | null;
  description?: string | null;
  starts_at: string;
  ends_at?: string | null;
  day_label?: string | null;
}

export interface SearaAlert {
  id: number;
  title: string;
  message: string;
  scheduled_for: string;
  sent_at?: string | null;
  is_auto: boolean;
  event_id?: number | null;
}

export interface ConfessionSlot {
  id: number;
  location?: string | null;
  starts_at: string;
  ends_at: string;
  priest?: string | null;
  notes?: string | null;
}
