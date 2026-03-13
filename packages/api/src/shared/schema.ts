import { z } from "zod";

export const CursorPaginationSchema = z.object({
	cursor: z.string().optional(),
	limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
	sortBy: z.string().optional(),
	sortOrder: z.enum(["asc", "desc"]).default("asc").optional(),
});

export type CursorPaginationParams = z.infer<typeof CursorPaginationSchema>;

export const withPagination = <T extends z.ZodRawShape>(fields: T) =>
	z.object({
		...CursorPaginationSchema.shape,
		...fields,
	});

export type PaginationMeta = {
	nextCursor: string | null;
	limit: number;
};

export const createPaginatedResponseSchema = <T extends z.ZodTypeAny>(
	itemSchema: T,
) =>
	z.object({
		data: z.array(itemSchema),
		pagination: z.object({
			nextCursor: z.string().nullable(),
			limit: z.number().int(),
		}),
	});

export function createPaginatedResponse<T extends { id: string }>(
	data: T[],
	limit = 20,
): { data: T[]; pagination: PaginationMeta } {
	const nextCursor = data.length === limit ? data.at(-1)?.id || null : null;

	return {
		data,
		pagination: {
			nextCursor,
			limit,
		},
	};
}

export const createResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
	z.object({
		data: z.union([z.array(itemSchema), itemSchema]),
	});

export function createResponse<T extends { id: string }>(
	data: T[] | T,
): { data: T[] | T } {
	return {
		data,
	};
}
