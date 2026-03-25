import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { roomCode, playerId, code, testsPassed, totalTests } = await request.json();

    const { data: room, error: findError } = await supabase
      .from('codeduel_rooms')
      .select('*')
      .eq('code', roomCode)
      .single();

    if (findError || !room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const isPlayer1 = room.player1_id === playerId;
    const isPlayer2 = room.player2_id === playerId;
    if (!isPlayer1 && !isPlayer2) {
      return NextResponse.json({ error: 'You are not in this room' }, { status: 403 });
    }

    const updateData: Record<string, unknown> = {};
    const playerPrefix = isPlayer1 ? 'player1' : 'player2';

    updateData[`${playerPrefix}_code`] = code;
    updateData[`${playerPrefix}_tests_passed`] = testsPassed;
    updateData[`${playerPrefix}_total_tests`] = totalTests;
    updateData[`${playerPrefix}_submitted`] = true;
    updateData[`${playerPrefix}_submit_time`] = new Date().toISOString();

    // Check if the other player already submitted
    const otherSubmitted = isPlayer1 ? room.player2_submitted : room.player1_submitted;
    const otherTestsPassed = isPlayer1 ? room.player2_tests_passed : room.player1_tests_passed;

    if (otherSubmitted) {
      // Both submitted — determine winner
      if (testsPassed > otherTestsPassed) {
        updateData.winner = playerPrefix;
      } else if (testsPassed < otherTestsPassed) {
        updateData.winner = isPlayer1 ? 'player2' : 'player1';
      } else {
        // Same tests passed — earlier submitter wins
        updateData.winner = 'tie';
      }
      updateData.status = 'finished';
    } else if (testsPassed === totalTests) {
      // This player solved everything — they win immediately
      updateData.winner = playerPrefix;
      updateData.status = 'finished';
    }

    const { error: updateError } = await supabase
      .from('codeduel_rooms')
      .update(updateData)
      .eq('id', room.id);

    if (updateError) {
      console.error('Submit error:', updateError);
      return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      finished: updateData.status === 'finished',
      winner: updateData.winner || null,
    });
  } catch (err) {
    console.error('Submit API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
