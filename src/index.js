import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import { App} from './App';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <App />
    </StyledEngineProvider>
  </StrictMode>,
);
