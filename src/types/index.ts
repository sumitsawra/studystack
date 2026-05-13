// ========================================
// StudyStack — TypeScript Type Definitions
// ========================================

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: 'student' | 'admin';
  university: string | null;
  bio: string | null;
  created_at: string;
  upload_count?: number;
  follower_count?: number;
  following_count?: number;
}

export interface Paper {
  id: string;
  title: string;
  subject: string;
  semester: number;
  university: string;
  course: string;
  year: number;
  tags: string[];
  description: string;
  pdf_url: string;         // legacy field
  file_url?: string | null; // ✅ Supabase storage URL
  file_name?: string | null;
  file_size?: number | null;
  thumbnail_url?: string | null;
  uploaded_by?: string;
  uploader_id?: string | null;
  uploader?: Profile;
  downloads: number;
  likes: number;
  approved?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  type?: 'paper' | 'note';
  created_at: string;
  is_liked?: boolean;
  is_bookmarked?: boolean;
}

export interface Note {
  id: string;
  title: string;
  subject: string;
  description: string;
  file_url: string;
  uploaded_by: string;
  uploader?: Profile;
  downloads: number;
  created_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  paper_id: string;
  paper?: Paper;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  paper_id: string;
  content: string;
  user?: Profile;
  created_at: string;
}

export interface Report {
  id: string;
  user_id: string;
  paper_id: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  paper?: Paper;
  user?: Profile;
  created_at: string;
}

export interface Like {
  id: string;
  user_id: string;
  paper_id: string;
  created_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

// Filter types
export interface PaperFilters {
  search: string;
  subject: string;
  semester: number | null;
  university: string;
  year: number | null;
  course: string;
  sortBy: 'newest' | 'oldest' | 'most_downloaded' | 'most_liked' | 'trending';
}

// Upload form
export interface UploadFormData {
  title: string;
  subject: string;
  semester: number;
  university: string;
  course: string;
  year: number;
  tags: string[];
  description: string;
  file: File | null;
  type: 'paper' | 'note';
}

// AI types
export interface AISearchSuggestion {
  text: string;
  relevance: number;
}

export interface AIRecommendation {
  paperId: string;
  reason: string;
  score: number;
}

// Notification
export interface Notification {
  id: string;
  user_id: string;
  type: 'like' | 'comment' | 'follow' | 'approval' | 'rejection';
  message: string;
  read: boolean;
  data?: Record<string, unknown>;
  created_at: string;
}

// Statistics
export interface AdminStats {
  totalUsers: number;
  totalPapers: number;
  totalDownloads: number;
  pendingApprovals: number;
  reportsCount: number;
  uploadsThisWeek: number;
}

// Category
export interface Category {
  name: string;
  icon: string;
  count: number;
  color: string;
}
