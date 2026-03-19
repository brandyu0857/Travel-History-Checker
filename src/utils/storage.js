import { supabase } from '../lib/supabase';

function toEntry(row) {
  return {
    id: row.id,
    date: row.date,
    destination: row.destination,
    departureCity: row.departure_city,
    duration: row.duration,
    purpose: row.purpose,
    note: row.note || '',
  };
}

function toRow(entry) {
  return {
    id: entry.id,
    date: entry.date,
    destination: entry.destination,
    departure_city: entry.departureCity,
    duration: entry.duration,
    purpose: entry.purpose,
    note: entry.note || '',
  };
}

export async function loadEntries() {
  const { data, error } = await supabase
    .from('travel_entries')
    .select('*')
    .order('date', { ascending: false });
  if (error) throw error;
  return data.map(toEntry);
}

export async function addEntry(entry) {
  const { error } = await supabase.from('travel_entries').insert(toRow(entry));
  if (error) throw error;
}

export async function updateEntry(entry) {
  const { error } = await supabase
    .from('travel_entries')
    .update(toRow(entry))
    .eq('id', entry.id);
  if (error) throw error;
}

export async function deleteEntry(id) {
  const { error } = await supabase.from('travel_entries').delete().eq('id', id);
  if (error) throw error;
}
