
import { TimelineMilestone, EventType, HiveEvent, Member, GalleryAlbum, Cinematic, Yearbook, Article } from './types';

export const LOGO_URL = "https://gandakiuniversityedunp-my.sharepoint.com/:i:/g/personal/bee-it_hive_gandakiuniversity_edu_np/IQCdtVW9Aq3_TZ0b4tA21r72AYRya-bRMuQPbHjBNqxtwfw?e=j3hETo&download=1";

export const COLORS = {
  primary: '#030A37', // Tech Blue
  accent: '#FFAA0D',  // BEE-IT Gold
  highlight: '#E8B723', // BEE Light Gold
  neutral: '#C5D3D9', // Neutral Gray
  background: '#F9FAFB', // Light Background
  glow: '#DB3069', // Glow
  secondary: ['#040D40', '#142B73', '#F2AB27', '#F28C0F', '#0D0D0D'],
  tertiary: ['#FA5057', '#7B8582', '#032321', '#877170', '#FBFCFC']
};

export const MILESTONES: TimelineMilestone[] = [
  {
    id: "ms_01",
    year: 2023,
    milestone: "The Hive Awakens",
    summary: "BEE-IT HIVE was officially established as the premier IT club of Gandaki University.",
    category: EventType.Social,
    media: { 
      type: 'video', 
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      testimonial: "It started with a small room and big dreams. We wanted a place where code met culture. - Founder" 
    }
  },
  {
    id: "ms_02",
    year: 2023,
    milestone: "First Code Jam",
    summary: "Our inaugural internal hackathon seeing over 50 participants from the BIT program.",
    category: EventType.Hackathon,
    media: { type: 'image', url: 'https://picsum.photos/seed/hive2/800/600', testimonial: "The energy in the room was electric. My first time deploying an app! - Participant" }
  },
  {
    id: "ms_03",
    year: 2024,
    milestone: "Industry Connect",
    summary: "Bridging the gap between academia and IT industry with guest speakers from top tech firms.",
    category: EventType.Workshop,
    media: { type: 'image', url: 'https://picsum.photos/seed/hive3/800/600' }
  },
  {
    id: "ms_04",
    year: 2024,
    milestone: "Tech Summit Co-Host",
    summary: "Partnership with national tech communities to host the regional Tech Summit.",
    category: EventType.Collaboration,
    media: { type: 'image', url: 'https://picsum.photos/seed/hive4/800/600' }
  },
  {
    id: "ms_05",
    year: 2025,
    milestone: "The Future Hub",
    summary: "Launching our dynamic digital portal and expansion of club activities.",
    category: EventType.Social,
    media: { type: 'image', url: 'https://picsum.photos/seed/hive5/800/600' }
  }
];

