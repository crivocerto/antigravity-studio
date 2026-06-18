'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder' // Bypass RLS for admin
);

export async function deleteDeal(id: string) {
  const { error } = await supabase.from('deals').delete().eq('id', id);
  if (error) {
    console.error('Delete error:', error);
    return { error: 'Falha ao deletar a oferta.' };
  }
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

export async function updateDealPrice(id: string, newDiscountPrice: number) {
  const { error } = await supabase
    .from('deals')
    .update({ discount_price: newDiscountPrice })
    .eq('id', id);
    
  if (error) {
    console.error('Update error:', error);
    return { error: 'Falha ao atualizar o preço.' };
  }
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

export async function addManualDeal(formData: FormData) {
  const title = formData.get('title') as string;
  const original_price = parseFloat(formData.get('original_price') as string);
  const discount_price = parseFloat(formData.get('discount_price') as string);
  const affiliate_url = formData.get('affiliate_url') as string;
  const categoria = formData.get('categoria') as string;
  const image_url = formData.get('image_url') as string;

  if (!title || !discount_price || !affiliate_url || !categoria || !image_url) {
    return { error: 'Preencha todos os campos obrigatórios.' };
  }

  const { error } = await supabase.from('deals').insert({
    title,
    original_price: original_price || discount_price,
    discount_price,
    affiliate_url,
    categoria,
    image_url,
    store: 'Manual'
  });

  if (error) {
    console.error('Insert error:', error);
    return { error: 'Falha ao inserir a oferta.' };
  }
  
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}
