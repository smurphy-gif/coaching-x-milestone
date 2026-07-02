import CoachingPlatform from './CoachingPlatform.jsx'
import './index.css'

// No login here on purpose — this app is used by a single coach, and all
// data lives in Monday.com (see mondayClient.js / README.md). If you later
// need each loan officer to have their own view, that's a bigger change:
// you'd need some form of per-person auth again.
export default function App() {
  return <CoachingPlatform />
}
