import { answer } from "@/lib/twin";

// Answers come from lib/content.ts for now. The model, knowledge source and rate limiter are not decided yet.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const question = typeof body?.question === "string" ? body.question.trim().slice(0, 500) : "";
  if (!question) return Response.json({ error: "Ask a question." }, { status: 400 });
  return Response.json(answer(question));
}
