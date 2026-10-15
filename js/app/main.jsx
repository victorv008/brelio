// Appens startpunkt — monterar WebApp i #root.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { WebApp } from './web-app.jsx';

createRoot(document.getElementById('root')).render(<WebApp />);
