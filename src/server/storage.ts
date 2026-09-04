import fs from 'fs';
import path from 'path';

export interface UserProfile {
  email: string;
  handle: string;
  name: string;
  role: string;
  streakCount: number;
  bestStreak: number;
  lastActiveDate: string | null;
  activityDates: string[];
  solvedProblemIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DBData {
  users: Record<string, UserProfile>;
  evaluationsCount: number;
  startedAt: string;
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

class StorageEngine {
  private data: DBData;
  private isInitialized = false;

  constructor() {
    this.data = {
      users: {},
      evaluationsCount: 0,
      startedAt: new Date().toISOString()
    };
    this.init();
  }

  private init() {
    if (this.isInitialized) return;
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        // Seed initial demo user
        const today = new Date().toISOString().split('T')[0];
        this.data.users['staff@apple.com'] = {
          email: 'staff@apple.com',
          handle: 'APPLE_STAFF',
          name: 'Principal Engineer',
          role: 'Principal Staff Engineer',
          streakCount: 3,
          bestStreak: 18,
          lastActiveDate: today,
          activityDates: [today],
          solvedProblemIds: ['algo-1'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.save();
      }
      this.isInitialized = true;
    } catch (err) {
      console.warn('StorageEngine init warning:', err);
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write to db.json:', err);
    }
  }

  public getUser(email: string): UserProfile | null {
    this.init();
    return this.data.users[email.toLowerCase()] || null;
  }

  public getOrCreateUser(email: string, handle?: string, name?: string, role?: string): UserProfile {
    this.init();
    const key = email.toLowerCase();
    const existing = this.data.users[key];
    const today = new Date().toISOString().split('T')[0];

    if (existing) {
      if (handle) existing.handle = handle;
      if (name) existing.name = name;
      if (role) existing.role = role;
      existing.updatedAt = new Date().toISOString();
      this.save();
      return existing;
    }

    const defaultHandle = email.split('@')[0].toUpperCase();
    const newUser: UserProfile = {
      email: key,
      handle: handle || defaultHandle,
      name: name || defaultHandle,
      role: role || 'Staff Software Engineer',
      streakCount: 1,
      bestStreak: 1,
      lastActiveDate: today,
      activityDates: [today],
      solvedProblemIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.users[key] = newUser;
    this.save();
    return newUser;
  }

  public recordUserActivity(email: string, dateStr?: string, streak?: number): UserProfile {
    this.init();
    const key = email.toLowerCase();
    const user = this.getOrCreateUser(key);
    const today = dateStr || new Date().toISOString().split('T')[0];

    // Recalculate streak
    const lastActive = user.lastActiveDate;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = streak !== undefined ? streak : user.streakCount;
    if (streak === undefined) {
      if (!lastActive) {
        newStreak = 1;
      } else if (lastActive === today) {
        newStreak = Math.max(user.streakCount, 1);
      } else if (lastActive === yesterdayStr) {
        newStreak = user.streakCount + 1;
      } else {
        newStreak = 1;
      }
    }

    user.streakCount = newStreak;
    user.bestStreak = Math.max(user.bestStreak, newStreak);
    user.lastActiveDate = today;
    if (!user.activityDates.includes(today)) {
      user.activityDates.push(today);
    }
    user.updatedAt = new Date().toISOString();
    this.save();
    return user;
  }

  public recordSolvedProblem(email: string, problemId: string): UserProfile {
    this.init();
    const key = email.toLowerCase();
    const user = this.getOrCreateUser(key);
    if (!user.solvedProblemIds.includes(problemId)) {
      user.solvedProblemIds.push(problemId);
    }
    user.updatedAt = new Date().toISOString();
    this.save();
    return user;
  }

  public incrementEvaluations() {
    this.init();
    this.data.evaluationsCount = (this.data.evaluationsCount || 0) + 1;
    this.save();
  }

  public getStats() {
    this.init();
    return {
      totalUsers: Object.keys(this.data.users).length,
      evaluationsCount: this.data.evaluationsCount || 0,
      uptimeSeconds: Math.floor(process.uptime()),
      startedAt: this.data.startedAt
    };
  }
}

export const storage = new StorageEngine();
