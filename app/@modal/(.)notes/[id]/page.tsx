import NotePreview from './NotePreview';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NoteModalPage({ params }: PageProps) {
  const { id } = await params;

  return <NotePreview id={id} />;
}