export const EVENTS: HiveEvent[] = [
  {
    id: "evt_2025_001",
    title: "Global Innovation Summit 2025",
    type: EventType.Collaboration,
    status: 'published',
    datetime: {
      start: "2025-12-15T09:00:00+05:45",
      end: "2025-12-16T18:00:00+05:45"
    },
    location: { name: "Virtual Convention Center", coordinates: "28.2096, 83.9856" },
    capacity: 500,
    registeredCount: 342,
    tags: ["innovation", "global", "networking"],
    image: "https://picsum.photos/seed/event1/800/400",
    description: "Join us for a groundbreaking exploration of future technologies. The Global Innovation Summit brings together thought leaders from around the world to discuss AI, Blockchain, and Sustainable Tech. This 2-day event features keynote speeches, panel discussions, and interactive breakout sessions tailored for students and professionals alike.",
    organizers: ["Nirajan Dhakal", "Smriti Giri"],
    resources: [
      { name: "Summit Agenda", type: "pdf", url: "#" },
      { name: "Speaker Bios", type: "link", url: "#" }
    ],
    sentNotifications: []
  },
  {
    id: "evt_2025_002",
    title: "BIT Hackathon 3.0",
    type: EventType.Hackathon,
    status: 'published',
    datetime: {
      start: "2025-05-20T10:00:00+05:45",
      end: "2025-05-22T20:00:00+05:45"
    },
    location: { name: "GU Computer Lab", coordinates: "28.1695, 84.0298" },
    capacity: 100,
    registeredCount: 98,
    tags: ["coding", "competition", "prizes"],
    image: "https://picsum.photos/seed/event2/800/400",
    description: "48 hours of code, coffee, and creation. Build solutions for real-world problems in Nepal's agricultural and tourism sectors. Prizes worth NPR 50,000 up for grabs!",
    organizers: ["Technical Committee"],
    resources: [
      { name: "Rulebook v1.0", type: "pdf", url: "#" },
      { name: "Submission Portal", type: "link", url: "#" }
    ],
    sentNotifications: []
  },
  {
    id: "evt_2025_003",
    title: "Cloud Computing Workshop",
    type: EventType.Workshop,
    status: 'completed',
    datetime: {
      start: "2025-01-10T11:00:00+05:45",
      end: "2025-01-10T15:00:00+05:45"
    },
    location: { name: "Seminar Hall", coordinates: "28.1695, 84.0298" },
    capacity: 60,
    registeredCount: 60,
    tags: ["cloud", "azure", "devops"],
    image: "https://picsum.photos/seed/event3/800/400",
    description: "A hands-on workshop introducing Microsoft Azure services. Students learned to deploy their first static web app and manage cloud resources.",
    organizers: ["Saroj Giri"],
    resources: [
      { name: "Slide Deck", type: "pdf", url: "#" }
    ],
    sentNotifications: []
  },
  {
    id: "evt_2024_004",
    title: "CodeRush: Algorithm Battle 2024",
    type: EventType.Competition,
    status: 'completed',
    datetime: {
      start: "2024-11-15T13:00:00+05:45",
      end: "2024-11-15T17:00:00+05:45"
    },
    location: { name: "Lab A, Gandaki University", coordinates: "28.1695, 84.0298" },
    capacity: 40,
    registeredCount: 40,
    tags: ["dsa", "c++", "competitive"],
    image: "https://picsum.photos/seed/coderush/800/400",
    description: "The ultimate test of logic and speed. Students faced 10 algorithmic problems ranging from dynamic programming to graph theory. The top 3 winners were awarded mechanical keyboards.",
    organizers: ["Sabin Kafle"],
    resources: [
      { name: "Problem Set", type: "pdf", url: "#" }
    ],
    sentNotifications: []
  },
  {
    id: "evt_2025_005",
    title: "Annual Hive BBQ & Networking",
    type: EventType.Social,
    status: 'published',
    datetime: {
      start: "2025-04-12T16:00:00+05:45",
      end: "2025-04-12T20:00:00+05:45"
    },
    location: { name: "Lakeside Retreat", coordinates: "28.2096, 83.9595" },
    capacity: 150,
    registeredCount: 45,
    tags: ["fun", "music", "food"],
    image: "https://picsum.photos/seed/bbq_hive/800/400",
    description: "Take a break from the screens! Join us for an evening of grilled food, live acoustic music, and networking with alumni. A great chance for freshers to meet the seniors.",
    organizers: ["Srijana Poudel"],
    resources: [],
    sentNotifications: []
  },
  {
    id: "evt_2024_006",
    title: "Winter Coding Retreat",
    type: EventType.Social,
    status: 'completed',
    datetime: {
      start: "2024-12-20T08:00:00+05:45",
      end: "2024-12-21T10:00:00+05:45"
    },
    location: { name: "Sarangkot Hill", coordinates: "28.2435, 83.9472" },
    capacity: 30,
    registeredCount: 28,
    tags: ["hiking", "teambuilding", "nature"],
    image: "https://picsum.photos/seed/hike_winter/800/400",
    description: "A 2-day escape to the hills. We brainstormed club strategy for 2025 while enjoying the panoramic views of the Annapurnas.",
    organizers: ["Nirajan Dhakal"],
    resources: [],
    sentNotifications: []
  },
  {
    id: "evt_2025_007",
    title: "Next.js & AI Integration Masterclass",
    type: EventType.Workshop,
    status: 'published',
    datetime: {
      start: "2025-06-05T10:00:00+05:45",
      end: "2025-06-05T16:00:00+05:45"
    },
    location: { name: "Virtual (Teams)", coordinates: "0,0" },
    capacity: 200,
    registeredCount: 120,
    tags: ["web", "react", "ai"],
    image: "https://picsum.photos/seed/nextjs_ai/800/400",
    description: "Learn how to build modern web applications using the latest Next.js 14 features and integrate Gemini AI for intelligent data processing.",
    organizers: ["Technical Committee"],
    resources: [
      { name: "Prerequisites Guide", type: "link", url: "#" }
    ],
    sentNotifications: []
  },
  {
    id: "evt_2025_008",
    title: "Open Source Saturday Pokhara",
    type: EventType.Collaboration,
    status: 'completed',
    datetime: {
      start: "2025-02-15T11:00:00+05:45",
      end: "2025-02-15T15:00:00+05:45"
    },
    location: { name: "City Hall", coordinates: "28.2000, 83.9800" },
    capacity: 100,
    registeredCount: 100,
    tags: ["opensource", "linux", "community"],
    image: "https://picsum.photos/seed/opensource/800/400",
    description: "Co-hosted with local tech communities, this event focused on contributing to open source projects. Students made their first PRs to popular repositories.",
    organizers: ["Amrit Tiwari"],
    resources: [],
    sentNotifications: []
  }
];

