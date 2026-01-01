const COURSES = [
  {
    id: 1,
    title: "Advanced React Development",
    img: "assets/images/Advanced React Development.png",
    desc: "Master modern React patterns, hooks, and <br>state management with hands-on projects.",
    category: "dev",
    level: "beginner",
    type: "in-person",
    rating: 4.7,
    weeks: 8,
    price: 299,
    students: 4179,
    session: "Monday, Jan 15 - 2:00 PM",
  },
  {
    id: 2,
    title: "Data Science Fundamentals",
    img: "assets/images/Data Science Fundamentals.png",
    desc: "Learn Python, statistics, and machine learning <br>for data-driven decision making.",
    category: "data",
    level: "beginner",
    type: "online",
    rating: 4.7,
    weeks: 8,
    price: 240,
    students: 1650,
    session: "Wednesday, Jan 17 - 6:00 PM",
  },
  {
    id: 3,
    title: "UX/UI Design Masterclass",
    img: "assets/images/UXUI Design Masterclass.png",
    desc: "Create intuitive user experiences with design<br> thinking and prototyping tools.",
    category: "design",
    level: "advanced",
    type: "online",
    rating: 4.7,
    weeks: 8,
    price: 180,
    students: 2900,
    session: "Saturday, Jan 20 - 5:00 PM",
  },
  {
    id: 4,
    title: "Data Science Fundamentals",
    category: "dev",
    level: "beginner",
    type: "online",
    price: 120,
    rating: 4.7,
    students: 2100,
    weeks: 8,
    session: "Sunday, Jan 21 - 3:00 PM",
    img: "assets/images/course4.png",
    desc: "Learn Python, statistics, and machine<br> learning for data-driven decision making."
  },
  {
    id: 5,
    title: "Data Science Fundamentals",
    category: "design",
    level: "intermediate",
    type: "online",
    price: 200,
    rating: 4.7,
    students: 980,
    weeks: 8,
    session: "Thursday, Jan 18 - 4:00 PM",
    img: "assets/images/course4.png",
    desc: "Learn Python, statistics, and machine<br> learning for data-driven decision making."
  },
  {
    id: 6,
    title: "UX/UI Design Masterclass",
    category: "design",
    level: "advanced",
    type: "online",
    price: 220,
    rating: 4.7,
    students: 3500,
    weeks: 8,
    session: "Tuesday, Jan 16 - 7:00 PM",
    img: "assets/images/course4.png",
    desc: "Create intuitive user experiences with design<br> thinking and prototyping tools.",
  }
];


function $(sel){ return document.querySelector(sel); }
function $all(sel){ return document.querySelectorAll(sel); }

function setYear(){
  const el = $("#year");
  if (el) el.textContent = new Date().getFullYear();
}

function setupMobileNav(){
  const toggle = $("#navToggle");
  const links = $("#navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    links.classList.toggle("open");
  });

  links.addEventListener("click", (e) => {
    if (e.target.classList.contains("nav-link")) {
      links.classList.remove("open");
    }
  });
}

