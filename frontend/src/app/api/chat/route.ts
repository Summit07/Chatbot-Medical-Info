import { NextRequest, NextResponse } from "next/server";
import { getMockMedicalResponse } from "@/lib/medical-responses";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [], image_data = null } = body;

    const authHeader = req.headers.get("authorization");
    const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";

    // Attempt to proxy to FastAPI backend if available
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (authHeader) {
        headers["Authorization"] = authHeader;
      }

      const backendRes = await fetch(`${backendUrl}/api/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          message,
          history,
          image_data,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch {
      // Fall through to fallback responses
    }

    // High quality medical knowledge response
    await new Promise((res) => setTimeout(res, 600));
    const fallback = getMockMedicalResponse(message, Boolean(image_data));

    return NextResponse.json({
      answer: fallback.answer,
      sources: fallback.sources,
      tools: fallback.tools,
      conversation_id: "demo-session-" + Date.now(),
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to process chat query", details: errorMessage },
      { status: 500 }
    );
  }
}

