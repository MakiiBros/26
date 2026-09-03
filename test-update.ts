import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://usxhvlchkuzmbrqkgpqn.supabase.co'
const SUPABASE_SERVICE_ROLE = 'sb_secret_RRZavO895LZIsK0TGbIaSA_ezwZJinw'

const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

async function run() {
  const id = 'a4171a7a-46f5-4f8e-af1d-d938b30aec00'
  const { data: dish, error } = await adminClient
      .from('dishes')
      .update({ video_360_url: 'http://example.com' })
      .eq('id', id)
      
  console.log("Update result:", error)
}
run()
