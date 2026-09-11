import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { roadmaps } from "@/data/roadmaps";
import { tracks } from "@/data/tracks";
import { getTrackDetail } from "@/data/trackDetails";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RoadmapBoard from "@/components/roadmaps/RoadmapBoard";

export function generateStaticParams() {
  return roadmaps.map((r) => ({ slug: r.trackId }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const roadmap = roadmaps.find((r) => r.trackId === slug);
  const track = tracks.find((t) => t.id === slug);
  return roadmap ? { title: roadmap.title, description: track?.description } : {};
}

export default async function RoadmapDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const roadmap = roadmaps.find((r) => r.trackId === slug);
  const track = tracks.find((t) => t.id === slug);
  if (!roadmap || !track) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb items={[{ label: "Roadmaps", href: "/roadmaps" }, { label: track.name }]} />
      <RoadmapBoard roadmap={roadmap} track={track} detail={getTrackDetail(slug)} />
    </div>
  );
}
