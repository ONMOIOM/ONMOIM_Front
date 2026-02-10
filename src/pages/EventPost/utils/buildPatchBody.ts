/** PATCH /api/v1/users/events/{eventId} 요청 body (flat 구조) */
export type PatchEventBody = {
  title?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  streetAddress?: string | null;
  lotNumberAddress?: string | null;
  capacity?: number | null;
  price?: number | null;
  playlistUrl?: string | null;
  introduction?: string | null;
};

/** eventData를 patch body로 변환 (schedule/location 등 flat 변환) */
export const buildPatchBody = (data: Record<string, unknown>): PatchEventBody => {
  const body: PatchEventBody = {};
  const s = data.startTime ?? (data.schedule as { startDate?: string })?.startDate;
  const e = data.endTime ?? (data.schedule as { endDate?: string })?.endDate;
  const loc = data.location as { streetAddress?: string; lotNumber?: string } | undefined;

  if (data.title != null) body.title = (data.title as string) || null;
  if (data.capacity != null) body.capacity = data.capacity as number;
  if (data.price != null) body.price = data.price as number;
  if (s) body.startTime = s as string;
  if (e) body.endTime = e as string;
  if (data.streetAddress != null) body.streetAddress = (data.streetAddress as string) || null;
  if (data.lotNumberAddress != null) body.lotNumberAddress = (data.lotNumberAddress as string) || null;
  if (loc?.streetAddress != null) body.streetAddress = loc.streetAddress || null;
  if (loc?.lotNumber != null) body.lotNumberAddress = loc.lotNumber || null;
  const pl = data.playlistUrl ?? data.playlist;
  if (pl != null) body.playlistUrl = (pl as string) || null;
  const intro = data.introduction ?? data.information;
  if (intro != null) body.introduction = (intro as string) || null;

  return body;
};
