import { z } from "zod";

export const getHistoryRequestSchema = z.object({
	limit: z.coerce.number().int().min(1).max(50).optional(),
});

export const logHistoryRequestSchema = z.object({
	trackId: z.string(),
});

export type TGetHistoryRequest = z.infer<typeof getHistoryRequestSchema>;
export type TLogHistoryRequest = z.infer<typeof logHistoryRequestSchema>;
