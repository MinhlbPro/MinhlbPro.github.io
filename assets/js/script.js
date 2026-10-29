$(document).ready(function () {
  $("#menu").click(function () {
    $(this).toggleClass("fa-times");
    $(".navbar").toggleClass("nav-toggle");
  });

  // Đóng menu khi click vào link trong navbar
  $(".navbar ul li a").click(function () {
    $("#menu").removeClass("fa-times");
    $(".navbar").removeClass("nav-toggle");
  });

  $(window).on("scroll load", function () {
    $("#menu").removeClass("fa-times");
    $(".navbar").removeClass("nav-toggle");

    if (window.scrollY > 60) {
      document.querySelector("#scroll-top").classList.add("active");
    } else {
      document.querySelector("#scroll-top").classList.remove("active");
    }

    // scroll spy
    $("section").each(function () {
      let height = $(this).height();
      let offset = $(this).offset().top - 200;
      let top = $(window).scrollTop();
      let id = $(this).attr("id");

      if (top > offset && top < offset + height) {
        $(".navbar ul li a").removeClass("active");
        $(".navbar").find(`[href="#${id}"]`).addClass("active");
      }
    });
  });

  // smooth scrolling
  $('a[href*="#"]').on("click", function (e) {
    e.preventDefault();
    $("html, body").animate(
      {
        scrollTop: Math.max(0, $($(this).attr("href")).offset().top - $("header").outerHeight()),
      },
      500,
      "linear"
    );
  });

  // <!-- emailjs to mail contact form data -->
  $("#contact-form").submit(function (event) {
    emailjs.init("2g4bQ8IcJwigag6li");

    emailjs
      .sendForm("service_2pdikue", "template_wfmg0sn", "#contact-form")
      .then(
        function (response) {
          console.log("SUCCESS!", response.status, response.text);
          document.getElementById("contact-form").reset();
          alert("Form Submitted Successfully");
        },
        function (error) {
          console.log("FAILED...", error);
          alert("Form Submission Failed! Try Again");
        }
      );
    event.preventDefault();
  });
  // <!-- emailjs to mail contact form data -->
});

document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "visible") {
    document.title = "実績集 | ミン";
    $("#favicon").attr("href", "assets/images/doraemon.png");
  } else {
    document.title = "実績集に戻る";
    $("#favicon").attr("href", "assets/images/dragonball.jpg");
  }
});

// <!-- typed js effect starts -->
var typed = new Typed(".typing-text", {
  strings: [
    "コンテンツ作成者",
    "フロントエンド開発",
    "VRゲーム開発",
    "バックエンド開発",
    "カメラマン",
    "ウェブサイトデザイン",
    "Kubernetes開発",
    "Android/iOSアプリ開発",
    "埋め込みプログラミング",
    "AIエンジニア",
  ],
  loop: true,
  typeSpeed: 50,
  backSpeed: 25,
  backDelay: 500,
  showCursor: false,
});
// <!-- typed js effect ends -->

// <!-- soft tilt effect (ảnh, kỹ năng, học vấn, kinh nghiệm, liên hệ) -->
// Chỉ bật trên thiết bị có chuột, và tắt nếu người dùng chọn "giảm chuyển động".
function initSoftTilt(selector, opts) {
  if (!window.VanillaTilt) return;
  if (
    window.matchMedia("(hover: none)").matches ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }
  document.querySelectorAll(selector).forEach(function (el) {
    if (el.vanillaTilt) return; // tránh khởi tạo hai lần
    VanillaTilt.init(
      el,
      Object.assign({ max: 10, speed: 400, scale: 1.02 }, opts || {})
    );
  });
}
// <!-- soft tilt effect ends -->

async function fetchData(type = "skills") {
  let response;
  type === "skills"
    ? (response = await fetch("skills.json"))
    : (response = await fetch("./projects/projects.json"));
  const data = await response.json();
  return data;
}

