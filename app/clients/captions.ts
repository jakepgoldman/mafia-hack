// https://help.captions.ai/api-reference/lipdub
const CAPTIONS_LIPDUB_URL = "https://api.captions.ai/api/lipdub";

export default class CaptionsClient {
  private apiToken: string;
  private apiBaseUrl: string;

  constructor(apiToken: string, apiBaseUrl?: string) {
    this.apiToken = apiToken;
    this.apiBaseUrl = apiBaseUrl || CAPTIONS_LIPDUB_URL;
  }

  private fetchCaptions = async (url: string, options: RequestInit) => {
    return fetch(url, {
      ...options,
      headers: {
        "x-api-key": `${this.apiToken}`,
        ...options.headers,
      },
    });
  };

  submit = async (audioUrl: string, videoUrl: string) => {
    const resp = await this.fetchCaptions(`${this.apiBaseUrl}/submit`, {
      method: "POST",
      body: JSON.stringify({
        audioUrl,
        videoUrl,
      }),
    });

    // returns object with "operationId"
    return resp.json() as Promise<{ operationId: string } | { detail: string }>;
  };

  poll = async (operationId: string) => {
    const resp = await this.fetchCaptions(`${this.apiBaseUrl}/poll`, {
      method: "POST",
      headers: {
        "x-operation-id": `${operationId}`,
      },
    });

    // returns object with "url" and "state"
    return resp.json() as Promise<
      { url: string; state: string } | { detail: string }
    >;
  };
}
