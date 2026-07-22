import React from 'react';
import ReactDOM from 'react-dom/client';
import { AdminApp } from './AdminApp.jsx';
import './admin.css';

// _ds_bundle.js (compiled design-system bundle, out of scope for this phase)
// was built for the old CDN setup and reads a global `window.React`. Vite
// ships React as an ES module instead, so it never lands on window on its
// own — expose it here so the bundle's Badge component keeps working.
window.React = React;

ReactDOM.createRoot(document.getElementById('root')).render(<AdminApp />);
