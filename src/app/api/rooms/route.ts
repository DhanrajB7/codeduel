import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import { getRandomProblem } from '@/lib/problems';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, playerName, code } = body;

    if (!playerName?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const playerId = nanoid(12);

    if (action === 'create') {
      const problem = getRandomProblem();
      const roomCode = generateRoomCode();

      const { data: room, error } = await supabase
        .from('codeduel_rooms')
        .insert({
          code: roomCode,
          problem_id: problem.id,
          status: 'waiting',
          player1_id: playerId,
          player1_name: playerName.trim(),
          time_limit: 300,
        })
        .select()
        .single();

      if (error) {
        console.error('Create room error:', error);
        return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
      }

      return NextResponse.json({ room, playerId });
    }

    if (action === 'join') {
      if (!code?.trim()) {
        return NextResponse.json({ error: 'Room code is required' }, { status: 400 });
      }

      // Find the room
      const { data: room, error: findError } = await supabase
        .from('codeduel_rooms')
        .select('*')
        .eq('code', code.trim().toUpperCase())
        .single();

      if (findError || !room) {
        return NextResponse.json({ error: 'Room not found. Check the code.' }, { status: 404 });
      }

      if (room.status !== 'waiting') {
        return NextResponse.json({ error: 'This room is no longer accepting players.' }, { status: 400 });
      }

      if (room.player2_id) {
        return NextResponse.json({ error: 'Room is full.' }, { status: 400 });
      }

      // Join the room
      const { error: updateError } = await supabase
        .from('codeduel_rooms')
        .update({
          player2_id: playerId,
          player2_name: playerName.trim(),
          status: 'countdown',
          started_at: new Date(Date.now() + 5000).toISOString(), // 5s countdown then start
        })
        .eq('id', room.id);

      if (updateError) {
        console.error('Join room error:', updateError);
        return NextResponse.json({ error: 'Failed to join room' }, { status: 500 });
      }

      return NextResponse.json({ room: { ...room, player2_id: playerId, player2_name: playerName.trim(), status: 'countdown' }, playerId });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error('Room API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
