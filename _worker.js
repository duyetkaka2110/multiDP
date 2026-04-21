export default {
  async fetch(request, env, ctx) {
    const allowedDomains = [
      "kclub1.online",
      "bakent.live",
      "ccapplive.site",
      "vt888.live",
      "tglaksao.com",
      "vaccineincheon.com",
    ];


    // ✅ Load nội dung
    const response = await env.ASSETS.fetch(request);
    const newHeaders = new Headers(response.headers);

    const contentType = response.headers.get("content-type") || "";

    // ✅ Build CSP từ allowedDomains luôn
    if (contentType.includes("text/html")) {
      const cspDomains = allowedDomains
        .map(d => `https://${d} https://*.${d}`)
        .join(" ");

      newHeaders.set(
        "Content-Security-Policy",
        `frame-ancestors 'self' ${cspDomains};`
      );
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};