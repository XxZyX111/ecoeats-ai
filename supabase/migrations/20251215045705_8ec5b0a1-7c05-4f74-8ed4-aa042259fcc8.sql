-- Prevent message updates (messages should be immutable)
CREATE POLICY "Messages cannot be updated"
ON public.chat_messages FOR UPDATE
USING (false);

-- Prevent direct message deletion (use CASCADE from conversations)
CREATE POLICY "Messages cannot be deleted directly"
ON public.chat_messages FOR DELETE
USING (false);