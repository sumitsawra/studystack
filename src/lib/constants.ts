// ========================================
// App Constants
// ========================================

export const APP_NAME = 'StudyStack';
export const APP_DESCRIPTION = 'Find, preview, upload, and download previous year question papers, notes, and study materials.';

export const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'Computer Science', 'Electronics', 'Mechanical Engineering',
  'Civil Engineering', 'Electrical Engineering', 'Information Technology',
  'Business Administration', 'Economics', 'English', 'Psychology',
  'Political Science', 'History', 'Sociology', 'Philosophy',
  'Law', 'Medicine', 'Architecture', 'Design',
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const UNIVERSITIES = [
  'IK Gujral Punjab Technical University', 'MIT', 'Stanford University', 'Harvard University', 'California Institute of Technology', 'Princeton University', 'Yale University', 'Columbia University','Other',
];

export const COURSES = [
  'B.Tech', 'M.Tech', 'B.Sc', 'M.Sc',
  'BCA', 'MCA', 'B.Com', 'M.Com',
  'BA', 'MA', 'BBA', 'MBA',
  'B.E', 'M.E', 'Ph.D', 'Other',
];

export const YEARS = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i);

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'most_downloaded', label: 'Most Downloaded' },
  { value: 'most_liked', label: 'Most Liked' },
  { value: 'trending', label: 'Trending' },
] as const;

export const PAGE_SIZE = 12;

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const ALLOWED_FILE_TYPES = ['application/pdf'];
export const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB
