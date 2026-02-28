import { z } from 'zod';

export const newsSearchSchema = z.object({
    query: z.string().min(1, 'Search term is required.'),
});

export type NewsSearchInput = z.infer<typeof newsSearchSchema>;
