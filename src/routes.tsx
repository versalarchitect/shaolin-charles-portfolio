import { createBrowserRouter, redirect } from 'react-router-dom'
import { lazy } from 'react'
import App from './App'
import { AuthGuard } from './components/auth-guard'
import { AccessGuard } from './components/access-guard'
import { RouteErrorBoundary } from './components/route-error-boundary'

// Lazy load all pages (React Router v7 + React 19 code splitting)
const Home = lazy(() => import('./pages/Home'))
const Curriculum = lazy(() => import('./pages/Curriculum'))
const Principles = lazy(() => import('./pages/Principles'))
const Tiers = lazy(() => import('./pages/Tiers'))
const Instructor = lazy(() => import('./pages/Instructor'))
const About = lazy(() => import('./pages/About'))
const Projects = lazy(() => import('./pages/Projects'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const Art = lazy(() => import('./pages/Art'))
const Contact = lazy(() => import('./pages/Contact'))
const Login = lazy(() => import('./pages/Login'))
const EnrollSuccess = lazy(() => import('./pages/EnrollSuccess'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Learn = lazy(() => import('./pages/Learn'))
const Community = lazy(() => import('./pages/Community'))
const CommunityThread = lazy(() => import('./pages/CommunityThread'))
const Chat = lazy(() => import('./pages/Chat'))
const Profile = lazy(() => import('./pages/Profile'))
const InstructorDashboard = lazy(() => import('./pages/InstructorDashboard'))
const SelfUpdatingCourse = lazy(() => import('./pages/SelfUpdatingCourse'))
const RecentProjects = lazy(() => import('./pages/RecentProjects'))
const Pipeline = lazy(() => import('./pages/Pipeline'))
const StudentAgent = lazy(() => import('./pages/StudentAgent'))
const Leaderboard = lazy(() => import('./pages/Leaderboard'))
const Analytics = lazy(() => import('./pages/Analytics'))
const SecretVault = lazy(() => import('./pages/SecretVault'))
const PublicProfile = lazy(() => import('./pages/PublicProfile'))
const AuthCallback = lazy(() => import('./pages/AuthCallback'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Create router
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouteErrorBoundary />,
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
        path: 'self-updating-course',
        element: <SelfUpdatingCourse />,
      },
      {
        path: 'recent-projects',
        element: <RecentProjects />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'auth/callback',
        element: <AuthCallback />,
      },
      {
        path: 'enroll/success',
        element: <EnrollSuccess />,
      },
      // Public profile (no auth required)
      {
        path: 'profile/:userId',
        element: <PublicProfile />,
      },
      // Course (protected + access-gated) routes
      {
        path: 'course/dashboard',
        element: <AuthGuard><AccessGuard><Dashboard /></AccessGuard></AuthGuard>,
      },
      {
        path: 'course/curriculum',
        element: <AuthGuard><AccessGuard><Curriculum /></AccessGuard></AuthGuard>,
      },
      {
        path: 'course/learn/:lessonId/:step',
        element: <AuthGuard><AccessGuard><Learn /></AccessGuard></AuthGuard>,
      },
      {
        path: 'course/learn/:lessonId',
        element: <AuthGuard><AccessGuard><Learn /></AccessGuard></AuthGuard>,
      },
      {
        path: 'course/community',
        element: <AuthGuard><AccessGuard><Community /></AccessGuard></AuthGuard>,
      },
      {
        path: 'course/community/thread/:threadId',
        element: <AuthGuard><AccessGuard><CommunityThread /></AccessGuard></AuthGuard>,
      },
      {
        path: 'course/chat',
        element: <AuthGuard><AccessGuard><Chat /></AccessGuard></AuthGuard>,
      },
      {
        path: 'course/profile',
        element: <AuthGuard><AccessGuard><Profile /></AccessGuard></AuthGuard>,
      },
      {
        path: 'course/knowledge-base',
        element: <AuthGuard><AccessGuard><InstructorDashboard /></AccessGuard></AuthGuard>,
      },
      {
        path: 'course/pipeline',
        element: <AuthGuard><AccessGuard><Pipeline /></AccessGuard></AuthGuard>,
      },
      {
        path: 'course/student-agent',
        element: <AuthGuard><AccessGuard><StudentAgent /></AccessGuard></AuthGuard>,
      },
      {
        path: 'course/leaderboard',
        element: <AuthGuard><AccessGuard><Leaderboard /></AccessGuard></AuthGuard>,
      },
      {
        path: 'course/analytics',
        element: <AuthGuard><AccessGuard><Analytics /></AccessGuard></AuthGuard>,
      },
      {
        path: 'course/vault',
        element: <AuthGuard><AccessGuard><SecretVault /></AccessGuard></AuthGuard>,
      },
      // Redirects from old paths
      {
        path: 'dashboard',
        loader: () => redirect('/course/dashboard'),
      },
      {
        path: 'learn/:lessonId/:step',
        loader: ({ params }) => redirect(`/course/learn/${params.lessonId}/${params.step}`),
      },
      {
        path: 'learn/:lessonId',
        loader: ({ params }) => redirect(`/course/learn/${params.lessonId}`),
      },
      {
        path: 'community',
        loader: () => redirect('/course/community'),
      },
      {
        path: 'community/thread/:threadId',
        loader: ({ params }) => redirect(`/course/community/thread/${params.threadId}`),
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

