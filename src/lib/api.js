export const API_BASE_URL = 'https://ai-form-filler-ntzw.onrender.com';
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const TEST_USER_ID = "ajay-test-id-001";

/**
 * Uploads user Biodata, Photo, Signature, and Master PIN to the Render Vault endpoint.
 */
export async function uploadVaultData({ pin, name, fatherName, dob, photo, signature }) {
  const formData = new FormData();
  
  // Backend ke hisaab se sahi variable names
  formData.append('masterPin', pin); 
  formData.append('isFirstTimeSetup', 'true'); 
  
  // Saari details ko ek JSON profileBiodata mein pack karna (Jaise backend ko chahiye)
  const biodata = { name: name.trim(), fatherName: fatherName.trim(), dob };
  formData.append('profileBiodata', JSON.stringify(biodata));

  formData.append('photo', photo);
  formData.append('signature', signature);
  formData.append('consent', 'true'); 

  try {
    const response = await fetch(`${API_BASE_URL}/api/vault/upload`, {
      method: 'POST',
      headers: {
        'x-user-id': TEST_USER_ID, 
        'x-explicit-consent': 'true' 
      },
      body: formData,
    });

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
      ? await response.json()
      : { message: await response.text() };

    if (!response.ok) {
      throw new Error(payload?.error || payload?.message || `Upload failed (${response.status})`);
    }

    return payload;
  } catch (error) {
    console.error("Fetch error details:", error);
    // Ab jhootha message nahi, balki ASLI error screen par dikhega
    throw new Error(error.message || "Unknown Error Occurred");
  }
}

/**
 * Triggers automated exam form filling via Render Task endpoint.
 */
export async function startExamAutomation({ pin, examName }) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/task/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': TEST_USER_ID, 
        'x-explicit-consent': 'true'
      },
      body: JSON.stringify({
        masterPin: pin,
        examName: examName.trim(),
        portalUrl: 'https://test-portal.com', // Backend ko ye zaroori chahiye tha
        recipientId: 'TELEGRAM_TEST_USER' // Backend ko ye zaroori chahiye tha
      }),
    });

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
      ? await response.json()
      : { message: await response.text() };

    if (!response.ok) {
      throw new Error(payload?.error || payload?.message || `Task failed (${response.status})`);
    }

    return payload;
  } catch (error) {
    console.error("Fetch error details:", error);
    throw new Error(error.message);
  }
}