function capitalize(str){
  if(!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}


function saveBooking(courseId){
  const raw = localStorage.getItem("myBookings");
  const bookings = raw ? JSON.parse(raw) : [];
  if (!bookings.includes(courseId)) bookings.push(courseId);
  localStorage.setItem("myBookings", JSON.stringify(bookings));
}

function getBookings(){
  const raw = localStorage.getItem("myBookings");
  return raw ? JSON.parse(raw) : [];
}

/* =========================
   Home
========================= */
function renderHome(){
  const grid = $("#homeRecommendations");
  if (!grid) return;

  const items = COURSES.slice(0,3).map(c => `
    <article class="card">
      <div class="card-media">
        <img src="${c.img}" alt="${c.title}">
      </div>

      <div class="card-body">
        <h3 class="card-title">${c.title}</h3>
        <p class="card-desc">${c.desc}</p>

        <div class="card-actions">
          <a class="btn btn-outline" href="details.html?id=${c.id}">Details</a>
          <a class="btn btn-primary" href="book.html?id=${c.id}">Book</a>
        </div>
      </div>
    </article>
  `).join("");

  grid.innerHTML = items;
}

/* =========================
   Courses Page Cards
========================= */
function levelPill(level){
  const lv = (level || "beginner").toLowerCase();
  return `<span class="pill gray">${capitalize(lv)}</span>`;
}

function typePill(type){
  const t = (type || "online").toLowerCase();
  if (t === "in-person") return `<span class="pill blue">In-person</span>`;
  return `<span class="pill green">Online</span>`;
}

function courseCard(c){
  const ratingVal = (typeof c.rating === "number") ? c.rating.toFixed(1) : "4.7";
  const weeksVal  = (typeof c.weeks === "number") ? c.weeks : 8;
  const levelVal  = c.level || "beginner";
  const typeVal   = c.type || "online";

  return `
    <article class="card">
      <div class="card-media">
        <img src="${c.img}" alt="${c.title}">
        <div class="rating-badge">
          <i class="fa-solid fa-star"></i>
          <span>${ratingVal}</span>
        </div>
      </div>

      <div class="card-body">
        <h3 class="card-title">${c.title}</h3>
        <p class="card-desc">${c.desc}</p>

        <div class="course-row">
          <span>Dr. Michael Chen</span>
          <span>${weeksVal} weeks</span>
        </div>

        <div class="course-pills">
          ${levelPill(levelVal)}
          ${typePill(typeVal)}
        </div>

        <div class="card-actions">
          <a class="btn btn-outline" href="details.html?id=${c.id}">Details</a>
          <a class="btn btn-primary" href="book.html?id=${c.id}">Book</a>
        </div>
      </div>
    </article>
  `;
}

function renderCourses(){
  const grid = $("#coursesGrid");
  if(!grid) return;

  const search = ($("#courseSearch")?.value || "").toLowerCase().trim();
  const cat  = $("#courseCategory")?.value ?? "all";
  const lvl  = $("#courseLevel")?.value ?? "all";
  const typ  = $("#courseType")?.value ?? "all";
  const sort = $("#courseSort")?.value ?? "popular";

  let list = [...COURSES];

  if (search){
    list = list.filter(c =>
      (c.title || "").toLowerCase().includes(search) ||
      (c.desc || "").toLowerCase().includes(search)
    );
  }

  if(cat !== "all") list = list.filter(c => c.category === cat);
  if(lvl !== "all") list = list.filter(c => c.level === lvl);
  if(typ !== "all") list = list.filter(c => c.type === typ);

  if(sort === "price_low")  list.sort((a,b) => (a.price ?? 0) - (b.price ?? 0));
  if(sort === "price_high") list.sort((a,b) => (b.price ?? 0) - (a.price ?? 0));

  grid.innerHTML = list.map(courseCard).join("");

  if(list.length === 0){
    grid.innerHTML = `
      <p class="muted" style="grid-column:1/-1;text-align:center;margin:20px 0;">
        No courses match your filters.
      </p>
    `;
  }
}

function setupCoursesInteractions(){
  if (!$("#coursesGrid")) return;

  renderCourses();

  ["#courseSearch","#courseCategory","#courseLevel","#courseType","#courseSort"].forEach(id=>{
    const el = $(id);
    if (!el) return;
    el.addEventListener("input", renderCourses);
    el.addEventListener("change", renderCourses);
  });
}

/* =========================
   My Path Page
========================= */
function renderMyPath(){
  const listEl = document.querySelector("#myPathList");
  if (!listEl) return;

  const bookings = getBookings ? getBookings() : [];
  if (!bookings.length) return;

  const bookedCourses = bookings
    .map(id => COURSES.find(c => c.id === id))
    .filter(Boolean);

  const statCourses = document.querySelector("#statCourses");
  const statWeeks = document.querySelector("#statWeeks");
  const statProgress = document.querySelector("#statProgress");
  const progressBar = document.querySelector("#progressBar");
  const progressPercentText = document.querySelector("#progressPercentText");
  const nextMilestoneText = document.querySelector("#nextMilestoneText");

  const totalCourses = bookedCourses.length;
  const totalWeeks = bookedCourses.reduce((sum, c) => sum + (c.weeks ?? 0), 0);
  const progress = totalCourses ? Math.min(35 + totalCourses * 5, 95) : 0;

  if (statCourses) statCourses.textContent = totalCourses;
  if (statWeeks) statWeeks.textContent = totalWeeks || 0;
  if (statProgress) statProgress.textContent = `${progress}%`;
  if (progressPercentText) progressPercentText.textContent = `${progress}%`;
  if (progressBar) progressBar.style.width = `${progress}%`;

  if (nextMilestoneText){
    nextMilestoneText.textContent = totalCourses
      ? `Complete ${bookedCourses[0].title} section`
      : "Complete React hooks section";
  }

  listEl.innerHTML = bookedCourses.map((c, idx) => {
    const weeks = c.weeks ?? 8;
    const isDone = idx === 0;
    const isActive = idx === bookedCourses.length - 1;

    const leftIcon = isDone ? "✓" : "◌";
    const leftStyle = isDone
      ? "background:#1f3f6d;color:#fff;border:none;"
      : "background:#eef2f7;color:#1f3f6d;border:1px solid #e7edf6;";

    const actionLabel = isDone ? "Review" : "Continue →";
    const actionClass = isActive ? "btn btn-primary" : "btn btn-outline";

    return `
      <div class="path-item" style="border-radius:10px;">
        <div class="path-left">
          <div class="path-icon" style="${leftStyle}">${leftIcon}</div>
          <div>
            <h4 style="margin:0;color:#1f3f6d;font-size:13px;font-weight:800;">${c.title}</h4>
            <div class="muted" style="font-size:12px;color:#8fa0bf;font-weight:600;display:flex;gap:10px;align-items:center;margin-top:4px;">
              <span>${weeks} weeks</span>
              <span>–</span>
              <span style="background:#eef2f7;color:#6b7280;padding:3px 8px;border-radius:999px;font-size:10px;font-weight:700;">Course</span>
            </div>
          </div>
        </div>
        <a class="${actionClass}" href="details.html?id=${c.id}"
           style="padding:7px 14px;border-radius:6px;font-size:11px;">
           ${actionLabel}
        </a>
      </div>
    `;
  }).join("");
}

function setupSimpleForms(){
  const contact = $("#contactForm");
  if (contact){
    contact.addEventListener("submit",(e)=>{
      e.preventDefault();
      const msg = $("#contactMsg");
      if (msg) msg.textContent = "✅ Message sent. We'll get back to you soon.";
      contact.reset();
    });
  }

  const login = $("#loginForm");
  if (login){
    login.addEventListener("submit",(e)=>{
      e.preventDefault();
      const msg = $("#loginMsg");
      if (msg) msg.textContent = "✅ Logged in (demo). Redirecting to Home...";
      setTimeout(()=>window.location.href="index.html", 700);
    });
  }

  const signup = $("#signupForm");
  if (signup){
    signup.addEventListener("submit",(e)=>{
      e.preventDefault();
      const msg = $("#signupMsg");
      if (msg) msg.textContent = "✅ Account created (demo). Redirecting to Login...";
      setTimeout(()=>window.location.href="login.html", 700);
    });
  }
}


function setupRegistrationFromUrl(){
  const params = new URLSearchParams(window.location.search);
  const action = params.get("action");
  const id = parseInt(params.get("id") || "0", 10);

  if (action === "book" && id){
    saveBooking(id);
  }
}

/* =========================
   Details Page 
========================= */
function renderDetailsPage(){
  const detailsPage = document.querySelector(".details-page");
  if (!detailsPage) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id") || "0", 10);

  const course = COURSES.find(c => c.id === id) || COURSES[0];
  if (!course) return;

  const coverImg = document.querySelector(".details-cover img");
  if (coverImg){
    coverImg.src = course.img;
    coverImg.alt = course.title;
  }

  const titleEl = document.querySelector(".details-course-name");
  if (titleEl){
    titleEl.textContent = course.title;
  }

  const meta = document.querySelector(".details-meta");
  if (meta){
    const spans = meta.querySelectorAll("span");
    if (spans[2]) spans[2].textContent = `${course.rating ?? 4.7} ★`;
    if (spans[4]) spans[4].textContent = `${course.weeks ?? 8} weeks`;
  }

  const priceEl = document.querySelector(".details-price");
  if (priceEl){
    priceEl.textContent = `$${course.price}`;
  }

  const descEl = document.querySelector(".details-text");
  if (descEl){
    descEl.innerHTML = course.desc;
  }

  const sessionEl = document.querySelector(".schedule-card .side-muted");
  if (sessionEl){
    sessionEl.textContent = course.session || "";
  }

  const regPriceEl = document.querySelector(".registration-card .reg-price");
  if (regPriceEl){
    regPriceEl.textContent = `$${course.price}`;
  }

  const regBtn = document.querySelector(".registration-card .side-btn.dark");
  if (regBtn){
    regBtn.setAttribute("href", `book.html?id=${course.id}`);
  }
}

/* =========================
   Book Page 
========================= */
function renderBookPage(){
  const regPage = document.querySelector(".reg-page");
  if (!regPage) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id") || "0", 10);

  const course = COURSES.find(c => c.id === id) || COURSES[0];
  if (!course) return;

  const imgEl = document.querySelector(".reg-course-img img");
  if (imgEl){
    imgEl.src = course.img;
    imgEl.alt = course.title;
  }

  const titleEl = document.querySelector(".reg-course-title");
  if (titleEl){
    titleEl.textContent = course.title;
  }

  const descEl = document.querySelector(".reg-course-desc");
  if (descEl){
    descEl.innerHTML = course.desc;
  }

  const metaSpans = document.querySelectorAll(".reg-course-meta span");
  if (metaSpans[1]){
    metaSpans[1].textContent = `${course.weeks ?? 8} weeks`;
  }

  const totalPriceEl = document.querySelector(".reg-total-price");
  if (totalPriceEl){
    totalPriceEl.textContent = `$${course.price}`;
  }

  const confirmBtn = document.querySelector(".reg-confirm-btn");
  if (confirmBtn){
    confirmBtn.addEventListener("click", () => {
      saveBooking(course.id);
      alert("Your registration has been saved (demo) ✅");
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  const isIndexPage =
    path.endsWith("index.html") ||
    path === "/" ||
    path.endsWith("/index");

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  const seenSplash = localStorage.getItem("seenSplash");
  const seenOnboarding = localStorage.getItem("seenOnboarding");

  if (isIndexPage && isMobile) {
    if (!seenSplash) {
      window.location.href = "splash.html";
      return; 
    }

    if (!seenOnboarding) {
      window.location.href = "onboarding.html";
      return;
    }
  }

  setYear();
  setupMobileNav();
  renderHome();
  setupCoursesInteractions();
  renderMyPath();
  setupRegistrationFromUrl();
  setupSimpleForms();
  renderDetailsPage();   
  renderBookPage();     
});