import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/_public/users/')({
  component: RouteComponent,
  loader: async () => {
    window.alert('Loader for "/_public/users/"');
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({
      to: '/',
      replace: true,
    });
    return () => {};
  }, []);
  return <div>Hello "/_public/users/"!</div>;
}
