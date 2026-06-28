import { type ReactNode } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Wallet,
  Share2,
  MessageCircle,
} from "lucide-react";

export interface DashboardNavItem {
  to: string;
  label: string;
  icon?: ReactNode;
}

const ic = "h-4 w-4";

/** Single source of truth for each role's sidebar nav (shared across all pages). */
export const STUDENT_NAV: DashboardNavItem[] = [
  { to: "/student", label: "Overview", icon: <LayoutDashboard className={ic} /> },
  { to: "/student/courses", label: "My Courses", icon: <BookOpen className={ic} /> },
  { to: "/student/referrals", label: "Referrals", icon: <Share2 className={ic} /> },
  { to: "/student/doubts", label: "Doubts", icon: <MessageCircle className={ic} /> },
];

export const TEACHER_NAV: DashboardNavItem[] = [
  { to: "/teacher", label: "Overview", icon: <LayoutDashboard className={ic} /> },
  { to: "/teacher/subjects", label: "My Subjects", icon: <BookOpen className={ic} /> },
  { to: "/teacher/earnings", label: "Earnings", icon: <Wallet className={ic} /> },
  { to: "/teacher/doubts", label: "Doubts", icon: <MessageCircle className={ic} /> },
];

export const ADMIN_NAV: DashboardNavItem[] = [
  { to: "/admin", label: "Overview", icon: <LayoutDashboard className={ic} /> },
  { to: "/admin/courses", label: "Courses", icon: <BookOpen className={ic} /> },
  { to: "/admin/teachers", label: "Teachers", icon: <Users className={ic} /> },
  { to: "/admin/referrals", label: "Referrals", icon: <Share2 className={ic} /> },
  { to: "/admin/withdrawals", label: "Withdrawals", icon: <Wallet className={ic} /> },
];
