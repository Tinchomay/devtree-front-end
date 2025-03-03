import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
//importamos antes del css y del router para que se carguen bien
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import './app.css'
import Router from './router'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router />
      {/* Este componente sirve para visualizar las peticiones */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
