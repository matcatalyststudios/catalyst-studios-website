(function(){
  "use strict";

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var root = document.documentElement;
  var scrim = document.querySelector(".nav-scrim");

  function closeNav(){
    root.classList.remove("nav-open");
    if(toggle) toggle.setAttribute("aria-expanded", "false");
  }
  function openNav(){
    root.classList.add("nav-open");
    if(toggle) toggle.setAttribute("aria-expanded", "true");
  }
  if(toggle){
    toggle.addEventListener("click", function(){
      root.classList.contains("nav-open") ? closeNav() : openNav();
    });
  }
  if(scrim){ scrim.addEventListener("click", closeNav); }
  document.querySelectorAll(".main-nav .nav-link").forEach(function(link){
    link.addEventListener("click", closeNav);
  });
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape") closeNav();
  });

  /* ---------- Header shrink on scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScroll(){
    if(!header) return;
    if(window.scrollY > 24) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Active nav link ---------- */
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(function(link){
    var href = link.getAttribute("href");
    if(href === path || (path === "" && href === "index.html")){
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if("IntersectionObserver" in window && revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function(el, i){
      el.style.setProperty("--i", i % 8);
      io.observe(el);
    });
  } else {
    revealEls.forEach(function(el){ el.classList.add("is-visible"); });
  }

  /* ---------- Accordion (FAQ) ---------- */
  document.querySelectorAll(".accordion-trigger").forEach(function(btn){
    btn.addEventListener("click", function(){
      var item = btn.closest(".accordion-item");
      var wasOpen = item.classList.contains("is-open");
      item.parentElement.querySelectorAll(".accordion-item").forEach(function(other){
        other.classList.remove("is-open");
        other.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
      });
      if(!wasOpen){
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Contact form (mailto fallback) ---------- */
  var form = document.getElementById("quoteForm");
  if(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var status = document.getElementById("formStatus");
      var data = new FormData(form);
      var required = ["name", "email", "message"];
      var missing = required.filter(function(key){
        var val = data.get(key);
        return !val || !String(val).trim();
      });

      if(missing.length){
        status.textContent = "Please fill in your name, email, and a short project description.";
        status.className = "form-status is-visible error";
        return;
      }

      var name = data.get("name");
      var email = data.get("email");
      var phone = data.get("phone") || "Not provided";
      var projectType = data.get("projectType") || "Not specified";
      var budget = data.get("budget") || "Not specified";
      var message = data.get("message");

      var body = "Name: " + name + "\nEmail: " + email + "\nPhone: " + phone +
        "\nProject type: " + projectType + "\nBudget range: " + budget +
        "\n\nProject details:\n" + message;

      var mailto = "mailto:mat.catalyststudios@gmail.com" +
        "?subject=" + encodeURIComponent("New Quote Request — " + name) +
        "&body=" + encodeURIComponent(body);

      window.location.href = mailto;

      status.textContent = "Opening your email app to send this through — if nothing happens, email us directly at mat.catalyststudios@gmail.com.";
      status.className = "form-status is-visible success";
    });
  }

  /* ---------- Current year ---------- */
  document.querySelectorAll("[data-year]").forEach(function(el){
    el.textContent = new Date().getFullYear();
  });
})();
