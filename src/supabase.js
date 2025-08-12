import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)

// Database functions for players
export const playersAPI = {
  // Get all players
  getAll: async () => {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Add new player
  create: async (player) => {
    const { data, error } = await supabase
      .from('players')
      .insert([player])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update player
  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('players')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete player
  delete: async (id) => {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}

// Database functions for matches
export const matchesAPI = {
  // Get all matches
  getAll: async () => {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('date', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Add new match
  create: async (match) => {
    const { data, error } = await supabase
      .from('matches')
      .insert([match])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update match
  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('matches')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete match
  delete: async (id) => {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}