function showSkills(skills) {
  let skillsContainer = document.getElementById("skillsContainer");
  let skillHTML = "";
  skills.forEach((skill) => {
    skillHTML += `
        <div class="bar">
              <div class="info">
                <img src=${skill.icon} alt="skill" />
                <span>${skill.name}</span>
              </div>
            </div>`;
  });
  skillsContainer.innerHTML = skillHTML;
  initSoftTilt(".skills .bar .info", { max: 14, scale: 1.06 });
}

function showProjects(projects) {
  let projectsContainer = document.querySelector("#work .box-container");
  const esc = (t) =>
    String(t == null ? "" : t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let projectHTML = "";
  projects.slice(0, 10).forEach((project) => {
    const isCompany = project.type === "company";
    const links = project.links || {};

    // ảnh bìa: nếu có "image" thì dùng ảnh, nếu không thì dùng ô gradient + icon
    const cover = project.image
      ? `<img draggable="false" src="./assets/images/projects/${esc(project.image)}.png" alt="project" />`
      : `<div class="proj-cover"><i class="fas ${esc(project.icon || "fa-code")}"></i></div>`;

    const meta = [project.role, project.period].filter(Boolean).map(esc).join(" ｜ ");
    const chips = (project.tech || [])
      .map((t) => `<span class="chip">${esc(t)}</span>`)
      .join("");

    // chỉ hiện nút khi có link thật (dự án công ty = không có link)
    const btns = [];
    if (links.view) btns.push(`<a href="${esc(links.view)}" class="btn" target="_blank" rel="noopener"><i class="fas fa-eye"></i> View</a>`);
    if (links.code) btns.push(`<a href="${esc(links.code)}" class="btn" target="_blank" rel="noopener">Code <i class="fas fa-code"></i></a>`);

    const footer = btns.length
      ? `<div class="btns">${btns.join("")}</div>`
      : isCompany
      ? `<p class="confidential"><i class="fas fa-lock"></i> 守秘義務のため、コード・詳細は非公開です</p>`
      : "";

    projectHTML += `
      <div class="box tilt${isCompany ? " is-company" : ""}">
        ${cover}
        ${isCompany ? '<span class="badge-company">社内プロジェクト</span>' : '<span class="badge-company personal">個人開発</span>'}
        <div class="content">
          <div class="tag"><h3>${esc(project.name)}</h3></div>
          <div class="desc">
            ${meta ? `<p class="meta">${meta}</p>` : ""}
            <p>${esc(project.desc)}</p>
            ${chips ? `<div class="chips notranslate" translate="no">${chips}</div>` : ""}
            ${footer}
          </div>
        </div>
      </div>`;
  });
  projectsContainer.innerHTML = projectHTML;

  // <!-- tilt js effect starts -->
  VanillaTilt.init(document.querySelectorAll(".tilt"), {
    max: 15,
  });
  // <!-- tilt js effect ends -->

  /* ===== SCROLL REVEAL ANIMATION ===== */
  const srtop = ScrollReveal({
    origin: "top",
    distance: "250px",
    duration: 1000,
    reset: true,
  });

  /* SCROLL PROJECTS */
  srtop.reveal(".work .box", { interval: 200 });
}

fetchData().then((data) => {
  showSkills(data);
});

fetchData("projects").then((data) => {
  showProjects(data);
});

// <!-- tilt js effect starts -->
VanillaTilt.init(document.querySelectorAll(".tilt"), {
  max: 15,
});
// <!-- tilt js effect ends -->

// pre loader start
// function loader() {
//     document.querySelector('.loader-container').classList.add('fade-out');
// }
// function fadeOut() {
//     setInterval(loader, 500);
// }
// window.onload = fadeOut;
// pre loader end

// disable developer mode
document.onkeydown = function (e) {
  if (e.keyCode == 123) {
    return false;
  }
  if (e.ctrlKey && e.shiftKey && e.keyCode == "I".charCodeAt(0)) {
    return false;
  }
  if (e.ctrlKey && e.shiftKey && e.keyCode == "C".charCodeAt(0)) {
    return false;
  }
  if (e.ctrlKey && e.shiftKey && e.keyCode == "J".charCodeAt(0)) {
    return false;
  }
  if (e.ctrlKey && e.keyCode == "U".charCodeAt(0)) {
    return false;
  }
};

// Start of Tawk.to Live Chat
var Tawk_API = Tawk_API || {},
  Tawk_LoadStart = new Date();
(function () {
  var s1 = document.createElement("script"),
    s0 = document.getElementsByTagName("script")[0];
  s1.async = true;
  s1.src = "https://embed.tawk.to/67a5a7e5825083258e116d46/1ijfhfmgr";
  s1.charset = "UTF-8";
  s1.setAttribute("crossorigin", "*");
  s0.parentNode.insertBefore(s1, s0);
})();
// End of Tawk.to Live Chat

/* ===== SCROLL REVEAL ANIMATION ===== */
const srtop = ScrollReveal({
  origin: "top",
  distance: "80px",
  duration: 1000,
  reset: true,
});

/* SCROLL HOME */
srtop.reveal(".home .content h3", { delay: 200 });
srtop.reveal(".home .content p", { delay: 200 });
srtop.reveal(".home .content .btn", { delay: 200 });

srtop.reveal(".home .image", { delay: 400 });
srtop.reveal(".home .linkedin", { interval: 600 });
srtop.reveal(".home .github", { interval: 800 });
srtop.reveal(".home .twitter", { interval: 1000 });
srtop.reveal(".home .telegram", { interval: 600 });
srtop.reveal(".home .instagram", { interval: 600 });
srtop.reveal(".home .dev", { interval: 600 });

/* SCROLL ABOUT */
srtop.reveal(".about .content h3", { delay: 200 });
srtop.reveal(".about .content .tag", { delay: 200 });
srtop.reveal(".about .content p", { delay: 200 });
srtop.reveal(".about .content .box-container", { delay: 200 });
srtop.reveal(".about .content .resumebtn", { delay: 200 });

/* SCROLL SKILLS */
srtop.reveal(".skills .container", { interval: 200 });
srtop.reveal(".skills .container .bar", { delay: 400 });

/* SCROLL EDUCATION */
srtop.reveal(".education .box", { interval: 200 });

/* SCROLL PROJECTS */
srtop.reveal(".work .box", { interval: 200 });

/* SCROLL EXPERIENCE */
srtop.reveal(".experience .timeline", { delay: 400 });
srtop.reveal(".experience .timeline .container", { interval: 400 });

/* SCROLL CONTACT */
srtop.reveal(".contact .container", { delay: 400 });
srtop.reveal(".contact .container .form-group", { delay: 400 });

// <!-- intro video modal starts -->
(function () {
  const modal = document.getElementById("video-modal");
  const video = document.getElementById("intro-video");
  const openBtn = document.getElementById("open-video");
  const closeBtn = document.getElementById("close-video");
  if (!modal || !video || !openBtn) return;

  function openVideo() {
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    video.play().catch(function () {});
    closeBtn.focus();
  }
  function closeVideo() {
    video.pause();
    video.currentTime = 0;
    modal.hidden = true;
    document.body.style.overflow = "";
    openBtn.focus();
  }

  openBtn.addEventListener("click", openVideo);
  closeBtn.addEventListener("click", closeVideo);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeVideo();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) closeVideo();
  });
})();
// <!-- intro video modal ends -->

// <!-- tilt cho các mục còn lại -->
initSoftTilt(".education .box .image", { max: 8 });
initSoftTilt(".experience .container .content", { max: 8 });
initSoftTilt(".contact .image-box", { max: 10 });
// <!-- tilt cho các mục còn lại ends -->
