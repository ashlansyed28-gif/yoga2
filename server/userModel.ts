/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import fs from 'fs';
import path from 'path';

export interface IUser {
  googleId: string;
  email: string;
  name: string;
  picture: string;
  createdAt: Date;
}

export interface IUserDocument extends IUser, Document {}

// --- Mongoose Schema Requirement ---
// User schema tracking fields: googleId (string/unique), email (string), name (string), picture (string), and createdAt
const UserSchema = new Schema<IUserDocument>({
  googleId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  picture: {
    type: String,
    default: '',
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

let MongooseUserModel: Model<IUserDocument> | null = null;
let isMongoConnected = false;

// Attempt Mongoose Connection if MONGO_URI is provided
export async function initDatabase(): Promise<void> {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 2000,
      });
      isMongoConnected = true;
      MongooseUserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
      console.log(' Successfully connected to MongoDB database via Mongoose.');
    } catch (err) {
      console.warn('⚠️ MongoDB connection attempt failed, switching to persistent local store:', (err as Error).message);
      isMongoConnected = false;
    }
  } else {
    console.log('ℹ️ No MONGO_URI provided in environment. Initialized Mongoose schema with persistent local storage engine.');
  }

  // Always initialize Mongoose model definition so schema is registered
  if (!MongooseUserModel) {
    try {
      MongooseUserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
    } catch {
      // Model already exists or fallback
    }
  }
}

// --- Persistent File Store Fallback (Guarantees zero-downtime & works in any environment) ---
const DATA_DIR = path.resolve(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'users.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readLocalUsers(): IUser[] {
  ensureDataDir();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed.map((u: any) => ({
      ...u,
      createdAt: new Date(u.createdAt),
    }));
  } catch (err) {
    console.error('Error reading local users:', err);
    return [];
  }
}

function writeLocalUsers(users: IUser[]) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

// --- Unified User Repository API ---

export async function findUserByGoogleId(googleId: string): Promise<IUser | null> {
  if (isMongoConnected && MongooseUserModel) {
    try {
      const doc = await MongooseUserModel.findOne({ googleId }).lean().exec();
      if (doc) return doc as unknown as IUser;
    } catch (err) {
      console.warn('Mongoose query error, falling back to local store:', err);
    }
  }

  const users = readLocalUsers();
  return users.find((u) => u.googleId === googleId) || null;
}

export async function findUserByEmail(email: string): Promise<IUser | null> {
  if (isMongoConnected && MongooseUserModel) {
    try {
      const doc = await MongooseUserModel.findOne({ email: email.toLowerCase() }).lean().exec();
      if (doc) return doc as unknown as IUser;
    } catch (err) {
      console.warn('Mongoose query error:', err);
    }
  }

  const users = readLocalUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function upsertGoogleUser(userData: {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
}): Promise<{ user: IUser; isNewUser: boolean }> {
  const sanitized = {
    googleId: userData.googleId.trim(),
    email: userData.email.trim().toLowerCase(),
    name: userData.name.trim(),
    picture: userData.picture?.trim() || '',
  };

  if (isMongoConnected && MongooseUserModel) {
    try {
      let existing = await MongooseUserModel.findOne({ googleId: sanitized.googleId }).exec();
      if (existing) {
        let changed = false;
        if (existing.name !== sanitized.name) {
          existing.name = sanitized.name;
          changed = true;
        }
        if (sanitized.picture && existing.picture !== sanitized.picture) {
          existing.picture = sanitized.picture;
          changed = true;
        }
        if (changed) {
          await existing.save();
        }
        return { user: existing.toObject(), isNewUser: false };
      } else {
        const created = await MongooseUserModel.create({
          ...sanitized,
          createdAt: new Date(),
        });
        return { user: created.toObject(), isNewUser: true };
      }
    } catch (err) {
      console.warn('Mongoose write error, continuing with local store:', err);
    }
  }

  // Local persistent storage
  const users = readLocalUsers();
  const existingIdx = users.findIndex((u) => u.googleId === sanitized.googleId);

  if (existingIdx >= 0) {
    users[existingIdx] = {
      ...users[existingIdx],
      name: sanitized.name,
      picture: sanitized.picture || users[existingIdx].picture,
    };
    writeLocalUsers(users);
    return { user: users[existingIdx], isNewUser: false };
  } else {
    const newUser: IUser = {
      ...sanitized,
      createdAt: new Date(),
    };
    users.push(newUser);
    writeLocalUsers(users);
    return { user: newUser, isNewUser: true };
  }
}

export async function getAllUsers(): Promise<IUser[]> {
  if (isMongoConnected && MongooseUserModel) {
    try {
      const docs = await MongooseUserModel.find().lean().exec();
      return docs as unknown as IUser[];
    } catch {
      // fallback
    }
  }
  return readLocalUsers();
}
