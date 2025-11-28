import {
  createProviderToolFactoryWithOutputSchema,
  lazySchema,
  zodSchema,
} from '@ai-sdk/provider-utils';
import { z } from 'zod/v4';

export const toolSearchBm25_20251119ArgsSchema = lazySchema(() =>
  zodSchema(z.object({})),
);

export const toolSearchBm25_20251119OutputSchema = lazySchema(() =>
  zodSchema(
    z.union([
      z.array(
        z.object({
          type: z.literal('tool_reference'),
          tool_name: z.string(),
        }),
      ),
      z.object({
        type: z.literal('tool_search_tool_result_error'),
        error_code: z.enum([
          'too_many_requests',
          'invalid_pattern',
          'pattern_too_long',
          'unavailable',
        ]),
      }),
    ]),
  ),
);

const toolSearchBm25_20251119InputSchema = lazySchema(() =>
  zodSchema(
    z.object({
      query: z.string(),
    }),
  ),
);

const factory = createProviderToolFactoryWithOutputSchema<
  {
    /**
     * The natural language query to search for tools.
     * Claude uses this query to find relevant tools using BM25 text matching.
     */
    query: string;
  },
  | Array<{
      type: 'tool_reference';

      /**
       * The name of the discovered tool.
       */
      tool_name: string;
    }>
  | {
      type: 'tool_search_tool_result_error';

      /**
       * Error code indicating the type of error:
       * - `too_many_requests`: Rate limit exceeded for tool search operations
       * - `invalid_pattern`: Malformed query
       * - `pattern_too_long`: Query exceeds limit
       * - `unavailable`: Tool search service temporarily unavailable
       */
      error_code:
        | 'too_many_requests'
        | 'invalid_pattern'
        | 'pattern_too_long'
        | 'unavailable';
    },
  {
    // no arguments - the tool search tool has no configuration options
  }
>({
  id: 'anthropic.tool_search_bm25_20251119',
  inputSchema: toolSearchBm25_20251119InputSchema,
  outputSchema: toolSearchBm25_20251119OutputSchema,
});

export const toolSearchBm25_20251119 = (
  args: Parameters<typeof factory>[0] = {},
) => {
  return factory(args);
};
