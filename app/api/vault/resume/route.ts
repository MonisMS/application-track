import { auth } from "@/auth";
import { getUserProfile } from "@/lib/queries";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const profile = await getUserProfile(session.user.id);
  if (!profile?.resumeFileKey) {
    return new Response("No resume on file", { status: 404 });
  }

  // Proxy the file from blob storage so the raw blob URL is never exposed
  const upstream = await fetch(profile.resumeFileKey);
  if (!upstream.ok) {
    return new Response("File not found", { status: 404 });
  }

  const fileName = profile.resumeFileName ?? "resume";
  const mimeType = profile.resumeMimeType ?? "application/octet-stream";

  return new Response(upstream.body, {
    headers: {
      "Content-Type": mimeType,
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
