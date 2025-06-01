import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/sample_public')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_public/sample_public"!</div>
}
