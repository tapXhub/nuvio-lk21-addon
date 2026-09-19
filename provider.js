class LK21Provider {
  constructor() {
    // Domain aktif LK21 (boleh dikemaskini jika LK21 bertukar domain)
    this.baseUrl = "https://tv3.lk21official.my";
  }

  // 1. Carian Filem
  async search(query, type) {
    try {
      const searchUrl = `${this.baseUrl}/?s=${encodeURIComponent(query)}`;
      const response = await fetch(searchUrl);
      const htmlText = await response.text();

      // Menganalisis HTML laman web
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, "text/html");
      const items = doc.querySelectorAll(".grid-archive li");

      const results = [];
      items.forEach(item => {
        const titleEl = item.querySelector("h2.entry-title a");
        const linkEl = item.querySelector("a");

        if (titleEl && linkEl) {
          results.push({
            id: linkEl.getAttribute("href"), // Simpan URL penuh filem sebagai ID
            title: titleEl.innerText.trim(),
            type: "movie"
          });
        }
      });

      return results;
    } catch (err) {
      console.error("Ralat Carian LK21:", err);
      return [];
    }
  }

  // 2. Ambil Pautan Video (Stream)
  async getStreams(filmUrl, type) {
    try {
      const response = await fetch(filmUrl);
      const htmlText = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, "text/html");
      
      // Mengambil URL iframe pemain video LK21
      const iframeEl = doc.querySelector("#playeriframe") || doc.querySelector("iframe");
      const streamUrl = iframeEl ? iframeEl.getAttribute("src") : null;

      if (!streamUrl) return [];

      return [
        {
          name: "LK21 Server Utama",
          url: streamUrl,
          quality: "HD"
        }
      ];
    } catch (err) {
      console.error("Ralat Stream LK21:", err);
      return [];
    }
  }
}

// Daftarkan provider ke persekitaran Nuvio
window.provider = new LK21Provider();
