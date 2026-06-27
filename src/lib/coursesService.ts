// Course data-access layer (the durable seam).
//
// Today this wraps the in-memory `mockData` arrays. Every mutator is async and
// has a stable signature so the implementation can later be swapped to Supabase
// without touching any component. See the plan's "Later (Supabase swap)" notes.

import { useSyncExternalStore } from "react";
import {
  courses,
  teacherAssignments,
  getCourse,
  getSubject,
  getChapter,
  getTopic,
  getTeacherSubjects,
  getTeacherEarnings,
  type Course,
  type Subject,
  type Chapter,
  type Topic,
} from "@/lib/mockData";

export type DisplayMode = "carousel" | "cards";

const uid = () => Math.random().toString(36).slice(2, 9);

// ---------- Reactive store ----------
// A monotonic version counter is the snapshot. Because it is a primitive, React
// compares it by value, so `useCourses()` never infinite-loops (the classic
// useSyncExternalStore footgun of returning a fresh array each call). Components
// read the live `courses` array after subscribing to version changes.

let version = 0;
const listeners = new Set<() => void>();

function bump() {
  version++;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => version;

/** Subscribe a component to course-data changes; returns the live courses array. */
export function useCourses(): Course[] {
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return courses;
}

// ---------- Group display modes ----------

const groupDisplayModes: Record<string, DisplayMode> = {};

export function getGroupDisplayMode(category: string): DisplayMode {
  return groupDisplayModes[category] ?? "cards";
}

export async function setGroupDisplayMode(category: string, mode: DisplayMode) {
  groupDisplayModes[category] = mode;
  bump();
}

// ---------- Courses ----------

export interface CourseInput {
  title: string;
  description?: string;
  price: number;
  color?: string;
  category?: string;
  thumbnail?: string;
  isActive?: boolean;
}

export async function createCourse(input: CourseInput): Promise<Course> {
  const course: Course = {
    id: `c-${uid()}`,
    title: input.title,
    description: input.description ?? "",
    price: input.price,
    color: input.color,
    category: input.category,
    thumbnail: input.thumbnail,
    isActive: input.isActive ?? true,
    subjects: [],
  };
  courses.push(course);
  bump();
  return course;
}

export async function updateCourse(id: string, patch: Partial<CourseInput>) {
  const course = getCourse(id);
  if (!course) return;
  Object.assign(course, patch);
  bump();
}

export async function deleteCourse(id: string) {
  const i = courses.findIndex((c) => c.id === id);
  if (i >= 0) courses.splice(i, 1);
  bump();
}

export async function moveCourse(id: string, dir: -1 | 1) {
  move(courses, courses.findIndex((c) => c.id === id), dir);
}

// ---------- Subjects ----------

export async function createSubject(
  courseId: string,
  input: { title: string; icon?: string },
): Promise<Subject | undefined> {
  const course = getCourse(courseId);
  if (!course) return;
  const subject: Subject = {
    id: `s-${uid()}`,
    courseId,
    title: input.title,
    icon: input.icon,
    chapters: [],
  };
  course.subjects.push(subject);
  bump();
  return subject;
}

export async function updateSubject(
  id: string,
  patch: Partial<Pick<Subject, "title" | "icon">>,
) {
  const found = getSubject(id);
  if (!found) return;
  Object.assign(found.subject, patch);
  bump();
}

export async function deleteSubject(id: string) {
  const found = getSubject(id);
  if (!found) return;
  const arr = found.course.subjects;
  arr.splice(arr.findIndex((s) => s.id === id), 1);
  bump();
}

export async function moveSubject(id: string, dir: -1 | 1) {
  const found = getSubject(id);
  if (!found) return;
  const arr = found.course.subjects;
  move(arr, arr.findIndex((s) => s.id === id), dir);
}

// ---------- Chapters ----------

export async function createChapter(
  subjectId: string,
  input: { title: string },
): Promise<Chapter | undefined> {
  const found = getSubject(subjectId);
  if (!found) return;
  const chapter: Chapter = {
    id: `ch-${uid()}`,
    subjectId,
    title: input.title,
    topics: [],
  };
  found.subject.chapters.push(chapter);
  bump();
  return chapter;
}

export async function updateChapter(
  id: string,
  patch: Partial<Pick<Chapter, "title">>,
) {
  const found = getChapter(id);
  if (!found) return;
  Object.assign(found.chapter, patch);
  bump();
}

export async function deleteChapter(id: string) {
  const found = getChapter(id);
  if (!found) return;
  const arr = found.subject.chapters;
  arr.splice(arr.findIndex((ch) => ch.id === id), 1);
  bump();
}

export async function moveChapter(id: string, dir: -1 | 1) {
  const found = getChapter(id);
  if (!found) return;
  const arr = found.subject.chapters;
  move(arr, arr.findIndex((ch) => ch.id === id), dir);
}

// ---------- Topics ----------

export interface TopicInput {
  title: string;
  youtubeId: string;
  pdfUrl?: string;
  unlockAt?: string;
  description?: string;
}

export async function createTopic(
  chapterId: string,
  input: TopicInput,
): Promise<Topic | undefined> {
  const found = getChapter(chapterId);
  if (!found) return;
  const topic: Topic = {
    id: `t-${uid()}`,
    chapterId,
    title: input.title,
    youtubeId: input.youtubeId,
    pdfUrl: input.pdfUrl ?? "",
    unlockAt: input.unlockAt || undefined,
    description: input.description,
  };
  found.chapter.topics.push(topic);
  bump();
  return topic;
}

export async function updateTopic(id: string, patch: Partial<TopicInput>) {
  const found = getTopic(id);
  if (!found) return;
  Object.assign(found.topic, patch);
  bump();
}

export async function deleteTopic(id: string) {
  const found = getTopic(id);
  if (!found) return;
  const arr = found.chapter.topics;
  arr.splice(arr.findIndex((t) => t.id === id), 1);
  bump();
}

export async function moveTopic(id: string, dir: -1 | 1) {
  const found = getTopic(id);
  if (!found) return;
  const arr = found.chapter.topics;
  move(arr, arr.findIndex((t) => t.id === id), dir);
}

// ---------- Teacher access ----------
//
// TODO: remove when teacher_assignments lands.
// Mock assignments key off ids like "u-teacher1", but `useAuth()` returns a
// Supabase UUID, so a real teacher resolves to zero subjects. While the catalog
// is still mock-backed, fall back to a mock teacher so the teacher flow is
// testable end-to-end in development.
function resolveTeacherId(userId: string): string {
  const hasMock = teacherAssignments.some((a) => a.teacherId === userId);
  return hasMock ? userId : "u-teacher1";
}

export function getTeacherSubjectsForUser(userId: string) {
  return getTeacherSubjects(resolveTeacherId(userId));
}

export function getTeacherEarningsForUser(userId: string) {
  return getTeacherEarnings(resolveTeacherId(userId));
}

export function canTeacherEditSubject(userId: string, subjectId: string): boolean {
  return getTeacherSubjectsForUser(userId).some((a) => a.subject.id === subjectId);
}

// ---------- internal ----------

function move<T>(arr: T[], index: number, dir: -1 | 1) {
  if (index < 0) return;
  const target = index + dir;
  if (target < 0 || target >= arr.length) return;
  [arr[index], arr[target]] = [arr[target], arr[index]];
  bump();
}
