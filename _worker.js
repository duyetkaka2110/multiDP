export default {
  async fetch(request, env, ctx) {
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

    // ✅ Check referer chuẩn (không dùng includes nữa)
    let isAllowed = false;

    if (referer) {
      try {
        const hostname = new URL(referer).hostname;

        isAllowed = allowedDomains.some(domain =>
          hostname === domain || hostname.endsWith("." + domain)
        );
      } catch (e) {}
    }

    // ❌ Không hợp lệ → redirect
    if (!isAllowed) {
      return Response.redirect("https://bakent.live", 302);
    }

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