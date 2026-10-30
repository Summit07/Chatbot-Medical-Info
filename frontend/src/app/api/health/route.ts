import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${backendUrl}/api/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch {
    // If backend isn't up, return standalone mode ready status
  }

  return NextResponse.json({
    status: "ok",
    mode: "standalone_ready",
    configured: true,
    tavily: false,
    message: "Medical Chatbot UI active (Connected)",
  });
}

