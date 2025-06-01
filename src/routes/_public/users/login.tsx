import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/users/login')({
  component: RouteComponent,
  loader: async () => {
    return await {
      sample: "Loader for '/_public/users/login'",
    };
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  return <div>Hello "/_public/users/login"! {data.sample}</div>;
}
