// ========================================
// Utility Functions
// ========================================

import type { Paper, Profile } from '@/types';

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(dateString: string): string {
  if (!dateString) return 'Unknown date';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatRelativeTime(dateString: string): string {
  if (!dateString) return 'Recently';
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return formatDate(dateString);
}

// ✅ FIX: Handle null/undefined values from Supabase
export function formatNumber(num: number | null | undefined): string {
  const n = num ?? 0;
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export function getInitials(name: string): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number): string {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function getSubjectColor(subject: string): string {
  const colors: Record<string, string> = {
    'Mathematics': '#FF6B6B',
    'Physics': '#4ECDC4',
    'Chemistry': '#45B7D1',
    'Biology': '#96CEB4',
    'Computer Science': '#2997FF',
    'Electronics': '#DDA0DD',
    'Mechanical Engineering': '#FF9F0A',
    'Civil Engineering': '#A8E6CF',
    'Electrical Engineering': '#FFD93D',
    'Information Technology': '#6C5CE7',
    'Business Administration': '#FD79A8',
    'Economics': '#00B894',
  };
  return colors[subject] || '#6E6E73';
}

export function getSubjectIcon(subject: string): string {
  const icons: Record<string, string> = {
    'Mathematics': '📐',
    'Physics': '⚛️',
    'Chemistry': '🧪',
    'Biology': '🧬',
    'Computer Science': '💻',
    'Electronics': '🔌',
    'Mechanical Engineering': '⚙️',
    'Civil Engineering': '🏗️',
    'Electrical Engineering': '⚡',
    'Information Technology': '🖥️',
    'Business Administration': '📊',
    'Economics': '📈',
    'English': '📚',
    'Psychology': '🧠',
    'Law': '⚖️',
    'Medicine': '🩺',
  };
  return icons[subject] || '📄';
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!file.type.includes('pdf')) {
    return { valid: false, error: 'Only PDF files are allowed' };
  }
  if (file.size > 50 * 1024 * 1024) {
    return { valid: false, error: 'File size must be less than 50MB' };
  }
  return { valid: true };
}

// Generate mock data for demo
export function generateMockPapers(count: number = 20): Paper[] {
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'Electronics', 'Biology'];
  const universities = ['MIT', 'Stanford University', 'IIT Delhi', 'IIT Bombay', 'Harvard University'];
  const courses = ['B.Tech', 'M.Tech', 'B.Sc', 'M.Sc'];

  return Array.from({ length: count }, (_, i) => ({
    id: `paper-${i + 1}`,
    title: `${subjects[i % subjects.length]} ${2020 + (i % 5)} Semester ${(i % 8) + 1} Question Paper`,
    subject: subjects[i % subjects.length]!,
    semester: (i % 8) + 1,
    university: universities[i % universities.length]!,
    course: courses[i % courses.length]!,
    year: 2020 + (i % 5),
    tags: ['exam', 'final', subjects[i % subjects.length]!.toLowerCase()],
    description: `Previous year question paper for ${subjects[i % subjects.length]} - Semester ${(i % 8) + 1}. Contains all sections with detailed marking scheme.`,
    pdf_url: '#',
    thumbnail_url: null,
    uploaded_by: `user-${(i % 5) + 1}`,
    uploader: {
      id: `user-${(i % 5) + 1}`,
      name: ['Alex Johnson', 'Priya Sharma', 'James Chen', 'Sarah Miller', 'Raj Patel'][i % 5]!,
      email: `user${(i % 5) + 1}@example.com`,
      avatar: null,
      role: 'student',
      university: universities[i % universities.length]!,
      bio: null,
      created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    },
    downloads: Math.floor(Math.random() * 5000),
    likes: Math.floor(Math.random() * 500),
    approved: true,
    created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    is_liked: Math.random() > 0.7,
    is_bookmarked: Math.random() > 0.8,
  }));
}

export function generateMockProfile(): Profile {
  return {
    id: 'user-demo',
    name: 'Demo User',
    email: 'demo@studystack.com',
    avatar: null,
    role: 'student',
    university: 'MIT',
    bio: 'Computer Science student passionate about sharing study materials.',
    created_at: new Date().toISOString(),
    upload_count: 12,
    follower_count: 48,
    following_count: 23,
  };
}
