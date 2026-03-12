
-- Create blog posts table for AI-generated Bitcoin news summaries
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  source_urls TEXT[] DEFAULT '{}',
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read blog posts (public content)
CREATE POLICY "Blog posts are publicly readable"
  ON public.blog_posts
  FOR SELECT
  USING (true);

-- Only service role can insert (edge functions)
CREATE POLICY "Service role can insert blog posts"
  ON public.blog_posts
  FOR INSERT
  WITH CHECK (true);

-- Create index for ordering by date
CREATE INDEX idx_blog_posts_published_at ON public.blog_posts (published_at DESC);
