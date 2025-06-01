import { createFileRoute } from '@tanstack/react-router';
import { useQueryState } from 'nuqs';
import z from 'zod';
const paramSchema = z.object({
  userId: z.union([z.string(), z.number()]).optional(),
});

export const Route = createFileRoute('/_public/users/fetch/$userId')({
  component: RouteComponent,
  validateSearch: paramSchema,
  loader: async ({ params }) => {
    console.log(params.userId);
    paramSchema.parse(params);
    return params.userId;
  },
});

function RouteComponent() {
  const paramIdFromLoader = Route.useLoaderData();
  const param = Route.useParams();

  const [userId, setUserId] = useQueryState('userId');

  return (
    <div>
      Hello "/_public/users/fetch"!
      <h1>{paramIdFromLoader}</h1>
      <h4>{param.userId}</h4>
      <h2>{userId}</h2>
      <input type="text" value={userId} onChange={e => setUserId(e.target.value)} />
    </div>
  );
}
