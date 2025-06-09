import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@/App.css';

// Import the generated route tree
import { routeTree } from './routeTree.gen';
import { MCPClientProvider } from './providers/MCPClientProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { MapProvider } from 'react-map-gl/mapbox';

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Create a client
const queryClient = new QueryClient();
// Render the app
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <MCPClientProvider>
              <MapProvider>
                <RouterProvider router={router} />
              </MapProvider>
            </MCPClientProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </NuqsAdapter>
    </StrictMode>
  );
}
