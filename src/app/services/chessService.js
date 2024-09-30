import { supabase } from './supabaseClient';

// Função para obter todos os cheque mates
export const getChequeMates = async () => {
  const { data, error } = await supabase.from('cheque_mates').select('*');
  if (error) {
    console.error('Erro ao buscar cheque mates:', error);
    return [];
  }
  return data;
};

// Função para obter todas as aberturas
export const getAberturas = async () => {
  const { data, error } = await supabase.from('aberturas').select('*');
  if (error) {
    console.error('Erro ao buscar aberturas:', error);
    return [];
  }
  return data;
};
