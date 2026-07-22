import ReactDOM from 'react-dom/client';
import { App } from './App.jsx';
import './index.css';

// No StrictMode: preserves the original prototype's exact runtime behavior
// (double-invoked effects in dev could visibly double-fire things like the
// hero slider interval or the simulated-submit setTimeout animations).
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
