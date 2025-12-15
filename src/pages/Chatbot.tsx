import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Leaf, Send, LogOut, Bot, User, Loader2, Plus, MessageSquare, Trash2, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

const Chatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          navigate("/auth");
        } else {
          setUserEmail(session.user.email || "");
          setUserId(session.user.id);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate("/auth");
      } else {
        setUserEmail(session.user.email || "");
        setUserId(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Load conversations when user is set
  useEffect(() => {
    if (userId) {
      loadConversations();
    }
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error loading conversations:", error);
      return;
    }

    setConversations(data || []);
  };

  const loadMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading messages:", error);
      return;
    }

    setMessages(
      data?.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })) || []
    );
  };

  const createNewConversation = async (): Promise<string | null> => {
    if (!userId) return null;

    const { data, error } = await supabase
      .from("conversations")
      .insert({ user_id: userId, title: "New Chat" })
      .select()
      .single();

    if (error) {
      console.error("Error creating conversation:", error);
      toast.error("Failed to create conversation");
      return null;
    }

    setConversations((prev) => [data, ...prev]);
    return data.id;
  };

  const updateConversationTitle = async (conversationId: string, firstMessage: string) => {
    const title = firstMessage.slice(0, 50) + (firstMessage.length > 50 ? "..." : "");
    
    const { error } = await supabase
      .from("conversations")
      .update({ title })
      .eq("id", conversationId);

    if (!error) {
      setConversations((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, title } : c))
      );
    }
  };

  const saveMessage = async (conversationId: string, role: "user" | "assistant", content: string) => {
    if (!userId) return;

    await supabase.from("chat_messages").insert({
      conversation_id: conversationId,
      user_id: userId,
      role,
      content,
    });

    // Update conversation's updated_at
    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);
  };

  const selectConversation = async (conversation: Conversation) => {
    setCurrentConversationId(conversation.id);
    await loadMessages(conversation.id);
    setSidebarOpen(false);
  };

  const startNewChat = async () => {
    setMessages([]);
    setCurrentConversationId(null);
    setSidebarOpen(false);
  };

  const deleteConversation = async (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    
    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("id", conversationId);

    if (error) {
      toast.error("Failed to delete conversation");
      return;
    }

    setConversations((prev) => prev.filter((c) => c.id !== conversationId));
    
    if (currentConversationId === conversationId) {
      setMessages([]);
      setCurrentConversationId(null);
    }
    
    toast.success("Conversation deleted");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !userId) return;

    let conversationId = currentConversationId;

    // Create new conversation if needed
    if (!conversationId) {
      conversationId = await createNewConversation();
      if (!conversationId) return;
      setCurrentConversationId(conversationId);
    }

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Save user message
    await saveMessage(conversationId, "user", input);

    // Update title if first message
    if (messages.length === 0) {
      await updateConversationTitle(conversationId, input);
    }

    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: { messages: [...messages, userMessage] },
      });

      if (error) {
        if (error.message?.includes("429")) {
          toast.error("Rate limit exceeded. Please try again later.");
        } else if (error.message?.includes("402")) {
          toast.error("Please add funds to continue using the AI.");
        } else {
          toast.error("Failed to get response. Please try again.");
        }
        return;
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Save assistant message
      await saveMessage(conversationId, "assistant", data.response);
      
      // Refresh conversations to update order
      await loadConversations();
    } catch (error: any) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-border">
            <Button
              onClick={startNewChat}
              className="w-full justify-start gap-2"
              variant="outline"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </Button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-4">
                No conversations yet
              </p>
            ) : (
              conversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                    currentConversationId === conversation.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted text-foreground"
                  }`}
                  onClick={() => selectConversation(conversation)}
                >
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 truncate text-sm">{conversation.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => deleteConversation(e, conversation.id)}
                  >
                    <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                  </Button>
                </motion.div>
              ))
            )}
          </div>

          {/* User Info */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="truncate flex-1">{userEmail}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-soft">
                  <Leaf className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-lg text-foreground">
                  EcoEats AI
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                  Welcome to EcoEats AI
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  I'm your AI assistant for food waste prediction. Ask me about
                  event planning, inventory management, or waste reduction
                  strategies!
                </p>
              </motion.div>
            )}

            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-accent-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 justify-start"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input Area */}
        <footer className="bg-card border-t border-border p-4">
          <form
            onSubmit={sendMessage}
            className="max-w-4xl mx-auto flex gap-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about food waste prediction..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              type="submit"
              variant="hero"
              size="icon"
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default Chatbot;
