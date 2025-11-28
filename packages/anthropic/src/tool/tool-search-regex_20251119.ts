import {
  createProviderToolFactoryWithOutputSchema,
  lazySchema,
  zodSchema,
} from '@ai-sdk/provider-utils';
import { z } from 'zod/v4';

export const toolSearchRegex_20251119ArgsSchema = lazySchema(() =>
  zodSchema(z.object({})),
);

export const toolSearchRegex_20251119OutputSchema = lazySchema(() =>
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

const toolSearchRegex_20251119InputSchema = lazySchema(() =>
  zodSchema(
    z.object({
      query: z.string(),
    }),
  ),
);

const factory = createProviderToolFactoryWithOutputSchema<
  {
    /**
     * The regex pattern to search for tools.
     * Uses Python's `re.search()` syntax.
     * Maximum length: 200 characters.
     *
     * Common patterns:
     * - `"weather"` - matches tool names/descriptions containing "weather"
     * - `"get_.*_data"` - matches tools like `get_user_data`, `get_weather_data`
     * - `"database.*query|query.*database"` - OR patterns for flexibility
     * - `"(?i)slack"` - case-insensitive search
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
       * - `invalid_pattern`: Malformed regex pattern
       * - `pattern_too_long`: Pattern exceeds 200 character limit
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
  id: 'anthropic.tool_search_regex_20251119',
  inputSchema: toolSearchRegex_20251119InputSchema,
  outputSchema: toolSearchRegex_20251119OutputSchema,
});

export const toolSearchRegex_20251119 = (
  args: Parameters<typeof factory>[0] = {},
) => {
  return factory(args);
};
