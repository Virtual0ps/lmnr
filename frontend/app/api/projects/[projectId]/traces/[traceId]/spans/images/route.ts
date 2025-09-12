import { NextRequest } from "next/server";
import { prettifyError, ZodError } from "zod/v4";

import { getSpanImages } from "@/lib/actions/span/images";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ projectId: string; traceId: string }> }
): Promise<Response> {
  const params = await props.params;
  const { projectId, traceId } = params;

  try {
    const body = await req.json();
    const { spanIds } = body;

    if (!Array.isArray(spanIds)) {
      return Response.json({ error: "spanIds must be an array" }, { status: 400 });
    }

    const images = await getSpanImages({ projectId, traceId, spanIds });
    return Response.json({ images });
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: prettifyError(error) }, { status: 400 });
    }
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to fetch span images." },
      { status: 500 }
    );
  }
}
