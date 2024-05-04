import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from "./views/Home";
import Post from "./views/Post";
import BlogHeader from "./components/BlogHeader";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';

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
    <div className="absolute texture w-full h-full z-0 pointer-events-none"></div>
    <div>
      <div className="relative m-auto max-w-6xl min-w-xl bg-shion content shadow-lg z-10 rounded-sm ">
        <div className="absolute paper w-full h-full pointer-events-none z-10"></div>
        <BlogHeader></BlogHeader>
        <div className="content">
          <RouterProvider router={router} />
        </div>
      </div>
    </div>
  </React.StrictMode>,
)
