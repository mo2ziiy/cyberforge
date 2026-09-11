import mongoose, { Schema, Document } from "mongoose";

export interface INotification {
  _id?: string;
  message: string;
  type: "achievement" | "system" | "streak" | "points";
  read: boolean;
  createdAt: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  avatar: string | undefined;
  bio: string | undefined;
  location: string | undefined;
  website: string | undefined;
  github: string | undefined;
  twitter: string | undefined;
  bookmarks: string[];
  favoriteTools: string[];
  completedTopics: string[];
  points: number;
  streak: number;
  lastActiveDate: Date | null;
  emailVerified: boolean;
  emailVerifyToken: string | undefined;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined;
  notifications: INotification[];
  theme: "dark" | "light";
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    message: { type: String, required: true },
    type: { type: String, enum: ["achievement", "system", "streak", "points"], default: "system" },
    read: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    avatar: { type: String },
    bio: { type: String, maxlength: 200 },
    location: { type: String, maxlength: 100 },
    website: { type: String, maxlength: 200 },
    github: { type: String, maxlength: 100 },
    twitter: { type: String, maxlength: 100 },
    bookmarks: [{ type: String }],
    favoriteTools: [{ type: String }],
    completedTopics: [{ type: String }],
    points: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: null },
    emailVerified: { type: Boolean, default: false },
    emailVerifyToken: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    notifications: [NotificationSchema],
    theme: { type: String, enum: ["dark", "light"], default: "dark" },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
