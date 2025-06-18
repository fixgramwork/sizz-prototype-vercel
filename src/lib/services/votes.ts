'use server';

import { supabase } from '../supabase/client';
import { auth } from '@clerk/nextjs/server';

export async function getVoteForArticle(articleId: string) {
    try {
        const { userId } = await auth();
        if (!userId) return null;

        // Clerk ID로 실제 사용자 ID 찾기
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('clerk_id', userId)
            .single();

        if (userError || !user) return null;

        const { data, error } = await supabase
            .from('votes')
            .select('vote_type')
            .eq('user_id', user.id)
            .eq('article_id', articleId)
            .single();

        if (error) return null;
        return data?.vote_type;
    } catch (error) {
        console.error('Error getting vote for article:', error);
        return null;
    }
} 