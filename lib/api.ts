import axios from 'axios';
import type { Note, CreateNoteInput } from '../types/note';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const BASE_URL = 'https://notehub-public.goit.study/api';
const NEXT_PUBLIC_NOTEHUB_TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

export async function fetchNotes(
  search: string,
  page: number,
  perPage: number = 12,
  tag: string = ''
): Promise<FetchNotesResponse> {
  const params: Record<string, string | number> = {
    search,
    page,
    perPage,
  };
  if (tag && tag !== 'all') {
    params.tag = tag;
  }

  const response = await axiosInstance.get<FetchNotesResponse>('/notes', {
    params,
  });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await axiosInstance.get<Note>(`/notes/${id}`);
  return response.data;
}

export async function createNote(noteData: CreateNoteInput): Promise<Note> {
  const response = await axiosInstance.post<Note>('/notes', noteData);
  return response.data;
}
export async function deleteNote(id: string): Promise<Note> {
  const response = await axiosInstance.delete<Note>(`/notes/${id}`);
  return response.data;
}
