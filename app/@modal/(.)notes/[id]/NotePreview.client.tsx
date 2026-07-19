'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchNoteById } from '@/lib/api';
import { Modal } from '@/components/Modal/Modal';
import type { Note } from '@/types/note';
import css from './NoteModal.module.css';

interface NotePreviewClientProps {
  id: string;
}

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery<Note>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal isOpen={true} onClose={handleClose}>
      <div className={css.modalContent}>
        {isLoading && <p>Loading note details...</p>}
        {isError && <p>Error loading note.</p>}

        {note && (
          <>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.text}>{note.content}</p>
            {note.tag && <span className={css.tag}>#{note.tag}</span>}
          </>
        )}
      </div>
    </Modal>
  );
}