export const TEAM: Member[] = [
  {
    id: "m01",
    name: "Nirajan Dhakal",
    role: "President",
    message: "Leading BEE-IT Hive to unprecedented heights with a vision of radical innovation.",
    image: "https://picsum.photos/seed/nirajan/200/200",
    journey: ["General Member", "Event Coordinator", "Vice President", "President"],
    status: 'published'
  },
  {
    id: "m02",
    name: "Srijana Poudel",
    role: "Secretary",
    message: "Orchestrating the Hive's internal rhythm and ensuring operational excellence.",
    image: "https://picsum.photos/seed/srijana/200/200",
    journey: ["General Member", "Assistant Secretary", "Secretary"],
    status: 'published'
  },
  {
    id: "m03",
    name: "Karina Poudel",
    role: "Active Member",
    message: "Passionate about building inclusive tech communities and fostering creativity.",
    image: "https://picsum.photos/seed/karina/200/200",
    journey: ["Volunteer", "General Member", "Active Member"],
    status: 'published'
  },
  {
    id: "m04",
    name: "Smriti Giri",
    role: "Active Member",
    message: "Believing in the power of code to solve real-world problems in Pokhara.",
    image: "https://picsum.photos/seed/smriti/200/200",
    journey: ["General Member", "Design Lead", "Active Member"],
    status: 'published'
  },
  {
    id: "m05",
    name: "Amrit Tiwari",
    role: "Active Member",
    message: "Exploring the intersections of cloud computing and sustainable technology.",
    image: "https://picsum.photos/seed/amrit/200/200",
    journey: ["General Member", "Tech Support", "Active Member"],
    status: 'published'
  },
  {
    id: "m06",
    name: "Sabin Kafle",
    role: "Active Member",
    message: "Developing efficient algorithms to power the next generation of GU apps.",
    image: "https://picsum.photos/seed/sabin/200/200",
    journey: ["General Member", "Active Member"],
    status: 'published'
  },
  {
    id: "m07",
    name: "Sujan Khanal",
    role: "Active Member",
    message: "Designing human-centric interfaces for our digital community.",
    image: "https://picsum.photos/seed/sujan/200/200",
    journey: ["General Member", "UI/UX Intern", "Active Member"],
    status: 'published'
  },
  {
    id: "m08",
    name: "Bibek Subedi",
    role: "Active Member",
    message: "Pushing the boundaries of what BIT students can achieve together.",
    image: "https://picsum.photos/seed/bibek/200/200",
    journey: ["General Member", "Outreach Volunteer", "Active Member"],
    status: 'published'
  },
  {
    id: "m09",
    name: "Rajeev Rimal",
    role: "Active Member",
    message: "Committed to technical literacy and peer-to-peer mentorship.",
    image: "https://picsum.photos/seed/rajeev/200/200",
    journey: ["General Member", "Active Member"],
    status: 'published'
  },
  {
    id: "m10",
    name: "Saroj Giri",
    role: "Faculty Advisor",
    message: "Empowering students through innovation and academic excellence.",
    image: "https://picsum.photos/seed/saroj/200/200",
    journey: ["Visiting Lecturer", "Lecturer", "Faculty Advisor"],
    status: 'published'
  },

  {
    id: "m11",
    name: "Amrit Poudel",
    role: "BIT Program Coordinator",
    message: "Empowering students through innovation and academic excellence.",
    image: "https://picsum.photos/seed/saroj/200/200",
    journey: ["Lecturer", "Assistant Professor", "Program Coordinator"],
    status: 'published'
  },
];

