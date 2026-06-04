(() => {
  const data = window.BIRTH_LANDING_DATA;
  const levelById = Object.fromEntries(data.levels.map((level) => [level.id, level]));
  const generalCategoryById = Object.fromEntries(
    data.generalCategories.map((category) => [category.id, category])
  );

  let activeLevelId = "amarillo";
  let activeAreaName = data.areas[0]?.name || "";

  const consequenceDefaults = {
    verde: {
      action: "Llamada de atención",
      immediate: "Recordatorio del líder directo y corrección al momento.",
      documentation: ["Nota simple si aplica", "Fecha del recordatorio", "Acuerdo verbal de corrección"]
    },
    amarillo: {
      action: "Feedback formal",
      immediate: "Conversación clara con líder directo, acuerdo y seguimiento por 2 semanas.",
      documentation: ["Feedback documentado", "Acuerdo de mejora", "Fecha de seguimiento"]
    },
    morado: {
      action: "Acta administrativa o plan de mejora",
      immediate: "Revisión formal con líder y People. Puede aplicar acta desde la primera vez, según impacto.",
      documentation: ["Evidencia del caso", "Impacto generado", "Plan de mejora de 30 días"]
    },
    rojo: {
      action: "Evaluación de pertenencia",
      immediate: "Escalamiento inmediato con líder, People y Dirección. No se maneja como feedback informal.",
      documentation: ["Acta administrativa", "Evidencia formal", "Revisión con People y Dirección"]
    }
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function el(id) {
    return document.getElementById(id);
  }

  function list(items) {
    return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function levelBadge(levelId) {
    const level = levelById[levelId] || data.levels[0];
    return `<span class="badge" style="background:${level.color}">${escapeHtml(level.name)}</span>`;
  }

  function renderHeroLevels() {
    el("heroMiniLevels").innerHTML = data.levels
      .map(
        (level) => `
          <div class="mini-level">
            <span><span class="dot" style="background:${level.color}"></span> ${escapeHtml(level.name)}</span>
            <strong>${escapeHtml(level.uiTreatment)}</strong>
          </div>
        `
      )
      .join("");
  }

  function renderPrinciples() {
    el("principleGrid").innerHTML = data.principles
      .map(
        (principle, index) => `
          <article class="principle-card">
            <strong>${String(index + 1).padStart(2, "0")}</strong>
            <h3>${escapeHtml(principle.title)}</h3>
            <p>${escapeHtml(principle.description)}</p>
          </article>
        `
      )
      .join("");
  }

  function renderLevelTabs() {
    el("levelTabs").innerHTML = data.levels
      .map(
        (level) => `
          <button class="level-tab ${level.id === activeLevelId ? "is-active" : ""}" type="button" data-level="${level.id}">
            <span><span class="dot" style="background:${level.color}"></span> <strong>${escapeHtml(level.name)}</strong><br><small>${escapeHtml(level.label)}</small></span>
            <span>${escapeHtml(level.recoveryWindow)}</span>
          </button>
        `
      )
      .join("");

    document.querySelectorAll("[data-level]").forEach((button) => {
      button.addEventListener("click", () => {
        activeLevelId = button.dataset.level;
        renderLevelTabs();
        renderLevelPanel();
      });
    });
  }

  function renderLevelPanel() {
    const level = levelById[activeLevelId];
    const consequence = consequenceDefaults[level.id];
    el("levelPanel").innerHTML = `
      <div class="level-panel-hero" style="background:${level.color}">
        <span class="badge">${escapeHtml(level.label)}</span>
        <h3>${escapeHtml(level.name)}</h3>
        <p>${escapeHtml(level.shortDescription)}</p>
      </div>
      <div class="info-grid">
        <div class="info-box">
          <h4>Tiempo</h4>
          <p>${escapeHtml(level.recoveryWindow)}</p>
        </div>
        <div class="info-box">
          <h4>Acción del líder</h4>
          <p>${escapeHtml(level.leaderAction)}</p>
        </div>
        <div class="info-box">
          <h4>Señal de mejora</h4>
          <p>${escapeHtml(level.recoverySignal)}</p>
        </div>
      </div>
      <div class="card" style="border-radius:0; box-shadow:none; border-left:0; border-right:0; border-bottom:0;">
        <span class="badge" style="background:var(--dark)">Consecuencia: ${escapeHtml(consequence.action)}</span>
        <p>${escapeHtml(consequence.immediate)}</p>
        <h4>Qué se documenta</h4>
        ${list(consequence.documentation)}
      </div>
    `;
  }

  function renderGeneralRules() {
    el("generalEyebrow").textContent = data.generalIntro.eyebrow;
    el("generalTitle").textContent = data.generalIntro.title;
    el("generalSubtitle").textContent = data.generalIntro.subtitle;
    el("generalBody").textContent = data.generalIntro.body;

    el("generalPrinciples").innerHTML = data.generalPrinciples
      .map(
        (principle, index) => `
          <article>
            <span class="badge" style="background:var(--orange)">${String(index + 1).padStart(2, "0")}</span>
            <h3>${escapeHtml(principle.title)}</h3>
            <p>${escapeHtml(principle.description)}</p>
          </article>
        `
      )
      .join("");

    el("generalLevels").innerHTML = data.generalLevels
      .map(
        (level) => `
          <article class="card">
            <span class="badge" style="background:${level.color}">${escapeHtml(level.name)}</span>
            <h3>${escapeHtml(level.label)}</h3>
            <p>${escapeHtml(level.description)}</p>
            <p><strong>Respuesta:</strong> ${escapeHtml(level.typicalResponse)}</p>
          </article>
        `
      )
      .join("");

    el("categoryGrid").innerHTML = data.generalCategories
      .map(
        (category) => `
          <article class="category-card">
            <span class="badge" style="background:var(--pink)">${escapeHtml(category.uiBadge)}</span>
            <h3>${escapeHtml(category.name)}</h3>
            <p>${escapeHtml(category.description)}</p>
            ${list(category.relatedRules)}
          </article>
        `
      )
      .join("");

    const copy = data.consequenceSectionCopy;
    el("escalationTitle").textContent = copy.title;
    el("escalationBody").textContent = copy.body;
    el("actaTitle").textContent = copy.administrativeRecordTitle;
    el("actaCopy").textContent = copy.administrativeRecordCopy;
    el("belongingTitle").textContent = copy.belongingReviewTitle;
    el("belongingCopy").textContent = copy.belongingReviewCopy;
    el("rescissionTitle").textContent = copy.rescissionReviewTitle;
    el("rescissionCopy").textContent = copy.rescissionReviewCopy;
    el("legalNote").textContent = data.legalAndHrNote;
  }

  function renderAreaTabs() {
    el("areaTabs").innerHTML = data.areas
      .map(
        (area) => `
          <button class="area-tab ${area.name === activeAreaName ? "is-active" : ""}" type="button" data-area="${escapeHtml(area.name)}">
            <span><strong>${escapeHtml(area.shortName)}</strong><br><small>${escapeHtml(area.name)}</small></span>
          </button>
        `
      )
      .join("");

    document.querySelectorAll("[data-area]").forEach((button) => {
      button.addEventListener("click", () => {
        activeAreaName = button.dataset.area;
        renderAreaTabs();
        renderAreaDetail();
      });
    });
  }

  function renderAreaDetail() {
    const area = data.areas.find((item) => item.name === activeAreaName) || data.areas[0];
    el("areaDetail").innerHTML = `
      <p class="eyebrow pink">${escapeHtml(area.shortName)}</p>
      <h3>${escapeHtml(area.name)}</h3>
      <p>${escapeHtml(area.focus)}</p>
      <div class="area-columns">
        <section>
          <h4>Situaciones comunes</h4>
          ${list(area.commonSituations)}
        </section>
        <section>
          <h4>Preguntas para líderes</h4>
          ${list(area.leaderQuestions)}
        </section>
        <section>
          <h4>Evidencia y recuperación</h4>
          ${list([...area.evidence, ...area.recoverySignals])}
        </section>
      </div>
    `;
  }

  function normalizedCases() {
    const areaCases = data.practicalCases.map((item) => ({
      ...item,
      group: item.area,
      leaderResponse: item.leaderResponse || [],
      recoveryAction: item.recoveryAction || [],
      source: "Área"
    }));

    const general = data.generalCases.map((item) => {
      const category = generalCategoryById[item.category];
      return {
        ...item,
        area: category?.name || "Reglamento general",
        group: category?.name || "Reglamento general",
        impactType: category?.uiBadge || "Reglamento general",
        leaderResponse: item.whatToDo || [],
        recoveryAction: item.recovery || [],
        source: "Reglamento"
      };
    });

    return [...areaCases, ...general];
  }

  function setupCaseFilters() {
    const groups = [...new Set(normalizedCases().map((item) => item.group))].sort();
    el("caseAreaFilter").innerHTML = `<option value="">Todas</option>${groups
      .map((group) => `<option value="${escapeHtml(group)}">${escapeHtml(group)}</option>`)
      .join("")}`;
    el("caseLevelFilter").innerHTML = `<option value="">Todos</option>${data.levels
      .map((level) => `<option value="${level.id}">${escapeHtml(level.name)}</option>`)
      .join("")}`;

    ["caseSearch", "caseAreaFilter", "caseLevelFilter"].forEach((id) => {
      el(id).addEventListener("input", renderCases);
      el(id).addEventListener("change", renderCases);
    });
  }

  function renderCases() {
    const search = el("caseSearch").value.trim().toLowerCase();
    const group = el("caseAreaFilter").value;
    const level = el("caseLevelFilter").value;
    const cases = normalizedCases().filter((item) => {
      const searchable = [
        item.title,
        item.situation,
        item.why,
        item.area,
        item.impactType,
        item.source
      ]
        .join(" ")
        .toLowerCase();
      return (!search || searchable.includes(search)) && (!group || item.group === group) && (!level || item.possibleLevel === level);
    });

    el("caseResultCount").textContent = `${cases.length} caso${cases.length === 1 ? "" : "s"} encontrado${cases.length === 1 ? "" : "s"}.`;
    el("caseGrid").innerHTML = cases
      .map(
        (item) => `
          <article class="case-card">
            <div class="case-head">
              ${levelBadge(item.possibleLevel)}
              <small>${escapeHtml(item.source)}</small>
            </div>
            <h3>${escapeHtml(item.title)}</h3>
            <p><strong>${escapeHtml(item.area)}</strong> · ${escapeHtml(item.impactType || "")}</p>
            <p>${escapeHtml(item.situation)}</p>
            <p><strong>Por qué:</strong> ${escapeHtml(item.why)}</p>
            <details>
              <summary>Ver respuesta y recuperación</summary>
              <h4>Qué hacer</h4>
              ${list(item.leaderResponse)}
              <h4>Recuperación</h4>
              ${list(item.recoveryAction)}
              <p><strong>Señal:</strong> ${escapeHtml(item.recoverySignal)}</p>
            </details>
          </article>
        `
      )
      .join("");
  }

  function renderRecovery() {
    el("recoveryTimeline").innerHTML = data.recoverySteps
      .map(
        (step, index) => `
          <article>
            <span class="number">${index + 1}</span>
            <div>
              <span class="badge" style="background:var(--lilac); color:var(--dark)">${escapeHtml(step.eyebrow)}</span>
              <h3>${escapeHtml(step.title)}</h3>
              <p>${escapeHtml(step.description)}</p>
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderLeaders() {
    el("leaderCriteria").innerHTML = data.leaderCriteria.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    el("diagnosticQuestions").innerHTML = data.diagnosticQuestions
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");

    el("matrixTitle").textContent = data.leaderDecisionMatrix.title;
    el("matrixDescription").textContent = data.leaderDecisionMatrix.description;
    el("matrixGrid").innerHTML = data.leaderDecisionMatrix.questions
      .map(
        (question) => `
          <article>
            <h4>${escapeHtml(question.question)}</h4>
            ${list(question.options)}
          </article>
        `
      )
      .join("");

    el("communicationTemplates").innerHTML = data.communicationTemplates
      .map(
        (template) => `
          <details>
            <summary>${escapeHtml(template.title)}</summary>
            <p><strong>${escapeHtml(template.useCase)}</strong></p>
            <p>${escapeHtml(template.message)}</p>
          </details>
        `
      )
      .join("");
  }

  function setupNav() {
    const toggle = document.querySelector(".nav-toggle");
    const links = el("navLinks");
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupNav();
    renderHeroLevels();
    renderPrinciples();
    renderLevelTabs();
    renderLevelPanel();
    renderGeneralRules();
    renderAreaTabs();
    renderAreaDetail();
    setupCaseFilters();
    renderCases();
    renderRecovery();
    renderLeaders();
  });
})();
