const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export function getToken() {
  const params = new URLSearchParams(window.location.search);
  return params.get('token');
}

export async function saveProgress(token, progressData) {
  const saveKey = typeof token === 'string' ? token.trim() : '';
  if (!saveKey) {
    console.warn('No saveKey available, skipping save');
    return null;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/progress/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ saveKey, data: progressData }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('✓ Progress saved');
    return result.data ?? null;
  } catch (error) {
    console.error('✗ Failed to save:', error.message);
    return null;
  }
}

export async function loadProgress(token) {
  const saveKey = typeof token === 'string' ? token.trim() : '';
  if (!saveKey) {
    console.warn('No saveKey available, skipping load');
    return null;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/progress/load?saveKey=${encodeURIComponent(saveKey)}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('✓ Progress loaded');
    return result.data;
  } catch (error) {
    console.error('✗ Failed to load:', error.message);
    return null;
  }
}
