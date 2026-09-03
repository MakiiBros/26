import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://usxhvlchkuzmbrqkgpqn.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_7YQxGQBsq6Sy1fPiMn85SA_uWAdyoso'

const adminClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function run() {
  const { data, error } = await adminClient.auth.signInWithPassword({
    email: 'admin@makibros.me',
    password: 'AdminMakisBros2026!',
  })
  
  if (error) {
    console.error("Sign in error:", error)
    return
  }
  console.log("Signed in successfully as:", data.user?.email)
  
  // Try to fetch dish ae
  const id = 'a4171a7a-46f5-4f8e-af1d-d938b30aec00'
  const { data: dish, error: fetchError } = await adminClient
      .from('dishes')
      .select('image_url')
      .eq('id', id)
      .single()
      
  console.log("Fetch result:", dish, fetchError)
}
run()
