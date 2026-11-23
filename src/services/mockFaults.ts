// Dev-only switches for testing error handling. On web, turn on from the browser console:
//   mockFaults.chat = true      mockFaults.notifications = true
export const mockFaults: { chat: boolean; notifications: boolean } = { chat: false, notifications: false };
(globalThis as any).mockFaults = mockFaults;

const failedOnce = new Set<string>();

// Text containing #fail always fails; #failonce fails the first try, so Retry then succeeds
export function shouldFailSend(text: string): boolean {
  if (mockFaults.chat || text.includes('#fail ') || text.endsWith('#fail')) return true;
  if (text.includes('#failonce') && !failedOnce.has(text)) { failedOnce.add(text); return true; }
  return false;
}