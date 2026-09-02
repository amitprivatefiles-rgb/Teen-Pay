interface ConversionEventData {
  eventName: 'Purchase' | 'AddToCart' | 'InitiateCheckout' | 'Lead' | 'CompleteRegistration' | 'ViewContent' | 'Search' | 'AddPaymentInfo' | 'AddToWishlist' | 'Contact' | string;
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

export async function sendFacebookConversionEvent(eventData: ConversionEventData): Promise<{ success: boolean; error?: string }> {
  try {
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/facebook-conversion-event`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...eventData,
        eventSourceUrl: eventData.eventSourceUrl || window.location.href,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Facebook Conversion API error:', result);
      return { success: false, error: result.error || 'Failed to send conversion event' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending Facebook conversion event:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
