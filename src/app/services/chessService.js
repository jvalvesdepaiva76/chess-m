import { supabase } from './supabaseClient'; // O cliente Supabase que você já configurou

// Busca aberturas no banco de dados
export const getAberturas = async () => {
  const { data, error } = await supabase
    .from('aberturas') // Nome da tabela de aberturas
    .select('id, position, name'); // Pegamos apenas as colunas necessárias

  if (error) {
    console.error('Erro ao buscar aberturas:', error);
    return [];
  }

  return data;
};

// Busca cheque mates no banco de dados
export const getChequeMates = async () => {
  const { data, error } = await supabase
    .from('chequemates') // Nome da tabela de cheque mates
    .select('id, position, name'); // Pegamos apenas as colunas necessárias

  if (error) {
    console.error('Erro ao buscar cheque mates:', error);
    return [];
  }

  return data;
};
