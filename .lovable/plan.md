

# Two-Section AI Briefing: News + Market Analysis

## Approach

Split the current single blog section into two distinct sections, each powered by its own edge function and database category. Use the **free cryptocurrency.cv API** (no auth, no API key) to fetch real news headlines, then have the AI summarize them. Use CoinGecko + Mempool.space data for the market analysis section.

## Data Sources

| Section | Source | Cost |
|---------|--------|------|
| News & Regulatory | `https://cryptocurrency.cv/api/news?limit=20` (free, no key) | Free |
| Market & Network | CoinGecko + Mempool.space (already used) | Free |

## Database Changes

Add a `category` column to `blog_posts` table:
- Values: `'news'` or `'market'`
- Default: `'market'`
- This lets us store and query both types separately

## Edge Function Changes

Update `generate-blog-post` to accept a `type` parameter (`"news"` or `"market"`):

**News flow:**
1. Fetch `https://cryptocurrency.cv/api/news?limit=20` to get real headlines
2. Inject the actual headlines + snippets into the AI prompt
3. Instruct AI: "Summarize ONLY these real news stories. Do NOT invent events."
4. Store with `category: 'news'`

**Market flow:**
1. Fetch CoinGecko price data + Mempool.space network data
2. Inject real numbers into AI prompt
3. Instruct AI: "Analyze ONLY this provided data. Do NOT invent prices."
4. Store with `category: 'market'`

## Frontend Changes

Update `BlogSection.tsx` to use tabs (News / Market Analysis):
- Two tabs using existing Radix Tabs component
- Each tab fetches posts filtered by `category`
- Each tab has its own "Generate" button
- Same visual style, just split into two views

## Files Modified

1. **Migration** -- add `category` text column to `blog_posts`
2. **`supabase/functions/generate-blog-post/index.ts`** -- accept `type` param, fetch real data sources, update prompts
3. **`src/components/bitcoin/BlogSection.tsx`** -- add tabs for News vs Market, pass type to generate mutation

