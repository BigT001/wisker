import { NextResponse } from 'next/server';




// In-memory storage for scripts (in a real app, this would be a database)
const scriptStorage: any[] = [];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const contentPlanId = searchParams.get('contentPlanId');
  
  if (!contentPlanId) {
    return NextResponse.json({ error: 'Content plan ID is required' }, { status: 400 });
  }
  
  const scripts = scriptStorage.filter(script => script.contentPlanId === contentPlanId);
  return NextResponse.json(scripts);
}

export async function POST(request: Request) {
  const scriptData = await request.json();
  
  if (!scriptData.contentPlanId || scriptData.episodeIndex === undefined || !scriptData.script) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  
  // Check if a script for this episode already exists
  const existingIndex = scriptStorage.findIndex(
    script => script.contentPlanId === scriptData.contentPlanId && 
              script.episodeIndex === scriptData.episodeIndex
  );
  
  if (existingIndex >= 0) {
    // Update existing script
    scriptStorage[existingIndex] = {
      ...scriptStorage[existingIndex],
      ...scriptData,
      updatedAt: new Date().toISOString()
    };
  } else {
    // Add new script
    scriptStorage.push({
      ...scriptData,
      id: `script-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  return NextResponse.json({ success: true });
}
