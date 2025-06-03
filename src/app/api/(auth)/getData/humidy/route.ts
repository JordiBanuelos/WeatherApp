import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = await fetch('https://data.sagecontinuum.org/api/v1/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        start: "-10m",
        filter: {
          name: "wxt.env.humidity",
          vsn: "W08D"
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error ${response.status}: ${errorText}`);
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: response.status });
    }

    const textData = await response.text();

    // Handle NDJSON-style response (multiple JSON objects separated by newlines)
    const jsonLines = textData
      .trim()
      .split('\n')
      .map(line => JSON.parse(line));

    return NextResponse.json(jsonLines);
    
  } catch (error: any) {
    console.error('Fetch failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Optional: allow GET to hit this too for easier browser testing
export { POST as GET };
