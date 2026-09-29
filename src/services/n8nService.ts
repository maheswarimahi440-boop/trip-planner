export const N8N_CHAT_WEBHOOK_URL = 'https://mahi10.app.n8n.cloud/webhook/05c71d43-b63e-43ce-92d5-e738ef503295/chat';

export interface N8nChatResponse {
  success: boolean;
  reply: string;
  error?: string;
}

// Generate or retrieve persistent session ID for n8n chat memory
export function getN8nSessionId(): string {
  try {
    let id = localStorage.getItem('tripplanner_n8n_session_id');
    if (!id) {
      id = 'n8n_sess_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now();
      localStorage.setItem('tripplanner_n8n_session_id', id);
    }
    return id;
  } catch {
    return 'n8n_sess_' + Date.now();
  }
}

/**
 * Send a message directly to the n8n chat webhook
 */
export async function sendMessageToN8n(
  message: string, 
  customWebhookUrl: string = N8N_CHAT_WEBHOOK_URL
): Promise<N8nChatResponse> {
  const sessionId = getN8nSessionId();

  try {
    // n8n Chat Trigger node expects JSON with action: "sendMessage", chatInput, and sessionId
    const res = await fetch(customWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*'
      },
      body: JSON.stringify({
        action: 'sendMessage',
        sessionId,
        chatInput: message,
        message: message // also provide message for standard Webhook nodes
      })
    });

    const responseText = await res.text();
    let parsed: any;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      // response might be raw text
      parsed = null;
    }

    if (!res.ok) {
      return {
        success: false,
        reply: parsed?.message || responseText || 'Error connecting to n8n webhook.',
        error: `HTTP ${res.status}: ${res.statusText}`
      };
    }

    if (parsed) {
      // Check common n8n chat output patterns
      if (parsed.output) {
        return { success: true, reply: typeof parsed.output === 'string' ? parsed.output : JSON.stringify(parsed.output) };
      }
      if (parsed.text) {
        return { success: true, reply: parsed.text };
      }
      if (parsed.response) {
        return { success: true, reply: parsed.response };
      }
      if (parsed.message) {
        // If n8n workflow threw an error
        if (parsed.message.toLowerCase().includes('error in workflow')) {
          return {
            success: false,
            reply: 'Your n8n workflow responded with "Error in workflow". Please check your n8n canvas (make sure nodes are active and configured with valid credentials).',
            error: parsed.message
          };
        }
        return { success: true, reply: parsed.message };
      }
      if (Array.isArray(parsed) && parsed[0]?.output) {
        return { success: true, reply: parsed[0].output };
      }
      if (Array.isArray(parsed) && parsed[0]?.text) {
        return { success: true, reply: parsed[0].text };
      }
      return { success: true, reply: JSON.stringify(parsed, null, 2) };
    }

    return {
      success: true,
      reply: responseText || 'Received response from n8n agent.'
    };
  } catch (err: any) {
    console.error('n8n webhook error:', err);
    return {
      success: false,
      reply: 'Could not connect to n8n webhook. Please check your internet connection or n8n workflow URL.',
      error: err.message
    };
  }
}
