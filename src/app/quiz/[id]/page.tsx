import { quizzes } from "@/data/quizzes";
import QuizClient from "./QuizClient";

/** Pre-render one static page per quiz for the static export. */
export function generateStaticParams() {
  return quizzes.map((q) => ({ id: q.id }));
}

export default function QuizDetailPage() {
  return <QuizClient />;
}
