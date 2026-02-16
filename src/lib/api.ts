/**
 * API Service Layer
 * 
 * This module contains all API calls. Currently uses mock data.
 * To connect to your Express backend, update BASE_URL and remove mock implementations.
 */

const BASE_URL = "http://localhost:5000/api"; // Change to your Express backend URL

// ---- Types ----
export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Event {
  _id: string;
  name: string;
  organizer: string;
  location: string;
  date: string;
  description: string;
  capacity: number;
  registeredCount: number;
  category: string;
  image: string;
}

export interface Registration {
  _id: string;
  userId: string;
  eventId: string;
  event: Event;
  registeredAt: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

// ---- Mock Data ----
const MOCK_EVENTS: Event[] = [
  {
    _id: "1", name: "React Summit 2026", organizer: "TechConf", location: "San Francisco",
    date: "2026-04-15T09:00:00Z", description: "The largest React conference on the West Coast. Join hundreds of developers for talks on React 19, Server Components, and the future of frontend.", capacity: 500, registeredCount: 342, category: "Technology",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80"
  },
  {
    _id: "2", name: "Design Systems Workshop", organizer: "DesignOps Co", location: "New York",
    date: "2026-03-20T10:00:00Z", description: "Hands-on workshop covering design tokens, component libraries, and scaling design across teams.", capacity: 60, registeredCount: 58, category: "Design",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80"
  },
  {
    _id: "3", name: "Startup Pitch Night", organizer: "Bellcorp Ventures", location: "Austin",
    date: "2026-05-10T18:00:00Z", description: "Watch 10 early-stage startups pitch to a panel of investors. Networking and drinks included.", capacity: 200, registeredCount: 145, category: "Business",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80"
  },
  {
    _id: "4", name: "AI & Machine Learning Expo", organizer: "DataMinds", location: "Seattle",
    date: "2026-06-01T09:00:00Z", description: "Explore the latest in AI/ML with live demos, talks from industry leaders, and hands-on labs.", capacity: 800, registeredCount: 612, category: "Technology",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80"
  },
  {
    _id: "5", name: "Community Yoga in the Park", organizer: "Wellness Austin", location: "Austin",
    date: "2026-03-05T07:00:00Z", description: "Start your morning with a free outdoor yoga session. All levels welcome. Mats provided.", capacity: 100, registeredCount: 100, category: "Health",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80"
  },
  {
    _id: "6", name: "Jazz & Blues Festival", organizer: "MusicCity Events", location: "Chicago",
    date: "2026-07-20T16:00:00Z", description: "Three stages, 20+ artists, food trucks, and summer vibes. A weekend of incredible live music.", capacity: 2000, registeredCount: 1340, category: "Music",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80"
  },
  {
    _id: "7", name: "Blockchain for Beginners", organizer: "CryptoEd", location: "Online",
    date: "2026-04-02T14:00:00Z", description: "A beginner-friendly webinar covering blockchain fundamentals, smart contracts, and Web3.", capacity: 300, registeredCount: 187, category: "Technology",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80"
  },
  {
    _id: "8", name: "Photography Walk", organizer: "Lens Club", location: "San Francisco",
    date: "2026-03-15T08:00:00Z", description: "Explore the city through your lens. Guided walk through iconic SF neighborhoods with pro tips.", capacity: 30, registeredCount: 22, category: "Art",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&q=80"
  },
  {
    _id: "9", name: "Product Management Meetup", organizer: "PMHub", location: "New York",
    date: "2026-05-22T18:30:00Z", description: "Monthly meetup for PMs to share frameworks, case studies, and career advice.", capacity: 80, registeredCount: 63, category: "Business",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80"
  },
  {
    _id: "10", name: "Marathon Training Bootcamp", organizer: "RunStrong", location: "Chicago",
    date: "2026-04-28T06:00:00Z", description: "8-week prep program for your next marathon. Includes coaching, nutrition plans, and group runs.", capacity: 50, registeredCount: 41, category: "Health",
    image: "https://images.unsplash.com/photo-1461896836934-bd45ba8df9c7?w=600&q=80"
  },
  {
    _id: "11", name: "Cybersecurity Workshop", organizer: "SecureNet", location: "Online",
    date: "2026-02-10T10:00:00Z", description: "Learn ethical hacking, penetration testing, and security best practices in this hands-on workshop.", capacity: 150, registeredCount: 150, category: "Technology",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80"
  },
  {
    _id: "12", name: "Food & Wine Pairing Night", organizer: "Gourmet Guild", location: "San Francisco",
    date: "2026-06-15T19:00:00Z", description: "An evening of curated wine and artisan food pairings. Guided by a certified sommelier.", capacity: 40, registeredCount: 28, category: "Food",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80"
  },
];

let mockRegistrations: Registration[] = [];
let mockUser: User | null = null;
let mockToken: string | null = null;

// ---- Helpers ----
function getHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Set USE_MOCK to false when your Express backend is ready
const USE_MOCK = true;

// ---- Auth API ----
export const authApi = {
  async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    if (USE_MOCK) {
      const user: User = { _id: "user_1", name, email };
      const token = "mock_jwt_token_" + Date.now();
      mockUser = user;
      mockToken = token;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return { token, user };
    }
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) throw new Error((await res.json()).message || "Signup failed");
    const data = await res.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    if (USE_MOCK) {
      const user: User = { _id: "user_1", name: "Demo User", email };
      const token = "mock_jwt_token_" + Date.now();
      mockUser = user;
      mockToken = token;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return { token, user };
    }
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error((await res.json()).message || "Login failed");
    const data = await res.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  },

  logout() {
    mockUser = null;
    mockToken = null;
    mockRegistrations = [];
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getStoredUser(): User | null {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  },

  isLoggedIn(): boolean {
    return !!localStorage.getItem("token");
  },
};

