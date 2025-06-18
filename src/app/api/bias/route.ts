import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = createSupabaseClient();

        // Clerk ID로 실제 사용자 ID 찾기
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('clerk_id', userId)
            .single();

        if (userError) {
            console.error('Error fetching user:', userError);
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 사용자의 투표 데이터 조회
        const { data: votes, error: votesError } = await supabase
            .from('votes')
            .select(`*,articles:article_id (id,title,source,bias)`)
            .eq('user_id', user.id);

        if (votesError) {
            console.error('Error fetching votes:', votesError);
            return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 });
        }

        // 성향 점수 계산
        let leftVotes = 0;
        let centerVotes = 0;
        let rightVotes = 0;
        let totalVotes = 0;
        let agreeVotes = 0;
        let disagreeVotes = 0;

        const userBiasArticles = new Set();

        votes?.forEach(vote => {
            if (vote.articles) {
                userBiasArticles.add(vote.articles.bias);

                if (vote.vote_type === true) {
                    agreeVotes++;
                    if (vote.articles.bias === 'left') leftVotes++;
                    else if (vote.articles.bias === 'center') centerVotes++;
                    else if (vote.articles.bias === 'right') rightVotes++;
                } else if (vote.vote_type === false) {
                    disagreeVotes++;
                    // 반대 투표는 반대 성향으로 계산
                    if (vote.articles.bias === 'left') rightVotes++;
                    else if (vote.articles.bias === 'center') centerVotes++;
                    else if (vote.articles.bias === 'right') leftVotes++;
                }
                totalVotes++;
            }
        });

        // 성향 점수 계산 (퍼센트)
        const totalBiasVotes = leftVotes + centerVotes + rightVotes;
        const biasScores = {
            left: totalBiasVotes > 0 ? Math.round((leftVotes / totalBiasVotes) * 100) : 33,
            center: totalBiasVotes > 0 ? Math.round((centerVotes / totalBiasVotes) * 100) : 34,
            right: totalBiasVotes > 0 ? Math.round((rightVotes / totalBiasVotes) * 100) : 33
        };

        // 사용자가 주로 읽는 성향과 반대되는 기사 추천
        let dominantBias = 'center';
        if (leftVotes > rightVotes && leftVotes > centerVotes) {
            dominantBias = 'left';
        } else if (rightVotes > leftVotes && rightVotes > centerVotes) {
            dominantBias = 'right';
        }

        // 반대 성향 기사 조회
        const oppositeBias = dominantBias === 'left' ? 'right' : dominantBias === 'right' ? 'left' : 'center';
        const { data: oppositeArticles, error: articlesError } = await supabase
            .from('articles')
            .select('id, title, source, bias')
            .eq('bias', oppositeBias)
            .limit(4);

        if (articlesError) {
            console.error('Error fetching opposite articles:', articlesError);
        }

        // 읽은 기사 수 계산 (중복 제거)
        const { data: readArticles, error: readError } = await supabase
            .from('votes')
            .select('article_id')
            .eq('user_id', user.id);

        const uniqueArticlesRead = readArticles ? new Set(readArticles.map(v => v.article_id)).size : 0;

        // 통계 데이터
        const stats = {
            totalVotes,
            agreeVotes,
            disagreeVotes,
            articlesRead: uniqueArticlesRead
        };

        return NextResponse.json({
            biasScores,
            oppositeArticles: oppositeArticles || [],
            stats,
            dominantBias
        });

    } catch (error) {
        console.error('Error in GET /api/bias:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const supabase = createSupabaseClient();

        // 사용자가 존재하는지 확인
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('clerk_id', userId)
            .single();

        if (!existingUser) {
            // 사용자가 없으면 생성
            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert({clerk_id: userId, bias: body})
                .select('bias')
                .single();

            if (createError) {
                console.error('Error creating user:', createError);
                return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
            }

            return NextResponse.json(newUser.bias);
        } else {
            // 기존 사용자 업데이트
            const { data, error } = await supabase
                .from('users')
                .update({ bias: body })
                .eq('clerk_id', userId)
                .select('bias')
                .single();

            if (error) {
                console.error('Error updating bias:', error);
                return NextResponse.json({ error: 'Failed to update bias' }, { status: 500 });
            }

            return NextResponse.json(data.bias);
        }
    } catch (error) {
        console.error('Error in PUT /api/bias:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 