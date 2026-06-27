const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export type User = {
  id: number;
  name: string;
  email: string;
  role: "student" | "lecturer";
};

export type ParsedMeetingProposal = {
  intent: string;
  title: string | null;
  description: string | null;
  start_time: string | null;
  end_time: string | null;
  participant_ids: number[];
  participant_names: string[];
  room_id: number | null;
  room_name: string | null;
  confidence: number;
  parser: "llm" | "rules";
  raw_text: string;
  validation_errors: string[];
  has_clashes: boolean;
  clashes: Array<{ type: string; message: string }>;
  suggestions: Array<{ start_time: string; end_time: string }>;
};

export type Meeting = {
  id: number;
  title: string;
  description?: string | null;
  start_time: string;
  end_time: string;
  status: string;
  organizer?: User;
  room?: { id: number; name: string; building?: string; capacity: number };
  participants?: Array<{ user: User; response: string }>;
};

type ClashError = { type?: string; message?: string };

type ApiError = {
  message?: string;
  errors?: Record<string, string[] | ClashError[] | unknown>;
};

function formatApiError(data: ApiError): string {
  const clashes = data.errors?.clashes;
  if (Array.isArray(clashes) && clashes.length > 0) {
    return clashes
      .map((c) =>
        typeof c === "object" && c !== null && "message" in c
          ? String((c as ClashError).message)
          : String(c),
      )
      .join(" ");
  }

  if (data.errors) {
    const parts = Object.entries(data.errors).flatMap(([field, msgs]) => {
      if (Array.isArray(msgs)) {
        return msgs.map((m) =>
          typeof m === "object" && m !== null && "message" in m
            ? String((m as ClashError).message)
            : `${field}: ${String(m)}`,
        );
      }
      return [`${field}: ${String(msgs)}`];
    });
    if (parts.length > 0) {
      return parts.join(" ");
    }
  }

  return data.message ?? "Request failed";
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("unischedule_token");
}

export function setToken(token: string | null): void {
  if (token) {
    localStorage.setItem("unischedule_token", token);
  } else {
    localStorage.removeItem("unischedule_token");
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(formatApiError(data as ApiError));
  }

  return data as T;
}

export const api = {
  register(body: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: "student" | "lecturer";
  }) {
    return request<{ user: User; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  login(body: { email: string; password: string }) {
    return request<{ user: User; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  logout() {
    return request<{ message: string }>("/auth/logout", { method: "POST" });
  },

  me() {
    return request<{ user: User }>("/auth/me");
  },

  listMeetings() {
    return request<{ data: Meeting[] }>("/meetings");
  },

  createMeeting(body: Record<string, unknown>) {
    return request<{ data: Meeting }>("/meetings", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  checkClash(body: Record<string, unknown>) {
    return request<{
      has_clashes: boolean;
      clashes: Array<{ type: string; message: string }>;
      suggestions: Array<{ start_time: string; end_time: string }>;
    }>("/meetings/check-clash", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  parseNlp(body: { text: string }) {
    return request<{ data: ParsedMeetingProposal }>("/meetings/parse-nlp", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
};
