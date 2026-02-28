export default {
  async fetch(request, env, ctx) {
    // Lấy response gốc từ Pages (nội dung tĩnh)
    const response = await env.ASSETS.fetch(request);

    // Clone headers để chỉnh sửa
    const newHeaders = new Headers(response.headers);

    // Chỉ thêm CSP nếu là HTML
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      newHeaders.set("Content-Security-Policy", "frame-ancestors 'self' https://tglaksao.com https://truonggalaksao.com https://*.bakent.live https://cf1.live  https://tgbp777.net https://*.tgbp777.net https://live.ccapplive.site/; ");
    }

    // Trả về response
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};