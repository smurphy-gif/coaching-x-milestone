/**
 * Platform.jsx
 * 
 * This is the wrapper that connects your authenticated user to the 
 * coaching platform UI. Right now it renders the full prototype.
 * 
 * DEVELOPER NOTE: To connect to Supabase, replace the local state
 * management in CoachingPlatform with Supabase queries. The data
 * structures are identical — the database schema maps 1:1.
 * 
 * Phase 1 (what's here now): Full working UI with local state
 * Phase 2 (developer task): Swap local state for Supabase queries
 */

import CoachingPlatform from './CoachingPlatform.jsx'

export default function Platform({ user, session, onLogout }) {
  return <CoachingPlatform currentUser={user} onLogout={onLogout} />
}
