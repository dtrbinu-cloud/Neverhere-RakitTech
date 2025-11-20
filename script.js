// script.js
// SPA sederhana: ganti section tanpa pindah halaman, + kontrol video di home

function renderSection(name) {
  const page = name || 'home';

  // sembunyikan semua section
  document.querySelectorAll('.home-layout, .section, .laptop-section').forEach(el => {
    el.style.display = 'none';
  });

  // tampilkan target
  const target = document.getElementById(page);
  if (target) {
    target.style.display = 'block';
  }

  // update nav active
  document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
  const navLink = document.querySelector('.nav a[href="#' + page + '"]');
  if (navLink) navLink.classList.add('active');

  // video background hanya di home
  const bgVideo = document.getElementById('bg-video');
  if (bgVideo) {
    bgVideo.style.display = (page === 'home') ? 'block' : 'none';
  }
}

function changeUrlHash(page, push = true) {
  const hash = '#' + page;
  if (push) {
    history.pushState({ page }, '', hash);
  } else {
    history.replaceState({ page }, '', hash);
  }
}

// klik navbar utama
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      const page = href && href.startsWith('#') ? href.slice(1) : null;
      if (!page) return;

      renderSection(page);
      changeUrlHash(page, true);
      window.scrollTo(0, 0);
    });
  });

  // inisialisasi halaman pertama
  const initialHash = window.location.hash.substring(1);
  const startPage = initialHash || 'home';
  renderSection(startPage);
  changeUrlHash(startPage, false);
  window.scrollTo(0, 0);
});

// back/forward browser
window.addEventListener('popstate', function (e) {
  const page = (e.state && e.state.page) || window.location.hash.substring(1) || 'home';
  renderSection(page);
  window.scrollTo(0, 0);
});

// Klik bar laptop → buka YouTube (pakai data-url di HTML)
document.addEventListener('click', function (e) {
  const bar = e.target.closest('.lp-bar');
  if (!bar) return;

  if (bar.classList.contains('lp-more')) return;

  const url = bar.getAttribute('data-url') || 'https://shopee.co.id/Lenovo-LOQ-Essential-15IAX9E-I5-12450HX-RTX3050-12GB-512GB-15.6-FHD-W11-Office-Home-2024-i.1543389959.43618378301?extraParams=%7B%22display_model_id%22%3A276510058766%2C%22model_selection_logic%22%3A3%7D&sp_atk=ef72ccae-b374-4ff0-a4a3-9b5408daf90f&xptdk=ef72ccae-b374-4ff0-a4a3-9b5408daf90f';
  window.open(url, '_blank');
});

document.querySelectorAll(".rakitanpc-card").forEach(bar => {
  bar.addEventListener("click", () => {
    const url = bar.getAttribute("data-url");
    if (url) window.open(url, "_blank");
  });
});

document.addEventListener('click', function (e) {
  const moreBtn = e.target.closest('.lp-more');
  if (!moreBtn) return;

  e.stopPropagation(); // cegah bar 6 membuka tab lain

  const chart = document.querySelector('.lp-chart');

  // contoh tambahan 3 bar baru (bisa kamu ubah sesuai kebutuhan)
  const extraBars = [
    {
      img: "vid/sampah.jpg",
      label: "Laptop 50jt",
    },
    {
      img: "vid/sampah.jpg",
      label: "Laptop 60jt"
    },
    {
      img: "vid/sampah.jpg",
      label: "Laptop 70jt"
    },
     {
      img: "vid/sampah.jpg",
      label: "Laptop 50jt"
    },
    {
      img: "vid/sampah.jpg",
      label: "Laptop 60jt"
    },
    {
      img: "vid/sampah.jpg",
      label: "Laptop 70jt"
    },
     {
      img: "vid/sampah.jpg",
      label: "Laptop 50jt"
    },
    {
      img: "vid/sampah.jpg",
      label: "Laptop 60jt"
    },
    {
      img: "vid/sampah.jpg",
      label: "Laptop 70jt"
    }
  ];

  extraBars.forEach(item => {
    const div = document.createElement('div');
    div.className = "lp-bar";
    div.innerHTML = `
      <div class="lp-bar-media">
        <img src="${item.img}">
      </div>
      <div class="lp-detail">Lihat Detail-nya</div>
      <span class="lp-bar-label">${item.label}</span>
    `;
    chart.appendChild(div);
  });

  // sembunyikan bar read more setelah ditekan
  moreBtn.style.display = "none";
});

// ========== VIDEO THEATER HOME ==========
document.addEventListener('DOMContentLoaded', function () {
  const overlay = document.getElementById('video-overlay');
  if (!overlay) return;

  const inner = overlay.querySelector('.video-overlay-inner');
  const backdrop = overlay.querySelector('.video-overlay-backdrop');
  const closeBtn = overlay.querySelector('.video-overlay-close');

  function setLayoutClass() {
    const count = inner.querySelectorAll('.overlay-player').length;
    inner.classList.toggle('one', count === 1);
    inner.classList.toggle('two', count === 2);
  }

  function openOverlay() {
    overlay.classList.add('show');
  }

  function closeOverlay() {
    overlay.classList.remove('show');
    inner.innerHTML = ''; // stop semua video
    setLayoutClass();
  }

  function addVideoToOverlay(videoId, title) {
    openOverlay();

    // jika sudah ada video ini di overlay, abaikan (biar tidak dobel)
    if (inner.querySelector('[data-video-id="' + videoId + '"]')) {
      return;
    }

    // kalau sudah 2 video, buang yang paling lama (di kiri)
    const current = inner.querySelectorAll('.overlay-player');
    if (current.length >= 2) {
      inner.removeChild(current[0]);
    }

    const wrap = document.createElement('div');
    wrap.className = 'overlay-player';
    wrap.dataset.videoId = videoId;
    wrap.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${videoId}?autoplay=1"
        title="${title}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen></iframe>
      <div class="overlay-title">${title}</div>
    `;
    inner.appendChild(wrap);

    setLayoutClass();
  }

  // klik kartu di kiri home
  document.querySelectorAll('.video-trigger').forEach(box => {
    box.addEventListener('click', function () {
      const id = this.dataset.videoId;
      const title = this.dataset.videoTitle || this.querySelector('h4')?.textContent || 'Video';
      addVideoToOverlay(id, title);
    });
  });

  // tutup overlay
  backdrop.addEventListener('click', closeOverlay);
  closeBtn.addEventListener('click', closeOverlay);

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeOverlay();
    }
  });
});


