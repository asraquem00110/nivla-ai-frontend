import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/users/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_public/users/register"!</div>
}
