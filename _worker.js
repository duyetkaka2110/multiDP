export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Lấy header referer
    const referer = request.headers.get("referer") || "";

    const allowedDomains = [
      "tglaksao.com",
      "truonggalaksao.com",
      "bakent.live",
      "cf1.live",
      "tgbp777.net",
      "live.ccapplive.site",
      "vt888.live"
    ];

    const isAllowed = allowedDomains.some(domain =>
      referer.includes(domain)
    );

    if (!referer || !isAllowed) {
      return Response.redirect("https://bakent.live", 302);
    }

    const response = await env.ASSETS.fetch(request);

    const newHeaders = new Headers(response.headers);

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("text/html")) {
      newHeaders.set(
        "Content-Security-Policy",
        "frame-ancestors 'self' https://tglaksao.com https://truonggalaksao.com https://*.bakent.live https://cf1.live https://tgbp777.net https://*.tgbp777.net https://live.ccapplive.site https://vt888.live https://*.vt888.live;"
      );
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};