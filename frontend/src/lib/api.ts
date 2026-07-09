const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export type UserRole = "student" | "lecturer" | "admin";

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
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

export type MeetingMode = "jitsi" | "external";

export type Meeting = {
  id: number;
  title: string;
  description?: string | null;
  start_time: string;
  end_time: string;
  status: string;
  meeting_mode?: MeetingMode;
  meeting_url?: string | null;
  organizer?: User;
  room?: { id: number; name: string; building?: string; capacity: number };
  participants?: Array<{ user: User; response: string }>;
};

export type Room = {
  id: number;
  name: string;
  building?: string | null;
  capacity: number;
};

export type SlotSuggestion = {
  start_time: string;
  end_time: string;
};

export type ExamPeriod = {
  id: number;
  name: string;
  rule_type: string;
  valid_from: string | null;
  valid_to: string | null;
  is_active: boolean;
};

export type TimetableSlot = {
  id: number;
  user_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  title: string;
  valid_from: string | null;
  valid_to: string | null;
  is_active: boolean;
};

export type Course = {
  id: number;
  code: string;
  name: string;
  is_active: boolean;
  users_count?: number;
};

export type CourseExamPeriod = {
  id: number;
  course_id: number;
  course_code?: string;
  course_name?: string;
  name: string;
  valid_from: string | null;
  valid_to: string | null;
  is_active: boolean;
};

export type CourseDetail = Course & {
  users: User[];
  exam_periods: CourseExamPeriod[];
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

  getMeeting(id: number) {
    return request<{ data: Meeting }>(`/meetings/${id}`);
  },

  listUsers() {
    return request<{ data: User[] }>("/users");
  },

  listRooms() {
    return request<{ data: Room[] }>("/rooms");
  },

  createMeeting(body: Record<string, unknown>) {
    return request<{ data: Meeting }>("/meetings", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  updateMeeting(id: number, body: Record<string, unknown>) {
    return request<{ data: Meeting }>(`/meetings/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  cancelMeeting(id: number) {
    return request<{ data: Meeting }>(`/meetings/${id}`, {
      method: "DELETE",
    });
  },

  checkClash(body: Record<string, unknown>) {
    return request<{
      has_clashes: boolean;
      clashes: Array<{ type: string; message: string }>;
      suggestions: SlotSuggestion[];
    }>("/meetings/check-clash", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  parseNlp(body: { text: string; meeting_mode?: MeetingMode }) {
    return request<{ data: ParsedMeetingProposal }>("/meetings/parse-nlp", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  listExamPeriods() {
    return request<{ data: ExamPeriod[] }>("/exam-periods");
  },

  createExamPeriod(body: {
    name: string;
    valid_from: string;
    valid_to: string;
    is_active?: boolean;
  }) {
    return request<{ data: ExamPeriod }>("/admin/exam-periods", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  updateExamPeriod(id: number, body: Record<string, unknown>) {
    return request<{ data: ExamPeriod }>(`/admin/exam-periods/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  deleteExamPeriod(id: number) {
    return request<{ message: string }>(`/admin/exam-periods/${id}`, {
      method: "DELETE",
    });
  },

  listTimetableSlots(userId?: number) {
    const qs = userId ? `?user_id=${userId}` : "";
    return request<{ data: TimetableSlot[] }>(`/timetable-slots${qs}`);
  },

  createTimetableSlot(body: {
    user_id: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
    title: string;
    valid_from?: string | null;
    valid_to?: string | null;
    is_active?: boolean;
  }) {
    return request<{ data: TimetableSlot }>("/admin/timetable-slots", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  updateTimetableSlot(id: number, body: Record<string, unknown>) {
    return request<{ data: TimetableSlot }>(`/admin/timetable-slots/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  deleteTimetableSlot(id: number) {
    return request<{ message: string }>(`/admin/timetable-slots/${id}`, {
      method: "DELETE",
    });
  },

  adminListUsers() {
    return request<{ data: User[] }>("/admin/users");
  },

  adminCreateUser(body: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }) {
    return request<{ data: User }>("/admin/users", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  adminUpdateUser(id: number, body: Record<string, unknown>) {
    return request<{ data: User }>(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  adminDeleteUser(id: number) {
    return request<{ message: string }>(`/admin/users/${id}`, {
      method: "DELETE",
    });
  },

  listMyExams() {
    return request<{ data: CourseExamPeriod[] }>("/my-exams");
  },

  adminListCourses() {
    return request<{ data: Course[] }>("/admin/courses");
  },

  adminGetCourse(id: number) {
    return request<{ data: CourseDetail }>(`/admin/courses/${id}`);
  },

  adminCreateCourse(body: { code: string; name: string; is_active?: boolean }) {
    return request<{ data: Course }>("/admin/courses", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  adminUpdateCourse(id: number, body: Record<string, unknown>) {
    return request<{ data: Course }>(`/admin/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  adminDeleteCourse(id: number) {
    return request<{ message: string }>(`/admin/courses/${id}`, {
      method: "DELETE",
    });
  },

  adminEnrolUser(courseId: number, userId: number) {
    return request<{ data: User[] }>(`/admin/courses/${courseId}/users`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId }),
    });
  },

  adminRemoveUserFromCourse(courseId: number, userId: number) {
    return request<{ message: string }>(
      `/admin/courses/${courseId}/users/${userId}`,
      { method: "DELETE" },
    );
  },

  adminCreateCourseExamPeriod(
    courseId: number,
    body: {
      name: string;
      valid_from: string;
      valid_to: string;
      is_active?: boolean;
    },
  ) {
    return request<{ data: CourseExamPeriod }>(
      `/admin/courses/${courseId}/exam-periods`,
      { method: "POST", body: JSON.stringify(body) },
    );
  },

  adminUpdateCourseExamPeriod(id: number, body: Record<string, unknown>) {
    return request<{ data: CourseExamPeriod }>(
      `/admin/course-exam-periods/${id}`,
      { method: "PUT", body: JSON.stringify(body) },
    );
  },

  adminDeleteCourseExamPeriod(id: number) {
    return request<{ message: string }>(`/admin/course-exam-periods/${id}`, {
      method: "DELETE",
    });
  },
};
