import { useEffect } from 'react';

const upsertMeta = (name, content) => {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

const removeMeta = (name) => {
  const tag = document.querySelector(`meta[name="${name}"]`);
  if (tag) tag.remove();
};

export default function PageMeta({ title, description, noIndex = false }) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    if (description) {
      upsertMeta('description', description);
    }

    if (noIndex) {
      upsertMeta('robots', 'noindex, nofollow');
    } else {
      removeMeta('robots');
    }
  }, [title, description, noIndex]);

  return null;
}
