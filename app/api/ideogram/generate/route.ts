import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const ideogramApiKey = process.env.IDEOGRAM_API_KEY;
    if (!ideogramApiKey) {
      console.error("IDEOGRAM_API_KEY not set");
      return NextResponse.json(
        { error: "IDEOGRAM_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Call IDEOGRAM API with correct format
    const ideogramResponse = await fetch("https://api.ideogram.ai/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ideogramApiKey}`,
      },
      body: JSON.stringify({
        image_request: {
          prompt,
          aspect_ratio: "ASPECT_1_1",
          model: "V_2",
        },
      }),
    });

    const data = await ideogramResponse.json();

    if (!ideogramResponse.ok) {
      console.error("IDEOGRAM API error:", data);
      return NextResponse.json(
        { error: `IDEOGRAM API error: ${data.detail || data.message || "Unknown error"}` },
        { status: ideogramResponse.status }
      );
    }

    // Extract image URL from response
    const imageUrl =
      data.data && data.data[0] && data.data[0].url
        ? data.data[0].url
        : null;

    if (!imageUrl) {
      console.error("No image URL in response:", data);
      return NextResponse.json(
        { error: "No image generated" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error("Error in /api/ideogram/generate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
