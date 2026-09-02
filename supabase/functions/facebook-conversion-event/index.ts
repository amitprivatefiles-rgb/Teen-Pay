import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import bizSdk from "npm:facebook-nodejs-business-sdk";

const { ServerEvent, EventRequest, UserData, CustomData, FacebookAdsApi } = bizSdk;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ConversionEventRequest {
  eventName: string;
  eventSourceUrl?: string;
  userEmail?: string;
  userPhone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  value?: number;
  currency?: string;
  contentName?: string;
  contentCategory?: string;
  contentIds?: string[];
  contents?: Array<{ id: string; quantity: number; item_price?: number }>;
  numItems?: number;
}

async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const FACEBOOK_PIXEL_ID = "1213789437532180";
    const FACEBOOK_ACCESS_TOKEN = Deno.env.get("FACEBOOK_ACCESS_TOKEN");

    if (!FACEBOOK_ACCESS_TOKEN) {
      throw new Error("FACEBOOK_ACCESS_TOKEN environment variable is not set");
    }

    FacebookAdsApi.init(FACEBOOK_ACCESS_TOKEN);

    const body: ConversionEventRequest = await req.json();
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const userData = new UserData();

    if (body.userEmail) {
      userData.setEmails([await hashData(body.userEmail)]);
    }

    if (body.userPhone) {
      userData.setPhones([await hashData(body.userPhone)]);
    }

    if (body.firstName) {
      userData.setFirstNames([await hashData(body.firstName)]);
    }

    if (body.lastName) {
      userData.setLastNames([await hashData(body.lastName)]);
    }

    if (body.city) {
      userData.setCities([await hashData(body.city)]);
    }

    if (body.state) {
      userData.setStates([await hashData(body.state)]);
    }

    if (body.zipCode) {
      userData.setZipCodes([await hashData(body.zipCode)]);
    }

    if (body.country) {
      userData.setCountryCodes([await hashData(body.country)]);
    }

    const customData = new CustomData();

    if (body.value !== undefined) {
      customData.setValue(body.value);
    }

    if (body.currency) {
      customData.setCurrency(body.currency);
    }

    if (body.contentName) {
      customData.setContentName(body.contentName);
    }

    if (body.contentCategory) {
      customData.setContentCategory(body.contentCategory);
    }

    if (body.contentIds) {
      customData.setContentIds(body.contentIds);
    }

    if (body.contents) {
      customData.setContents(body.contents);
    }

    if (body.numItems !== undefined) {
      customData.setNumItems(body.numItems);
    }

    const serverEvent = new ServerEvent();
    serverEvent.setEventName(body.eventName);
    serverEvent.setEventTime(currentTimestamp);
    serverEvent.setUserData(userData);
    serverEvent.setCustomData(customData);
    serverEvent.setActionSource("website");

    if (body.eventSourceUrl || req.headers.get("referer")) {
      serverEvent.setEventSourceUrl(body.eventSourceUrl || req.headers.get("referer"));
    }

    const eventsData = [serverEvent];
    const eventRequest = new EventRequest(FACEBOOK_ACCESS_TOKEN, FACEBOOK_PIXEL_ID);
    eventRequest.setEvents(eventsData);

    const response = await eventRequest.execute();

    return new Response(
      JSON.stringify({
        success: true,
        facebook_response: response,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
