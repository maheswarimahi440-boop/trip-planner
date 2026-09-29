import React, { useEffect, useRef } from 'react';
import { N8N_CHAT_WEBHOOK_URL } from '../services/n8nService';

declare global {
  interface Window {
    __n8nChatInitialized?: boolean;
  }
}

interface N8nChatWidgetProps {
  webhookUrl?: string;
}

export const N8nChatWidget: React.FC<N8nChatWidgetProps> = ({
  webhookUrl = N8N_CHAT_WEBHOOK_URL
}) => {
  const initializedRef = useRef(false);

  useEffect(() => {
    // Avoid double initialization
    if (initializedRef.current || window.__n8nChatInitialized) {
      return;
    }

    initializedRef.current = true;
    window.__n8nChatInitialized = true;

    // Load n8n chat module dynamically from official CDN bundle
    const loadN8nChat = async () => {
      try {
        // @ts-ignore - dynamic import from CDN
        const { createChat } = await import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js');

        createChat({
          webhookUrl,
          webhookConfig: {
            method: 'POST',
            headers: {}
          },
          mode: 'window',
          showWelcomeScreen: true,
          defaultLanguage: 'en',
          initialMessages: [
            'Hello! 👋',
            'I am your AI Travel Assistant powered by n8n. How can I help you plan your journey today?'
          ],
          i18n: {
            en: {
              title: 'TripPlanner AI',
              subtitle: 'n8n Workflow Assistant',
              footer: 'Connected to n8n Cloud',
              getStarted: 'Start Chat',
              inputPlaceholder: 'Type a message to n8n agent...'
            }
          }
        });
      } catch (err) {
        console.warn('Failed to load official @n8n/chat CDN bundle:', err);
      }
    };

    loadN8nChat();
  }, [webhookUrl]);

  return null;
};
