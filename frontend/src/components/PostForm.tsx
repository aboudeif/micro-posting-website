'use client';

import { useState, FormEvent } from 'react';

interface PostFormProps {
  onSubmit: (content: string) => Promise<void>;
}

export function PostForm({ onSubmit }: PostFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(content);
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        id="postContent"
        rows={3}
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button
        type="submit"
        style={{ marginTop: '10px', width: 'auto' }}
        disabled={isSubmitting || !content.trim()}
      >
        {isSubmitting ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
}