export const ALBUMS: GalleryAlbum[] = [
  {
    album_id: "alb_001",
    title: "Hackathon 2024 Highlights",
    date: "2024-10-15",
    location: "Main Hall, Gandaki University",
    assets: [
      { id: "a1", url: "https://picsum.photos/seed/g1/800/800", format: "webp", size_bytes: 450000, exif: { camera: "Sony A7R IV", lens: "35mm f/1.4", iso: "100", aperture: "f/2.8", shutter: "1/500s" }, caption: "Participants brainstorming ideas during the opening ceremony." },
      { id: "a2", url: "https://picsum.photos/seed/g2/800/800", format: "webp", size_bytes: 520000, exif: { camera: "Sony A7R IV", lens: "35mm f/1.4", iso: "400", aperture: "f/1.8", shutter: "1/200s" }, caption: "Deep focus mode: Coding through the night." },
      { id: "a3", url: "https://picsum.photos/seed/g3/800/1200", format: "webp", size_bytes: 380000, exif: { camera: "Canon EOS R5", lens: "50mm f/1.2", iso: "200", aperture: "f/2.0", shutter: "1/1000s" }, caption: "Team 'Bug Busters' presenting their agricultural drone prototype." },
      { id: "a4", url: "https://picsum.photos/seed/g4/800/600", format: "webp", size_bytes: 410000, exif: { camera: "Nikon Z9", lens: "24-70mm f/2.8", iso: "800", aperture: "f/4.0", shutter: "1/60s" }, caption: "Mentorship session with industry experts from Kathmandu." },
      { id: "a5", url: "https://picsum.photos/seed/g5/800/1000", format: "webp", size_bytes: 550000, exif: { camera: "Sony A7R IV", lens: "85mm f/1.8", iso: "160", aperture: "f/1.8", shutter: "1/800s" }, caption: "Networking lunch break at the university cafeteria." },
      { id: "a6", url: "https://picsum.photos/seed/g6/800/800", format: "webp", size_bytes: 490000, exif: { camera: "Canon EOS R5", lens: "35mm f/1.4", iso: "100", aperture: "f/8.0", shutter: "1/250s" }, caption: "Award ceremony: The winning team celebrating their victory." },
    ]
  },
  {
    album_id: "alb_002",
    title: "Workshop: Intro to AI",
    date: "2023-05-10",
    location: "Seminar Hall",
    assets: [
      { id: "a7", url: "https://picsum.photos/seed/g7/800/600", format: "webp", size_bytes: 400000, exif: { camera: "Fujifilm X-T4", lens: "18-55mm", iso: "800", aperture: "f/4", shutter: "1/60s" }, caption: "Learning neural networks basics." },
      { id: "a8", url: "https://picsum.photos/seed/g8/800/600", format: "webp", size_bytes: 410000, exif: { camera: "Fujifilm X-T4", lens: "18-55mm", iso: "800", aperture: "f/4", shutter: "1/60s" }, caption: "Group discussion on AI ethics." }
    ]
  },
  {
    album_id: "alb_003",
    title: "Hiking Social 2025",
    date: "2025-02-20",
    location: "Sarangkot",
    assets: [
      { id: "a9", url: "https://picsum.photos/seed/g9/800/1000", format: "webp", size_bytes: 600000, exif: { camera: "iPhone 15 Pro", lens: "Main", iso: "50", aperture: "f/1.8", shutter: "1/2000s" }, caption: "Sunrise over the Annapurnas." },
      { id: "a10", url: "https://picsum.photos/seed/g10/800/600", format: "webp", size_bytes: 550000, exif: { camera: "iPhone 15 Pro", lens: "Ultra Wide", iso: "50", aperture: "f/2.2", shutter: "1/1000s" }, caption: "Team photo at the summit." }
    ]
  }
];

