import { createClient } from '@supabase/supabase-js'
import { FIREBASE_CONFIG } from './src/lib/constants'

// We need SUPABASE_URL and SUPABASE_ANON_KEY from environment or constants
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'missing'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'missing'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function run() {
  const { data, error } = await supabase.from('dishes').select('*')
  console.log("DISHES:", data)
  console.log("ERROR:", error)
}
run()
