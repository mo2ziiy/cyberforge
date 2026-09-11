import { connectDB } from "./mongodb";
import User from "@/models/User";

export const POINTS_CONFIG = {
  completeTopic: 10,
  favoriteTool: 2,
  bookmark: 1,
  dailyLogin: 5,
  completeTrack: 100,
  firstLogin: 20,
} as const;

type PointAction = keyof typeof POINTS_CONFIG;

export async function awardPoints(
  userId: string,
  action: PointAction,
  label?: string
): Promise<number> {
  await connectDB();
  const pts = POINTS_CONFIG[action];
  const notification = label
    ? {
        message: `+${pts} points — ${label}`,
        type: "points" as const,
        read: false,
        createdAt: new Date(),
      }
    : null;

  const update: Record<string, unknown> = { $inc: { points: pts } };
  if (notification) {
    update.$push = { notifications: { $each: [notification], $position: 0, $slice: 50 } };
  }

  const updated = await User.findByIdAndUpdate(userId, update, { new: true }).select("points");
  return updated?.points ?? 0;
}

export async function deductPoints(
  userId: string,
  action: PointAction
): Promise<number> {
  await connectDB();
  const pts = POINTS_CONFIG[action];
  // Never go below 0
  const user = await User.findById(userId).select("points");
  const currentPoints = user?.points ?? 0;
  const newPoints = Math.max(0, currentPoints - pts);
  const updated = await User.findByIdAndUpdate(
    userId,
    { $set: { points: newPoints } },
    { new: true }
  ).select("points");
  return updated?.points ?? 0;
}

export async function updateStreak(userId: string): Promise<{ streak: number; isNewDay: boolean }> {
  await connectDB();
  const user = await User.findById(userId).select("streak lastActiveDate notifications");
  if (!user) return { streak: 0, isNewDay: false };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (user.lastActiveDate) {
    const last = new Date(user.lastActiveDate);
    const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate());
    const diffMs = today.getTime() - lastDay.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays === 0) {
      // Already active today
      return { streak: user.streak, isNewDay: false };
    } else if (diffDays === 1) {
      // Consecutive day — increment streak
      user.streak += 1;
      const milestones = [3, 7, 14, 30, 60, 100];
      if (milestones.includes(user.streak)) {
        user.notifications.unshift({
          message: `You're on a ${user.streak}-day streak! Keep it up!`,
          type: "streak" as const,
          read: false,
          createdAt: new Date(),
        } as never);
      }
    } else {
      // Streak broken
      if (user.streak > 1) {
        user.notifications.unshift({
          message: `Your ${user.streak}-day streak ended. Start a new one today!`,
          type: "streak" as const,
          read: false,
          createdAt: new Date(),
        } as never);
      }
      user.streak = 1;
    }
  } else {
    user.streak = 1;
  }

  user.lastActiveDate = now;
  // Keep only 50 notifications
  if (user.notifications.length > 50) {
    user.notifications = user.notifications.slice(0, 50);
  }
  await user.save();
  return { streak: user.streak, isNewDay: true };
}