// ---- Events API ----
export const eventsApi = {
  async getAll(params?: { search?: string; category?: string; location?: string }): Promise<Event[]> {
    if (USE_MOCK) {
      let results = [...MOCK_EVENTS];
      if (params?.search) {
        const s = params.search.toLowerCase();
        results = results.filter(e => e.name.toLowerCase().includes(s) || e.description.toLowerCase().includes(s));
      }
      if (params?.category) results = results.filter(e => e.category === params.category);
      if (params?.location) results = results.filter(e => e.location === params.location);
      return results;
    }
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await fetch(`${BASE_URL}/events?${query}`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch events");
    return res.json();
  },

  async getById(id: string): Promise<Event> {
    if (USE_MOCK) {
      const event = MOCK_EVENTS.find(e => e._id === id);
      if (!event) throw new Error("Event not found");
      return event;
    }
    const res = await fetch(`${BASE_URL}/events/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Event not found");
    return res.json();
  },

  getCategories(): string[] {
    return [...new Set(MOCK_EVENTS.map(e => e.category))];
  },

  getLocations(): string[] {
    return [...new Set(MOCK_EVENTS.map(e => e.location))];
  },
};

// ---- Registration API ----
export const registrationApi = {
  async register(eventId: string): Promise<Registration> {
    if (USE_MOCK) {
      const user = authApi.getStoredUser();
      if (!user) throw new Error("Not authorized");
      const existing = mockRegistrations.find(r => r.eventId === eventId && r.userId === user._id);
      if (existing) throw new Error("Already registered for this event");
      const event = MOCK_EVENTS.find(e => e._id === eventId);
      if (!event) throw new Error("Event not found");
      if (event.registeredCount >= event.capacity) throw new Error("Event is at full capacity");
      event.registeredCount++;
      const reg: Registration = {
        _id: "reg_" + Date.now(),
        userId: user._id,
        eventId,
        event,
        registeredAt: new Date().toISOString(),
      };
      mockRegistrations.push(reg);
      return reg;
    }
    const res = await fetch(`${BASE_URL}/registrations`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ eventId }),
    });
    if (!res.ok) throw new Error((await res.json()).message || "Registration failed");
    return res.json();
  },

  async cancel(eventId: string): Promise<void> {
    if (USE_MOCK) {
      const user = authApi.getStoredUser();
      if (!user) throw new Error("Not authorized");
      const idx = mockRegistrations.findIndex(r => r.eventId === eventId && r.userId === user._id);
      if (idx === -1) throw new Error("Registration not found");
      const event = MOCK_EVENTS.find(e => e._id === eventId);
      if (event) event.registeredCount--;
      mockRegistrations.splice(idx, 1);
      return;
    }
    const res = await fetch(`${BASE_URL}/registrations/${eventId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Cancellation failed");
  },

  async getMyRegistrations(): Promise<Registration[]> {
    if (USE_MOCK) {
      const user = authApi.getStoredUser();
      if (!user) throw new Error("Not authorized");
      return mockRegistrations.filter(r => r.userId === user._id);
    }
    const res = await fetch(`${BASE_URL}/registrations/my`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch registrations");
    return res.json();
  },

  isRegistered(eventId: string): boolean {
    const user = authApi.getStoredUser();
    if (!user) return false;
    return mockRegistrations.some(r => r.eventId === eventId && r.userId === user._id);
  },
};
