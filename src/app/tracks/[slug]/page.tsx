import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tracks } from "@/data/tracks";
import { getTrackDetail } from "@/data/trackDetails";
import Breadcrumb from "@/components/ui/Breadcrumb";
import TrackDetailView from "@/components/tracks/TrackDetailView";

export function generateStaticParams() {
  return tracks.map((t) => ({ slug: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const track = tracks.find((t) => t.id === slug);
  if (!track) return {};
  const detail = getTrackDetail(slug);
  return {
    title: `${track.name} Track`,
    description: detail?.tagline ?? track.description,
  };
}

export default async function TrackDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const track = tracks.find((t) => t.id === slug);
  const detail = getTrackDetail(slug);
  if (!track || !detail) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb items={[{ label: "Tracks", href: "/tracks" }, { label: track.name }]} />
      <TrackDetailView track={track} detail={detail} />
    </div>
  );
}
