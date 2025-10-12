import { env } from './env';

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function uploadToCloudinary(file: File): Promise<string> {
  if (file.size > 10 * 1024 * 1024) {
    throw new APIError(`File "${file.name}" exceeds 10MB limit`);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', env.CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'blom/products');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD}/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok || result.error) {
      throw new APIError(
        result.error?.message || 'Upload failed',
        response.status,
        result
      );
    }

    return result.secure_url as string;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(
      `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function postJSON<T>(url: string, body: unknown): Promise<T> {
  console.log('🚀 Sending webhook request to:', url);
  console.log('📦 Payload:', JSON.stringify(body, null, 2));
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Token': env.APP_TOKEN,
      },
      body: JSON.stringify(body),
    });

    console.log('📡 Response status:', response.status, response.statusText);
    
    let result;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      const text = await response.text();
      console.log('📄 Response text:', text);
      result = { message: text };
    }

    console.log('📥 Response data:', result);

    if (!response.ok) {
      throw new APIError(
        result.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        result
      );
    }

    return result as T;
  } catch (error) {
    console.error('❌ Webhook request failed:', error);
    if (error instanceof APIError) throw error;
    throw new APIError(
      `Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}