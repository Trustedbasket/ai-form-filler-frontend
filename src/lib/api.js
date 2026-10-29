export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ai-form-filler-ntzw.onrender.com';

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB strict client-side cap

/**
 * Uploads user Biodata, Photo, Signature, and Master PIN to the Render Vault endpoint.
 * Sends multipart/form-data to POST https://ai-form-filler-ntzw.onrender.com/api/vault/upload
 */
export async function uploadVaultData({ pin, name, fatherName, dob, photo, signature }) {
  const formData = new FormData();
  formData.append('pin', pin);
  formData.append('name', name.trim());
  formData.append('fatherName', fatherName.trim());
  formData.append('dob', dob);
  formData.append('photo', photo);
  formData.append('signature', signature);

  const response = await fetch(`${API_BASE_URL}/api/vault/upload`, {
    method: 'POST',
    body: formData,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : { message: await response.text() };

  if (!response.ok) {
    throw new Error(payload?.error || payload?.message || `Vault upload failed (${response.status})`);
  }

  return payload;
}

/**
 * Triggers automated exam form filling via Render Task endpoint.
 * Sends JSON payload to POST https://ai-form-filler-ntzw.onrender.com/api/task/start
 */
export async function startExamAutomation({ pin, examName }) {
  const response = await fetch(`${API_BASE_URL}/api/task/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pin,
      examName: examName.trim(),
    }),
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : { message: await response.text() };

  if (!response.ok) {
    throw new Error(payload?.error || payload?.message || `Task start failed (${response.status})`);
  }

  return payload;
}
