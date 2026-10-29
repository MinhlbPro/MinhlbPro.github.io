/* ===== Multi-language switcher (Google Website Translator + custom dropdown) ===== */
(function () {
  var DEFAULT_LANG = "ja"; // ngôn ngữ gốc của trang
  var STORAGE_KEY = "site-lang";

  // [mã Google, tên bản ngữ, tên tiếng Anh]
  var LANGS = [
    ["ja", "日本語", "Japanese"], ["en", "English", "English"], ["vi", "Tiếng Việt", "Vietnamese"],
    ["zh-CN", "简体中文", "Chinese (Simplified)"], ["zh-TW", "繁體中文", "Chinese (Traditional)"], ["ko", "한국어", "Korean"],
    ["af", "Afrikaans", "Afrikaans"], ["sq", "Shqip", "Albanian"], ["am", "አማርኛ", "Amharic"],
    ["ar", "العربية", "Arabic"], ["hy", "Հայերեն", "Armenian"], ["az", "Azərbaycan", "Azerbaijani"],
    ["eu", "Euskara", "Basque"], ["be", "Беларуская", "Belarusian"], ["bn", "বাংলা", "Bengali"],
    ["bs", "Bosanski", "Bosnian"], ["bg", "Български", "Bulgarian"], ["my", "မြန်မာ", "Burmese"],
    ["ca", "Català", "Catalan"], ["ceb", "Cebuano", "Cebuano"], ["hr", "Hrvatski", "Croatian"],
    ["cs", "Čeština", "Czech"], ["da", "Dansk", "Danish"], ["nl", "Nederlands", "Dutch"],
    ["eo", "Esperanto", "Esperanto"], ["et", "Eesti", "Estonian"], ["tl", "Filipino", "Filipino"],
    ["fi", "Suomi", "Finnish"], ["fr", "Français", "French"], ["gl", "Galego", "Galician"],
    ["ka", "ქართული", "Georgian"], ["de", "Deutsch", "German"], ["el", "Ελληνικά", "Greek"],
    ["gu", "ગુજરાતી", "Gujarati"], ["ht", "Kreyòl Ayisyen", "Haitian Creole"], ["ha", "Hausa", "Hausa"],
    ["haw", "ʻŌlelo Hawaiʻi", "Hawaiian"], ["iw", "עברית", "Hebrew"], ["hi", "हिन्दी", "Hindi"],
    ["hu", "Magyar", "Hungarian"], ["is", "Íslenska", "Icelandic"], ["ig", "Igbo", "Igbo"],
    ["id", "Bahasa Indonesia", "Indonesian"], ["ga", "Gaeilge", "Irish"], ["it", "Italiano", "Italian"],
    ["jw", "Basa Jawa", "Javanese"], ["kn", "ಕನ್ನಡ", "Kannada"], ["kk", "Қазақша", "Kazakh"],
    ["km", "ភាសាខ្មែរ", "Khmer"], ["ku", "Kurdî", "Kurdish"], ["ky", "Кыргызча", "Kyrgyz"],
    ["lo", "ລາວ", "Lao"], ["la", "Latina", "Latin"], ["lv", "Latviešu", "Latvian"],
    ["lt", "Lietuvių", "Lithuanian"], ["lb", "Lëtzebuergesch", "Luxembourgish"], ["mk", "Македонски", "Macedonian"],
    ["mg", "Malagasy", "Malagasy"], ["ms", "Bahasa Melayu", "Malay"], ["ml", "മലയാളം", "Malayalam"],
    ["mt", "Malti", "Maltese"], ["mi", "Māori", "Maori"], ["mr", "मराठी", "Marathi"],
    ["mn", "Монгол", "Mongolian"], ["ne", "नेपाली", "Nepali"], ["no", "Norsk", "Norwegian"],
    ["ps", "پښتو", "Pashto"], ["fa", "فارسی", "Persian"], ["pl", "Polski", "Polish"],
    ["pt", "Português", "Portuguese"], ["pa", "ਪੰਜਾਬੀ", "Punjabi"], ["ro", "Română", "Romanian"],
    ["ru", "Русский", "Russian"], ["sm", "Gagana Samoa", "Samoan"], ["sr", "Српски", "Serbian"],
    ["sd", "سنڌي", "Sindhi"], ["si", "සිංහල", "Sinhala"], ["sk", "Slovenčina", "Slovak"],
    ["sl", "Slovenščina", "Slovenian"], ["so", "Soomaali", "Somali"], ["es", "Español", "Spanish"],
    ["su", "Basa Sunda", "Sundanese"], ["sw", "Kiswahili", "Swahili"], ["sv", "Svenska", "Swedish"],
    ["tg", "Тоҷикӣ", "Tajik"], ["ta", "தமிழ்", "Tamil"], ["te", "తెలుగు", "Telugu"],
    ["th", "ไทย", "Thai"], ["tr", "Türkçe", "Turkish"], ["tk", "Türkmen", "Turkmen"],
    ["uk", "Українська", "Ukrainian"], ["ur", "اردو", "Urdu"], ["uz", "Oʻzbekcha", "Uzbek"],
    ["cy", "Cymraeg", "Welsh"], ["yi", "ייִדיש", "Yiddish"], ["yo", "Yorùbá", "Yoruba"],
    ["zu", "isiZulu", "Zulu"]
  ];

  var codes = LANGS.map(function (l) { return l[0]; });
  function find(code) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i][0] === code) return LANGS[i];
    return LANGS[0];
  }

  /* ---------- cookie / storage ---------- */
  function getCookieLang() {
    var m = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]*\/([^;]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }
  function clearGoogleCookie() {
    var exp = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = exp;
    var host = location.hostname;
    if (host) {
      document.cookie = exp + "; domain=" + host;
      document.cookie = exp + "; domain=." + host;
    }
  }
  function setGoogleCookie(code) {
    var val = "googtrans=/" + DEFAULT_LANG + "/" + code + "; path=/";
    document.cookie = val;
    if (location.hostname) document.cookie = val + "; domain=" + location.hostname;
  }
  function saved() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function save(code) {
    try { localStorage.setItem(STORAGE_KEY, code); } catch (e) {}
  }

  /* ---------- Google widget ---------- */
  function whenCombo(cb, tries) {
    tries = tries || 0;
    var combo = document.querySelector(".goog-te-combo");
    if (combo) return cb(combo);
    if (tries < 75) setTimeout(function () { whenCombo(cb, tries + 1); }, 200);
  }

  function applyLang(code) {
    save(code);
    if (code === DEFAULT_LANG) {
      clearGoogleCookie();
      location.reload();
      return;
    }
    whenCombo(function (combo) {
      combo.value = code;
      combo.dispatchEvent(new Event("change"));
      // nếu widget không nhận mã này thì dùng cookie + tải lại
      setTimeout(function () {
        if (combo.value !== code) { setGoogleCookie(code); location.reload(); }
      }, 300);
    });
    setTimeout(function () {
      if (!document.querySelector(".goog-te-combo")) {
        setGoogleCookie(code);
        location.reload();
      }
    }, 4000);
  }

  /* ---------- UI ---------- */
  function buildUI() {
    var current = getCookieLang() || saved() || DEFAULT_LANG;
    if (!find(current) || find(current)[0] !== current) current = DEFAULT_LANG;

    var holder = document.createElement("div");
    holder.id = "google_translate_element";
    document.body.appendChild(holder);

    var box = document.createElement("div");
    box.id = "lang-switcher";
    box.className = "notranslate";
    box.setAttribute("translate", "no");

    // nút mở
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lang-btn";
    btn.setAttribute("aria-haspopup", "listbox");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Language");
    btn.innerHTML = '<i class="fas fa-globe"></i><span class="label"></span><i class="fas fa-chevron-down caret"></i>';
    var label = btn.querySelector(".label");
    label.textContent = find(current)[1];

    // panel
    var panel = document.createElement("div");
    panel.className = "lang-panel";
    panel.hidden = true;

    var title = document.createElement("div");
    title.className = "lang-title";
    title.textContent = "Language";

    var search = document.createElement("input");
    search.type = "search";
    search.className = "lang-search";
    search.placeholder = "Search language...";
    search.setAttribute("aria-label", "Search language");
    search.autocomplete = "off";

    var list = document.createElement("ul");
    list.className = "lang-list";
    list.setAttribute("role", "listbox");

    var empty = document.createElement("div");
    empty.className = "lang-empty";
    empty.textContent = "No results";
    empty.hidden = true;

    LANGS.forEach(function (l) {
      var li = document.createElement("li");
      li.setAttribute("role", "option");
      li.dataset.code = l[0];
      li.dataset.search = (l[1] + " " + l[2] + " " + l[0]).toLowerCase();
      var b = document.createElement("button");
      b.type = "button";
      var n = document.createElement("span");
      n.className = "native";
      n.textContent = l[1];
      var e = document.createElement("span");
      e.className = "en";
      e.textContent = l[2];
      b.appendChild(n);
      b.appendChild(e);
      li.appendChild(b);
      if (l[0] === current) { li.classList.add("active"); li.setAttribute("aria-selected", "true"); }
      list.appendChild(li);
    });

    panel.appendChild(title);
    panel.appendChild(search);
    panel.appendChild(list);
    panel.appendChild(empty);
    box.appendChild(btn);
    box.appendChild(panel);

    var header = document.querySelector("header");
    (header || document.body).appendChild(box);

    function open() {
      panel.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      var act = list.querySelector("li.active");
      if (act) list.scrollTop = Math.max(0, act.offsetTop - 60);
      if (window.matchMedia("(pointer:fine)").matches) search.focus();
    }
    function close() {
      panel.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    }

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      panel.hidden ? open() : close();
    });
    panel.addEventListener("click", function (e) { e.stopPropagation(); });
    document.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) { close(); btn.focus(); }
    });

    search.addEventListener("input", function () {
      var q = search.value.trim().toLowerCase();
      var shown = 0;
      Array.prototype.forEach.call(list.children, function (li) {
        var ok = !q || li.dataset.search.indexOf(q) !== -1;
        li.hidden = !ok;
        if (ok) shown++;
      });
      empty.hidden = shown !== 0;
    });

    list.addEventListener("click", function (e) {
      var li = e.target.closest("li");
      if (!li) return;
      var code = li.dataset.code;
      Array.prototype.forEach.call(list.children, function (x) {
        x.classList.remove("active");
        x.removeAttribute("aria-selected");
      });
      li.classList.add("active");
      li.setAttribute("aria-selected", "true");
      label.textContent = find(code)[1];
      close();
      applyLang(code);
    });
  }

  window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement(
      {
        pageLanguage: DEFAULT_LANG,
        includedLanguages: codes.join(","),
        autoDisplay: false
      },
      "google_translate_element"
    );
    // khôi phục ngôn ngữ đã chọn (ví dụ khi mở bằng file:// không có cookie)
    var want = saved();
    if (want && want !== DEFAULT_LANG && getCookieLang() !== want) {
      whenCombo(function (combo) {
        combo.value = want;
        combo.dispatchEvent(new Event("change"));
      });
    }
  };

  buildUI();
  var s = document.createElement("script");
  s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  s.async = true;
  document.body.appendChild(s);
})();
