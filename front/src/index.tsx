import ReactDOM from 'react-dom/client';
import App from './pages/App';
import reportWebVitals from './util/reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Index from './pages/Index';
import OrgChart from './pages/OrgChart';
import { StrictMode } from 'react';
import OrgCreate from './pages/OrgCreate';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Index />,
      },
      {
        path: 'organisations',
        children: [
          {
            path: '',
            element: <OrgChart />,
          },
          {
            path: 'create',
            element: <OrgCreate />,
          },
        ],
      },
    ],
  },
]);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
