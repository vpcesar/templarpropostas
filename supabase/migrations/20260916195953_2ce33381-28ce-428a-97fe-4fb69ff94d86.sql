CREATE POLICY "Service functions manage Gemini credentials"
ON public.gemini_credentials
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);