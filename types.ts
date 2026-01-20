
export enum Page {
  Home = 'home',
  About = 'about',
  Events = 'events',
  Team = 'team',
  Gallery = 'gallery',
  Articles = 'articles',
  Contact = 'contact',
  Admin = 'admin',
  Training = 'training',
  Minutes = 'minutes',
  Privacy = 'privacy',
  Terms = 'terms',
  Sitemap = 'sitemap',
  FAQ = 'faq',
  Branding = 'branding'
}

export enum EventType {
  Hackathon = 'hackathon',
  Workshop = 'workshop',
  Social = 'social',
  Collaboration = 'collaboration',
  Competition = 'competition'
}

export type ContentStatus = 'draft' | 'verification' | 'approval' | 'published';

export interface BannerConfig {
  isVisible: boolean;
  message: string;
  link?: string;
  showCountdown: boolean;
  targetDate?: string; // ISO String
}

export interface TimelineMilestone {
  id: string;
  year: number;
  milestone: string;
  summary: string;
  category: EventType;
  media?: {
    type: 'image' | 'video';
    url: string;
    testimonial?: string;
  };
}

export interface Member {
  id: string;
  name: string;
  role: string;
  message: string;
  image: string;
  journey: string[]; /* Added journey field */
  status: ContentStatus;
}

export interface HiveEvent {
  id: string;
  title: string;
  type: EventType;
  status: ContentStatus | 'completed' | 'cancelled';
  datetime: {
    start: string;
    end: string;
  };
  location: {
    name: string;
    coordinates?: string;
  };
  capacity: number;
  registeredCount: number;
  tags: string[];
  image: string;
  description?: string;
  organizers?: string[];
  resources?: { name: string; type: 'pdf' | 'link'; url: string }[];
  sentNotifications?: ('72h' | '24h' | '1h' | 'cancelled')[];
}

export interface Comment {
  id: string;
  author: string;
  date: string;
  content: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  tags: string[];
  readTime: string;
  status: ContentStatus;
  comments?: Comment[];
}

export interface TrainingDoc {
  id: string;
  title: string;
  category: 'onboarding' | 'technical' | 'governance';
  content: string;
  lastUpdated: string;
  status: ContentStatus;
}

export interface MeetingMinute {
  id: string;
  title: string;
  date: string;
  attendees: string[];
  agenda: string[];
  decisions: string[];
  actionItems: string[];
  status: ContentStatus;
}

export interface RegistrationForm {
  step: number;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  semester: string;
  dietary: string;
  agreedToTerms: boolean;
  agreedToConduct: boolean;
}

export interface FeedbackSubmission {
  eventId: string;
  rating: number;
  relevance: number;
  comments: string;
  anonymous: boolean;
}

export interface AssetExif {
  iso: string;
  aperture: string;
  shutter: string;
  camera: string;
  lens: string;
}

export interface GalleryAsset {
  id: string;
  url: string; // Image URL or Thumbnail
  type?: 'image' | 'video';
  videoUrl?: string; // Actual video source
  format: 'webp' | 'jpg' | 'png' | 'mp4';
  size_bytes: number;
  exif?: AssetExif;
  caption?: string;
}

export interface GalleryAlbum {
  album_id: string;
  title: string;
  date: string;
  location: string;
  assets: GalleryAsset[];
}

export interface Cinematic {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  chapters: { time: number; label: string }[];
}

/* Added Yearbook Interface */
export interface Yearbook {
  id: string;
  year: number;
  theme: string;
  executiveSummary: string;
  highlights: string[];
  collage: string[];
  status: ContentStatus;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  fontSize: 'default' | 'large' | 'xl';
  highContrast: boolean;
  reduceMotion: boolean;
  dyslexicFont?: boolean;
  matrixMode?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'important' | 'general';
  category: 'system' | 'community' | 'personal';
  timestamp: string;
  actionUrl?: string;
  eventId?: string;
  isRead: boolean;
  isArchived: boolean;
}
