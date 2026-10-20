/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx';
import './index.css';

// Read Google OAuth Client ID from environment variable as specified in Part 2, Step 1
const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '1047128912345-demo-sanctuary.apps.googleusercontent.com';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