export const CINEMATICS: Cinematic[] = [
  {
    id: "cine_01",
    title: "Hackathon 2024: The Aftermovie",
    duration: "00:58",
    thumbnail: "https://picsum.photos/seed/cine1/800/450",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    chapters: [
      { time: 0, label: "Intro" },
      { time: 15, label: "Coding Begins" },
      { time: 40, label: "Final Pitches" },
      { time: 55, label: "Awards" }
    ]
  },
  {
    id: "cine_02",
    title: "Tech Summit Recap 2023",
    duration: "02:15",
    thumbnail: "https://picsum.photos/seed/cine2/800/450",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    chapters: [
      { time: 0, label: "Opening Keynote" },
      { time: 45, label: "Panel Discussion" },
      { time: 90, label: "Closing Remarks" }
    ]
  }
];

export const YEARBOOKS: Yearbook[] = [
  {
    id: "yb_2024",
    year: 2024,
    theme: "Resilience & Innovation",
    status: 'published',
    executiveSummary: "The 2024 tenure marked a pivotal shift towards external collaboration. We successfully hosted 3 major hackathons and established partnerships with 5 tech companies.",
    highlights: ["Regional Tech Summit Co-host", "Launch of Bee-IT Mentorship", "500+ Active Members Reached"],
    collage: [
      "https://picsum.photos/seed/yb1/300/300",
      "https://picsum.photos/seed/yb2/300/400",
      "https://picsum.photos/seed/yb3/400/300",
      "https://picsum.photos/seed/yb4/300/300"
    ]
  }
];

