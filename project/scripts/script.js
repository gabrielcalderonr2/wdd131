/* scripts/script.js
   Student project JS to satisfy course requirements:
   - multiple functions
   - DOM interaction & events
   - conditional branching
   - arrays/objects & array methods
   - builds HTML strings exclusively with template literals
   - uses localStorage
*/

(() => {
  // ---------- Sample data (objects + arrays) ----------
  const dishes = [
    { id: 1, title: "Ceviche", region: "coast", img: "images/ceviche.jpg", text: "Fresh seafood marinated in lime, served with onions and cilantro." },
    { id: 2, title: "Locro de Papa", region: "sierra", img: "images/locro.jpg", text: "Potato and cheese soup from the Andes — warm and hearty." },
    { id: 3, title: "Maito", region: "amazon", img: "images/maito.jpg", text: "Fish or chicken wrapped in leaves and steamed (Amazon technique)." },
    { id: 4, title: "Bolón de Verde", region: "coast", img: "images/bolon.jpg", text: "Green plantain ball often served for breakfast on the coast." }
  ];

  // ---------- Helpers ----------
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // ---------- localStorage keys ----------
  const LS_VISITS = "foe_visits";
  const LS_FAVS = "foe_favs";
  const LS_RECIPES = "foe_recipes";
  const LS_MESSAGES = "foe_messages";

  // ---------- Visit counter ----------
  function updateVisits() {
    const prev = Number(localStorage.getItem(LS_VISITS) || 0);
    const now = prev + 1;
    localStorage.setItem(LS_VISITS, String(now));
    const el = $("#visitCount");
    if (el) el.textContent = String(now);
  }

  // ---------- Favorites ----------
  function getFavs() {
    return JSON.parse(localStorage.getItem(LS_FAVS) || "[]");
  }
  function setFavs(arr) {
    localStorage.setItem(LS_FAVS, JSON.stringify(arr));
    refreshFavCount();
  }
  function toggleFav(id) {
    const arr = getFavs();
    const idx = arr.indexOf(id);
    if (idx === -1) arr.push(id);
    else arr.splice(idx,1);
    setFavs(arr);
  }
  function refreshFavCount() {
    const el = $("#favCount");
    if (el) el.textContent = String(getFavs().length);
  }

  // ---------- Render dish cards using template literals only ----------
  function dishCard(v) {
    const isFav = getFavs().includes(v.id);
    return `
      <article class="card" data-id="${v.id}">
        <img src="${v.img}" alt="${v.title}" loading="lazy">
        <h3>${v.title}</h3>
        <p>${v.text}</p>
        <div class="card-actions">
          <button class="fav-btn" data-id="${v.id}" aria-pressed="${isFav}">${isFav ? "★ Favorited" : "☆ Favorite"}</button>
          <button class="save-recipe" data-id="${v.id}">Save as recipe</button>
        </div>
      </article>
    `;
  }

  function renderCards(list) {
    const container = $("#cardsContainer") || $("#recipesList");
    if (!container) return;
    container.innerHTML = list.map(dishCard).join("");
    // Attach event listeners
    container.querySelectorAll(".fav-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = Number(btn.dataset.id);
        toggleFav(id);
        const favs = getFavs();
        btn.textContent = favs.includes(id) ? "★ Favorited" : "☆ Favorite";
        btn.setAttribute("aria-pressed", favs.includes(id));
      });
    });
    container.querySelectorAll(".save-recipe").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = Number(btn.dataset.id);
        const item = dishes.find(d => d.id === id);
        if (item) saveRecipeFromDish(item);
      });
    });
    refreshFavCount();
  }

  // ---------- Filtering and searching ----------
  function applyFilterSearch() {
    const filterEl = $("#filter");
    const searchEl = $("#search");
    const filter = filterEl ? filterEl.value : "all";
    const search = searchEl ? searchEl.value.trim().toLowerCase() : "";
    let results = dishes.slice(); // copy
    if (filter && filter !== "all") results = results.filter(d => d.region === filter);
    if (search) results = results.filter(d => (`${d.title} ${d.text}`).toLowerCase().includes(search));
    renderCards(results);
  }

  // ---------- Recipes saved locally ----------
  function getRecipes() {
    return JSON.parse(localStorage.getItem(LS_RECIPES) || "[]");
  }
  function setRecipes(arr) {
    localStorage.setItem(LS_RECIPES, JSON.stringify(arr));
    renderSavedRecipes();
  }
  function saveRecipe(obj) {
    const arr = getRecipes();
    obj.id = Date.now();
    arr.push(obj);
    setRecipes(arr);
  }
  function saveRecipeFromDish(dish) {
    // Build recipe object from dish (demonstrates conditional branching)
    const recipe = {
      title: dish.title,
      region: dish.region,
      ingredients: ["ingredient 1", "ingredient 2"],
      instructions: `A simple preparation for ${dish.title}.`,
      sourceId: dish.id
    };
    saveRecipe(recipe);
    alert(`${dish.title} saved as a recipe (local)`);
  }
  function clearRecipes() {
    localStorage.removeItem(LS_RECIPES);
    renderSavedRecipes();
  }
  function renderSavedRecipes() {
    const list = $("#savedList") || $("#savedList");
    if (!list) return;
    const arr = getRecipes();
    list.innerHTML = arr.length ? arr.map(r => `<li>${r.title} (${r.region})</li>`).join("") : "<li>No saved recipes</li>";
  }

  // ---------- Contact messages (form) ----------
  function getMessages() {
    return JSON.parse(localStorage.getItem(LS_MESSAGES) || "[]");
  }
  function setMessages(arr) {
    localStorage.setItem(LS_MESSAGES, JSON.stringify(arr));
    renderMessages();
  }
  function saveMessage(msg) {
    const arr = getMessages();
    arr.push({ id: Date.now(), ...msg });
    setMessages(arr);
  }
  function clearMessages() {
    localStorage.removeItem(LS_MESSAGES);
    renderMessages();
  }
  function renderMessages() {
    const ul = $("#messagesList");
    if (!ul) return;
    const arr = getMessages();
    ul.innerHTML = arr.length ? arr.map(m => `<li><strong>${escapeHTML(m.name)}</strong>: ${escapeHTML(m.message.slice(0,120))}</li>`).join("") : "<li>No messages</li>";
  }

  // ---------- Utilities ----------
  function escapeHTML(s){ return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }

  // ---------- Form handlers (recipes and contact) ----------
  function handleRecipeForm() {
    const form = $("#recipeForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const title = (fd.get("title") || "").toString().trim();
      const region = (fd.get("region") || "").toString();
      const ingredients = (fd.get("ingredients") || "").toString().split(",").map(x => x.trim()).filter(Boolean);
      const instructions = (fd.get("instructions") || "").toString().trim();

      if (!title || title.length < 2) { alert("Title required (2+ chars)"); return; }
      if (!region) { alert("Choose a region"); return; }
      if (ingredients.length === 0) { alert("Add at least one ingredient"); return; }

      saveRecipe({ title, region, ingredients, instructions });
      form.reset();
    });
    $("#clearRecipes")?.addEventListener("click", clearRecipes);
  }

  function handleContactForm() {
    const form = $("#contactForm");
    if (!form) return;
    const status = $("#contactStatus");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = (fd.get("fullname") || "").toString().trim();
      const email = (fd.get("email") || "").toString().trim();
      const message = (fd.get("message") || "").toString().trim();

      // basic validation (conditional branching)
      if (!name || name.length < 2) { status.textContent = "Please enter a name (2+ characters)."; return; }
      if (!/^\S+@\S+\.\S+$/.test(email)) { status.textContent = "Please enter a valid email address."; return; }
      if (!message || message.length < 8) { status.textContent = "Message must be at least 8 characters."; return; }

      saveMessage({ name, email, message });
      status.textContent = "Message saved locally.";
      form.reset();
    });
    $("#clearMessages")?.addEventListener("click", clearMessages);
  }

  // ---------- Nav toggle (mobile) ----------
  function initNavToggle() {
    const toggles = $$(".nav-toggle");
    toggles.forEach(btn => {
      btn.addEventListener("click", () => {
        const nav = btn.nextElementSibling;
        if (!nav) return;
        const shown = nav.style.display === "flex";
        nav.style.display = shown ? "none" : "flex";
        btn.setAttribute("aria-expanded", String(!shown));
      });
    });
  }

  // ---------- Init (startup) ----------
  function init() {
    // set years
    const year = new Date().getFullYear();
    $$("#year").forEach(n => n.textContent = String(year));
    $$("#year2").forEach(n => n.textContent = String(year));
    $$("#year3").forEach(n => n.textContent = String(year));
    $$("#year4").forEach(n => n.textContent = String(year));
    $$("#year5").forEach(n => n.textContent = String(year));

    updateVisits();
    refreshFavCount();
    renderSavedRecipes();
    renderMessages();

    // If index page: render dishes and attach controls
    if ($("#cardsContainer")) {
      renderCards(dishes);
      $("#filter")?.addEventListener("change", applyFilterSearch);
      $("#search")?.addEventListener("input", (() => {
        let t;
        return () => { clearTimeout(t); t = setTimeout(applyFilterSearch, 220); };
      })());
      $("#clearFavs")?.addEventListener("click", () => { setFavs([]); renderCards(dishes); });
    }

    // If recipes page: render available dishes into recipes list (so user can 'save as recipe')
    if ($("#recipesList")) {
      // combine initial dish list into the recipes list on that page
      renderCards(dishes);
      handleRecipeForm();
      $("#savedList") && renderSavedRecipes();
    }

    // If contact page: wire contact handlers
    if ($("#contactForm")) {
      handleContactForm();
      renderMessages();
    }

    initNavToggle();
    // highlight current nav link (simple)
    const current = location.pathname.split("/").pop() || "index.html";
    $$("nav a").forEach(a => {
      if (a.getAttribute("href") === current) a.classList.add("active");
    });
  }

  // run when DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else init();
})();
