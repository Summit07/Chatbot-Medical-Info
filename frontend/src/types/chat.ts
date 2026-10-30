export interface Source {
  type: "pdf" | "web";
  page?: number | string;
  score?: number;
  url?: string;
  title?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: Source[];
  imageData?: string | null;
  tools?: string[];
  isError?: boolean;
}

export type ConnectionStatus = "checking" | "connected" | "warning" | "offline";