export const ARTICLES: Article[] = [
  {
    id: "art_001",
    title: "The Rise of AI Communities in Pokhara",
    excerpt: "How local tech clubs are fostering artificial intelligence research and development in the Gandaki region.",
    content: `<p>Pokhara innovation wave...</p>`,
    author: "Nirajan Dhakal",
    date: "2025-01-15",
    image: "https://picsum.photos/seed/ai_pokhara/800/400",
    tags: ["AI", "Community", "Pokhara"],
    readTime: "3 min read",
    status: 'published',
    comments: [
      {
        id: "c1",
        author: "Sabin Kafle",
        date: "2025-01-16T10:00:00Z",
        content: "This is exactly what we needed! Great insight into the local AI scene."
      },
      {
        id: "c2",
        author: "Smriti Giri",
        date: "2025-01-17T12:30:00Z",
        content: "Looking forward to the next workshop on this topic."
      }
    ]
  },
  {
    id: "art_002",
    title: "My Internship Journey: From Campus to Corporate",
    excerpt: "A personal account of navigating the gap between university curriculum and industry expectations during my first tech internship.",
    content: `
      <h3>The First Step</h3>
      <p>Landing my first internship felt like scaling Machhapuchhre. The theoretical knowledge from our Digital Logic and C++ classes was foundational, but the industry demanded something else entirely: adaptability.</p>
      
      <h3>Bridging the Gap</h3>
      <p>At university, we strive for perfect grades. In the corporate world, they strive for 'shippable code'. Learning Git workflows, agile methodologies, and how to communicate effectively in stand-ups were hurdles I hadn't anticipated.</p>
      
      <h3>Key Takeaways</h3>
      <ul>
        <li><strong>Soft Skills Matter:</strong> Being able to explain your bug is as important as fixing it.</li>
        <li><strong>Never Stop Learning:</strong> The tech stack you use today might be obsolete tomorrow.</li>
        <li><strong>Ask Questions:</strong> Senior developers appreciate curiosity over silent struggle.</li>
      </ul>
      <p>To my juniors at Gandaki University: Don't wait for your final year to build projects. Start now.</p>
    `,
    author: "Srijana Poudel",
    date: "2025-02-10",
    image: "https://picsum.photos/seed/internship/800/400",
    tags: ["Career", "Internship", "Growth"],
    readTime: "5 min read",
    status: 'published',
    comments: []
  },
  {
    id: "art_003",
    title: "Demystifying Cloud Computing: A Student's Guide",
    excerpt: "Understanding the basics of Azure and AWS without getting lost in the jargon. Why every BIT student needs cloud skills.",
    content: `
      <p>Cloud computing is no longer the future; it's the present. For students, terms like IaaS, PaaS, and SaaS can be overwhelming. Let's break them down.</p>
      
      <h3>The Big Three</h3>
      <p>Think of <strong>IaaS (Infrastructure as a Service)</strong> like renting a computer in the cloud. You manage the OS and software; Amazon (AWS) or Microsoft (Azure) manages the hardware.</p>
      <p><strong>PaaS (Platform as a Service)</strong> is like renting a development environment. You bring the code; they run it. Heroku is a classic example.</p>
      
      <h3>Why Learn It?</h3>
      <p>Localhost is safe, but the world lives on the web. deploying your MERN stack project to the cloud teaches you about networking, security groups, and environment variables—skills that are gold on a resume.</p>
    `,
    author: "Amrit Tiwari",
    date: "2025-03-01",
    image: "https://picsum.photos/seed/cloud_comp/800/400",
    tags: ["Cloud", "Azure", "AWS", "Education"],
    readTime: "6 min read",
    status: 'published',
    comments: []
  },
  {
    id: "art_004",
    title: "Top 5 VS Code Extensions for 2025",
    excerpt: "Boost your productivity with these essential tools that every developer at the Hive uses daily.",
    content: `
      <p>Visual Studio Code is the weapon of choice for 90% of our club members. Here are the extensions that power our late-night coding sessions:</p>
      
      <ol>
        <li><strong>Prettier:</strong> Because arguing about indentation is a waste of time. Format on save and forget it.</li>
        <li><strong>GitLens:</strong> Visualize code authorship at a glance. Essential for team projects to see who broke the build (just kidding... mostly).</li>
        <li><strong>Live Server:</strong> Instant feedback for web development. A must-have for first-year students learning HTML/CSS.</li>
        <li><strong>ES7+ React/Redux/React-Native snippets:</strong> Type less, code more. The 'rfce' shortcut alone has saved me hours.</li>
        <li><strong>Thunder Client:</strong> Test your APIs directly inside VS Code without switching to Postman.</li>
      </ol>
    `,
    author: "Sujan Khanal",
    date: "2025-03-05",
    image: "https://picsum.photos/seed/vscode/800/400",
    tags: ["Tools", "Productivity", "VSCode"],
    readTime: "4 min read",
    status: 'published',
    comments: []
  },
  {
    id: "art_005",
    title: "The Art of Hackathon Survival",
    excerpt: "Sleep is optional, coffee is mandatory. How to survive and thrive in your first 48-hour coding marathon.",
    content: `
      <p>The BIT Hackathon 3.0 is around the corner. Having participated in (and survived) five hackathons, here is my survival guide.</p>
      
      <h3>1. The Idea Phase</h3>
      <p>Don't overscope. A working MVP (Minimum Viable Product) of a simple idea beats a non-functional complex one every time. Focus on one core feature.</p>
      
      <h3>2. Hydration & Nutrition</h3>
      <p>Energy drinks give you a loan on energy that you have to pay back with interest later. Drink water. Eat actual food, not just chips.</p>
      
      <h3>3. The Pitch</h3>
      <p>You're selling a solution, not just code. Make sure your presentation clearly defines the problem and how you solved it. A live demo is risky but rewarding.</p>
    `,
    author: "Bibek Subedi",
    date: "2025-03-12",
    image: "https://picsum.photos/seed/hackathon_tips/800/400",
    tags: ["Hackathon", "Guide", "Tips"],
    readTime: "5 min read",
    status: 'published',
    comments: []
  }
];
