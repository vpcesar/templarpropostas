CREATE TABLE public.gemini_credentials (
  user_id uuid PRIMARY KEY,
  encrypted_api_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.gemini_credentials TO service_role;

ALTER TABLE public.gemini_credentials ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_gemini_credentials_updated_at
BEFORE UPDATE ON public.gemini_credentials
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();