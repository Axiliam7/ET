const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export function getToken() {
  const params = new URLSearchParams(window.location.search);
  return params.get('token');
}

export async function saveProgress(token, progressData) {
  if (!token) {
    console.warn('No token available, skipping save');
    return null;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/progress/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ data: progressData }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('✓ Progress saved');
    return result.progress;
  } catch (error) {
    console.error('✗ Failed to save:', error.message);
    return null;
  }
}

export async function loadProgress(token) {
  if (!token) {
    console.warn('No token available, skipping load');
    return null;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/progress/load`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('✓ Progress loaded');
    return result.progress.data;
  } catch (error) {
    console.error('✗ Failed to load:', error.message);
    return null;
  }
}