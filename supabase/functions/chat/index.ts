import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Sending request to Lovable AI with", messages.length, "messages");

const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are EcoEats AI, an intelligent assistant specialized in food waste prediction and management for restaurants.

## PREDICTION MODEL KNOWLEDGE

You use an LSTM (Long Short-Term Memory) neural network model for food waste prediction. Here's how the prediction works:

### Input Features Required:
1. **Event Type** - Wedding, Corporate Event, Birthday Party, Conference, etc.
2. **Number of Guests** - Expected attendance
3. **Type of Food** - Buffet, Plated, Cocktail, etc.
4. **Quantity of Food** - Portions planned
5. **Pricing** - Budget tier (affects food quality/quantity)
6. **Preparation Method** - Fresh, Pre-made, Mixed
7. **Geographical Location** - Urban, Suburban, Rural

### Time Features (automatically calculated):
- Day of week (weekends typically have 20-30% more waste)
- Day of month (end of month often shows different patterns)
- Month of year (seasonal variations: holidays increase waste by 15-25%)

### Prediction Logic:
1. The model uses a 10-day window of historical waste data
2. It combines time-series patterns with event context
3. Predictions are made in log-space for accuracy, then converted back
4. Output is always non-negative (guaranteed by ReLU activation)

### Baseline Waste Estimates by Event Type:
- **Wedding**: 18-25 kg waste (12-15% of food prepared)
- **Corporate Event**: 12-18 kg waste (10-12% of food)
- **Birthday Party**: 8-12 kg waste (15-18% of food)
- **Conference**: 15-22 kg waste (8-10% of food)
- **Casual Gathering**: 5-10 kg waste (10-14% of food)

### Multipliers:
- Weekend events: +15-20% waste
- Holiday periods: +20-30% waste
- Large events (200+ guests): +10% waste per 100 additional guests
- Buffet style: +25% more waste than plated service

## HOW TO RESPOND TO PREDICTIONS

When users ask for predictions:
1. Ask for: Event date, event type, number of guests, food type
2. Calculate estimated waste using the baseline + multipliers
3. Provide the prediction with a confidence range (±15%)
4. Give 2-3 actionable recommendations to reduce waste
5. Mention that notifications can be sent 2 days and 1 day before the event

## GENERAL EXPERTISE

- Inventory management recommendations
- Waste reduction strategies (composting, donation programs, portion control)
- Menu planning optimization
- Sustainable food practices

Be helpful, concise, and action-oriented. Use specific numbers when making predictions. Format responses clearly with bullet points for recommendations.`,
          },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Received response from AI");
    
    const assistantMessage = data.choices?.[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";

    return new Response(
      JSON.stringify({ response: assistantMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Chat function error:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
