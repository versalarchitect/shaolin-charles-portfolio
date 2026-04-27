import { createBrowserRouter, redirect } from 'react-router-dom'
import { lazy } from 'react'
import App from './App'

// Homepage (load eagerly for fastest initial render)
import Home from './pages/Home'

// Lazy load all other pages (React Router v7 + React 19 code splitting)
const Curriculum = lazy(() => import('./pages/Curriculum'))
const Principles = lazy(() => import('./pages/Principles'))
const Tiers = lazy(() => import('./pages/Tiers'))
const Instructor = lazy(() => import('./pages/Instructor'))
const About = lazy(() => import('./pages/About'))
const Projects = lazy(() => import('./pages/Projects'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const Art = lazy(() => import('./pages/Art'))
const Interests = lazy(() => import('./pages/Interests'))
const Contact = lazy(() => import('./pages/Contact'))
const Login = lazy(() => import('./pages/Login'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Create router
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Homepage
      {
        index: true,
        element: <Home />,
      },
      // Main pages
      {
        path: 'curriculum',
        element: <Curriculum />,
      },
      {
        path: 'principles',
        element: <Principles />,
      },
      {
        path: 'tiers',
        element: <Tiers />,
      },
      {
        path: 'instructor',
        element: <Instructor />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'projects',
        element: <Projects />,
      },
      {
        path: 'blog',
        element: <Blog />,
      },
      {
        path: 'blog/:slug',
        element: <BlogPost />,
      },
      {
        path: 'art',
        loader: () => redirect('/art/abstract'),
      },
      {
        path: 'art/:category',
        element: <Art />,
      },
      {
        path: 'interests',
        loader: () => redirect('/instructor'),
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      // 404 catch-all (must be last)
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])

export default router

