import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function NotesPage({ params }: PageProps) {
  const queryClient = new QueryClient();

  const { slug } = await params;
  const currentTag = slug && slug[0] ? slug[0] : 'all';
  const apiTag = currentTag === 'all' ? '' : currentTag;

  await queryClient.prefetchQuery({
    queryKey: ['notes', '', 1, 12, apiTag],
    queryFn: () => fetchNotes('', 1, 12, apiTag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={currentTag} />
    </HydrationBoundary>
  );
}
