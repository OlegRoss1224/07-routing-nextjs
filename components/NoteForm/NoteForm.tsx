import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateNoteInput } from '../../types/note';
import { createNote } from '../../lib/api';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onSuccessClose: () => void;
  onCancel: () => void;
}

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Минимальная длина — 3 символа')
    .max(50, 'Максимальная длина — 50 символов')
    .required('Это обязательное поле!'),

  content: Yup.string().max(500, 'Максимальная длина текста — 500 символов'),

  tag: Yup.string()
    .oneOf(
      ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'],
      'Выбран некорректный тег'
    )
    .required('Это обязательное поле!'),
});

export const NoteForm: React.FC<NoteFormProps> = ({
  onSuccessClose,
  onCancel,
}) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (noteData: CreateNoteInput) => createNote(noteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onSuccessClose();
    },
    onError: error => {
      console.error(
        'Помилка при створенні нотатки через TanStack Query:',
        error
      );
    },
  });

  const initialValues: CreateNoteInput = {
    title: '',
    content: '',
    tag: 'Todo',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={NoteSchema}
      onSubmit={(values, { resetForm }) => {
        createMutation.mutate(values);
        resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              id="content"
              name="content"
              as="textarea"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field id="tag" name="tag" as="select" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={createMutation.isPending || isSubmitting}
            >
              {createMutation.isPending ? 'Creating...' : 'Create note'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
