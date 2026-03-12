
-- Remove overly permissive INSERT policy since service role bypasses RLS anyway
DROP POLICY "Service role can insert blog posts" ON public.blog_posts;
