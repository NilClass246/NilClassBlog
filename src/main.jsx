import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from "./views/Home";
import Post from "./views/Post";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import AudioCard from './components/AudioCard';
import BlogFooter from './components/BlogFooter';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
  },
  {
    path: "/post/:id",
    element: <Post></Post>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="relative">
    <div className="absolute crane z-0 pointer-events-none"></div>
    <div className="absolute grass z-0 pointer-events-none"></div>
    <div className="absolute texture w-full h-full z-0 pointer-events-none"></div>
      <div className="relative m-auto max-w-6xl min-w-xl bg-shion content shadow-lg z-10 rounded-sm min-h-screen">
        <div className="absolute paper w-full h-full pointer-events-none z-10"></div>
        <div className='flex flex-col'>
          <div className="content">
            <RouterProvider router={router} />
          </div>
          <BlogFooter></BlogFooter>
        </div>
      </div>
    </div>
    <AudioCard></AudioCard>
  </React.StrictMode>,
)
