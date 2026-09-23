/**
 * Browser-based Push Notification Utility for Ullapara Press Club
 * Enables Web Push Notifications for Breaking News & Important Notices
 */

export interface PushNotificationPayload {
  title: string;
  body: string;
  tag?: string;
  url?: string;
  icon?: string;
  isBreaking?: boolean;
}

/**
 * Check if the browser supports notifications
 */
export function isPushSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Get current browser notification permission
 */
export function getPushPermission(): NotificationPermission {
  if (!isPushSupported()) return 'denied';
  return Notification.permission;
}

/**
 * Request notification permission from user
 */
export async function requestPushPermission(): Promise<NotificationPermission> {
  if (!isPushSupported()) {
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      localStorage.setItem('upc_push_enabled', 'true');
      localStorage.setItem('upc_push_granted_at', new Date().toISOString());

      // Send a welcome greeting notification
      sendLocalPushNotification({
        title: '🔔 উল্লাপাড়া প্রেসক্লাব নোটিফিকেশন সক্রিয় হয়েছে!',
        body: 'এখন থেকে যেকোনো ব্রেকিং নিউজ ও জরুরি প্রেস বিজ্ঞপ্তি সবার আগে আপনার ডিভাইসে চলে আসবে।',
        tag: 'upc-welcome',
        url: '#notices'
      });
    } else {
      localStorage.removeItem('upc_push_enabled');
    }
    return permission;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return 'denied';
  }
}

/**
 * Send a browser-based push notification
 */
export async function sendLocalPushNotification(payload: PushNotificationPayload): Promise<boolean> {
  if (!isPushSupported()) {
    console.warn('Notifications not supported in this browser.');
    return false;
  }

  // Always emit an in-app event so active tabs see an instant animated toast
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('upc-breaking-news-toast', {
        detail: payload
      })
    );
  }

  // Check if system notification permission is granted
  if (Notification.permission !== 'granted') {
    console.info('Notification permission is not granted:', Notification.permission);
    return false;
  }

  const iconUrl = payload.icon || '/logo.png';
  const notificationTitle = payload.title.startsWith('🔴') || payload.title.startsWith('🔔')
    ? payload.title 
    : `🔴 ব্রেকিং নিউজ: ${payload.title}`;

  // Try via Service Worker Registration first (Standard PWA method)
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      if (registration && 'showNotification' in registration) {
        await registration.showNotification(notificationTitle, {
          body: payload.body,
          icon: iconUrl,
          badge: iconUrl,
          tag: payload.tag || `upc-notice-${Date.now()}`,
          vibrate: [250, 100, 250, 100, 250],
          data: {
            url: payload.url || '#notices',
            timestamp: Date.now()
          },
          requireInteraction: true
        } as NotificationOptions);
        return true;
      }
    } catch (swError) {
      console.warn('Service worker notification failed, falling back to Notification API:', swError);
    }
  }

  // Fallback to standard window Notification
  try {
    const notif = new Notification(notificationTitle, {
      body: payload.body,
      icon: iconUrl,
      tag: payload.tag || `upc-notice-${Date.now()}`
    });

    notif.onclick = () => {
      window.focus();
      if (payload.url) {
        if (payload.url.startsWith('#')) {
          const el = document.getElementById(payload.url.substring(1));
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.href = payload.url;
        }
      }
      notif.close();
    };

    return true;
  } catch (e) {
    console.error('Failed to trigger window Notification:', e);
    return false;
  }
}
