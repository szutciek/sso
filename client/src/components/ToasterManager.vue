<template>
  <ul class="notif-Toaster-Box"></ul>
</template>

<script setup>
import lS from "@/store/localeStore";
import notificationStore from "@/store/notificationStore.js";
import { onMounted, watch } from "vue";

class Handler {
  constructor() {
    this.boxWidth = 380;
    this.allIds = [];
    this.notifs = [];
    this.displayQueue = [];
    this.lastDisplayed = 0;
    this.showAll = false;
  }

  setElement(el) {
    this.element = el;
    this.element.addEventListener("mouseenter", () => {
      // if on mobile, don't show all notifs
      if (this.boxWidth === window.innerWidth - 20) return;
      this.showAllNotifs();
    });
    this.element.addEventListener("mouseleave", () => {
      this.showStackedNotifs();
    });
    this.element.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        const id = e.target.closest("li").dataset.id;
        const notif = this.notifs.find((n) => n.id === id);
        if (notif.undo) notif.undo();
        this.notifs.splice(this.notifs.indexOf(notif), 1);
        notif.animateOut(true).then(() => this.shiftNotifs());
      }
    });
  }

  showAllNotifs() {
    this.showAll = true;
    this.delayClose = new Date().getTime();
    this.shiftNotifs();
  }

  showStackedNotifs() {
    this.showAll = false;
    this.delayClose -= new Date().getTime();
    this.notifs.forEach((n) => {
      n.created -= this.delayClose;
    });
    this.shiftNotifs();
  }

  checkIfDisplayed(id) {
    return this.allIds.includes(id);
  }

  updateNotifs(notifs) {
    notifs.forEach((n) => {
      if (!this.checkIfDisplayed(n.id)) {
        this.allIds.push(n.id);
        const notif = new Notif(n, this);
        this.displayQueue.push(notif);
      }
    });
  }

  displayNotif(n) {
    if (document.body.contains(n.element)) return;
    this.element.appendChild(n.element);
    n.animateIn();
    this.shiftNotifs();
  }

  shiftNotifs() {
    if (this.showAll === true) {
      this.notifs.forEach((n, i) => {
        n.element.style.setProperty("scale", "1");
        n.element.style.setProperty("translate", `0 -${i * 100}%`);
        n.element.style.setProperty("transform", `translateY(-${i * 2}px)`);
      });
    } else {
      this.notifs.forEach((n, i) => {
        n.element.style.setProperty("z-index", `${10 - i}`);
        n.element.style.setProperty("scale", `${1 - i / 20}`);
        n.element.style.setProperty("translate", `0 -${i * 10}px`);
        n.element.style.removeProperty("transform");
      });
    }
  }

  handleNotifs() {
    if (this.notifs.length > 0 && this.showAll === false) {
      const now = new Date().getTime();
      this.notifs.forEach((n, i) => {
        if (n.end < now && !n.promise) {
          this.notifs.splice(i, 1);
          n.animateOut(false).then(() => this.shiftNotifs());
        }
      });
    }

    const cooldown = 50;
    if (
      this.displayQueue.length > 0 &&
      this.lastDisplayed + cooldown < new Date().getTime()
    ) {
      const notif = this.displayQueue.shift();
      notif.created = new Date().getTime();
      this.notifs.unshift(notif);
      this.displayNotif(notif);
      this.lastDisplayed = new Date().getTime();
    }

    if (this.notifs.length > 4) {
      const n = this.notifs.pop();
      n.animateOut(true).then(() => this.shiftNotifs());
    }
  }
}

class Notif {
  constructor(data, handler) {
    this.handler = handler;

    this.createAnimations();
    this.id = data.id || crypto.randomUUID();
    this.type = data.type || "info";
    this.title = data.title;
    this.created = data.start || new Date().getTime();
    this.details = data.details || null;
    this.duration = data.duration || 3000;
    this.undo = data.undo || null;
    this.promise = data.promise || null;

    if (this.promise) {
      this.type = "loading";
      this.promise?.promise
        .then(() => {
          this.replaceType("success");

          const info = this.element.querySelector(".info");
          info.innerHTML = "";

          const title = document.createElement("p");
          title.classList.add("title");
          title.textContent = this.title;

          const details = document.createElement("p");
          details.classList.add("details");
          details.textContent = this.details;

          if (this.testCarousel(title)) {
            info.appendChild(this.createCarousel(title, true));
          } else {
            info.appendChild(title);
          }

          if (this.testCarousel(details)) {
            info.appendChild(this.createCarousel(details, true));
          } else {
            info.appendChild(details);
          }
        })
        .catch((err) => {
          let errorText = "Unknown error occurred";
          if (typeof err === "string") {
            errorText = err;
          } else if (typeof err?.message === "string") {
            errorText = err.message;
          }
          this.replaceType("error");

          const info = this.element.querySelector(".info");
          info.innerHTML = "";

          const title = document.createElement("p");
          title.classList.add("title");
          title.textContent = `${lS.localeKeys.ToasterManager.error}: ${
            this.promise.while || this.title
          }`;

          const details = document.createElement("p");
          details.classList.add("details");
          details.textContent = errorText;

          if (this.testCarousel(title)) {
            info.appendChild(this.createCarousel(title, true));
          } else {
            info.appendChild(title);
          }

          if (this.testCarousel(details)) {
            info.appendChild(this.createCarousel(details, true));
          } else {
            info.appendChild(details);
          }
        })
        .finally(() => {
          this.created = new Date().getTime();
          this.promise = null;
        });
    }

    this.createElement();
  }

  createAnimations() {
    this.cfgOut = {
      duration: 600,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      fill: "both",
    };
    this.cfgIn = {
      duration: 600,
      easing: "cubic-bezier(0.7, 0, 0.84, 0)",
      fill: "both",
    };
  }

  replaceType(nT) {
    this.element.classList.remove(this.type);
    this.type = nT;
    this.element.classList.add(this.type);
  }

  animateIn() {
    this.element.animate(
      [
        { bottom: "-50px", opacity: 0 },
        { bottom: "0px", opacity: 1 },
      ],
      this.cfgOut
    );
  }

  animateOut(fade = false) {
    return new Promise((res) => {
      if (fade === true) {
        this.element.animate(
          [
            { transform: "scale(1)", zIndex: "0", opacity: 1 },
            { transform: "scale(0.95)", zIndex: "0", opacity: 0 },
          ],
          this.cfgIn
        ).onfinish = () => {
          this.element.remove();
          res();
        };
      } else {
        this.element.animate(
          [
            { bottom: "0px", opacity: 1 },
            { bottom: "-20px", opacity: 0 },
          ],
          this.cfgIn
        ).onfinish = () => {
          this.element.remove();
          res();
        };
      }
    });
  }

  createElement() {
    const main = document.createElement("li");
    main.dataset.id = this.id;
    main.classList.add(this.type);
    main.classList.add("noSelect");
    main.style.setProperty("width", `${this.handler.boxWidth}px`);
    main.style.setProperty("scale", "1");
    main.style.setProperty("translate", "0 0");
    const img = document.createElement("img");
    img.src = "/icons/notif-icon-warning.svg";
    img.alt = "Notificaiton Icon";
    main.appendChild(img);
    const info = document.createElement("div");
    info.classList.add("info");
    const title = document.createElement("p");
    title.classList.add("title");
    if (this.promise) {
      title.textContent = this.promise.while || "Loading...";
    } else {
      title.textContent = this.title;
    }
    const details = document.createElement("p");
    details.classList.add("details");
    details.textContent = this.details;

    const loader = document.createElement("div");
    loader.classList.add("loader");
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      dot.style.setProperty(
        "animation",
        `toastLoad 0.5s ease ${i * 0.2}s alternate infinite`
      );
      loader.appendChild(dot);
    }
    const success = document.createElement("div");
    success.classList.add("success");
    const check = document.createElement("p");
    check.textContent = "✓";
    success.appendChild(check);
    main.appendChild(loader);
    main.appendChild(success);

    const carousel = document.createElement("div");
    carousel.classList.add("carousel");
    const slider = document.createElement("div");
    slider.classList.add("slider");

    if (this.testCarousel(title)) {
      info.appendChild(this.createCarousel(title, true));
    } else {
      info.appendChild(title);
    }

    if (this.testCarousel(details)) {
      info.appendChild(this.createCarousel(details, true));
    } else {
      info.appendChild(details);
    }

    main.appendChild(info);
    if (this.undo) {
      const button = document.createElement("button");
      button.textContent = "Undo";
      main.appendChild(button);
    }
    this.element = main;
    return main;
  }

  createCarousel(inside, infinite = false) {
    const slider = document.createElement("div");
    slider.classList.add("slider");
    slider.setAttribute(
      "style",
      `animation: carousel ${this.duration / 1000 - 0.5}s linear ${
        infinite ? "infinite" : ""
      } 0.5s`
    );
    slider.appendChild(inside.cloneNode(true));
    slider.appendChild(inside);
    const carousel = document.createElement("div");
    carousel.classList.add("carousel");
    carousel.appendChild(slider);
    return carousel;
  }

  testCarousel(el) {
    const testDiv = document.createElement("div");
    testDiv.classList.add("notif-Toaster-Box-Test-Carousel");
    const clone = el.cloneNode(true);
    testDiv.appendChild(clone);
    document.body.appendChild(testDiv);
    const rect = clone.getBoundingClientRect();
    testDiv.remove();
    if (this.undo) {
      return rect.width > this.handler.boxWidth - 127;
      // return rect.width > 253;
    } else {
      return rect.width > this.handler.boxWidth - 32;
      // return rect.width > 348;
    }
  }

  get end() {
    return this.created + this.duration;
  }
}

const handler = new Handler();

onMounted(() => {
  if (window.innerWidth - 20 < 380) {
    handler.boxWidth = window.innerWidth - 20;
  }
  handler.setElement(document.querySelector(".notif-Toaster-Box"));
});

setInterval(() => {
  handler.handleNotifs();
}, 100);

watch(
  () => notificationStore.notifications,
  () => {
    handler.updateNotifs(notificationStore.notifications);
  }
);
</script>

<style>
.notif-Toaster-Box {
  position: fixed;
  bottom: 2rem;
  right: 2rem;

  list-style: none;
  z-index: 1000;
}

.notif-Toaster-Box li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  position: absolute;
  right: 0;
  height: 65px;

  padding: 15px 15px;

  background-color: #fff;
  border: 1px solid #c8c8c8;
  /* border-radius: 4px; */

  transition: 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.notif-Toaster-Box li img {
  display: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  padding: 3px;
}
.notif-Toaster-Box li.warning img {
  display: block;
  background-color: #f1d02c;
}
.notif-Toaster-Box li.error img {
  display: block;
  background-color: #f12c2c;
}
.notif-Toaster-Box li .loader {
  display: none;
}
.notif-Toaster-Box li.loading .loader {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: #e3e3e3;
}
.notif-Toaster-Box li.loading .loader .dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background-color: #1c1c1c;
}
.notif-Toaster-Box li.loading button {
  pointer-events: none;
  opacity: 0.5;
  cursor: auto;
}
.notif-Toaster-Box li .success {
  display: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  padding: 1px;
  background-color: #e3e3e3;
  background-image: radial-gradient(#1c1c1c 50%, #e3e3e3 50%);
  background-size: 0 0;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  animation: openSuccess 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}
.notif-Toaster-Box li .success p {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  text-align: center;
  animation: openSuccessP 0.5s 0.1s both;
}
.notif-Toaster-Box li.success .success {
  display: block;
}
.notif-Toaster-Box li .info {
  flex: 2;
}
.notif-Toaster-Box li .info .title {
  font-size: 13px;
  font-weight: 400;
  color: #1c1c1c;

  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.notif-Toaster-Box li .info .details {
  font-size: 13px;
  font-weight: 300;
  color: #6f6f6f;

  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.notif-Toaster-Box li button {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  background-color: #1c1c1c;

  font-size: 13px;
  font-weight: 300;
  color: #fff;
  cursor: pointer;
}

@keyframes toastLoad {
  0% {
    translate: 0 2px;
  }
  100% {
    translate: 0 -2px;
  }
}

@keyframes openSuccess {
  0% {
    background-size: 0 0;
  }
  100% {
    background-size: 150% 150%;
  }
}
@keyframes openSuccessP {
  0% {
    color: transparent;
  }
  50% {
    color: #fff;
  }
  100% {
    color: #fff;
  }
}

.notif-Toaster-Box .carousel {
  width: calc(100% + 20px);
  height: 20px;
  overflow: hidden;
  position: relative;
  margin-left: -10px;
}
.notif-Toaster-Box .carousel:before,
.notif-Toaster-Box .carousel:after {
  content: "";
  position: absolute;
  top: 0;
  z-index: 2;
  width: 10px;
  height: 100%;
}
.notif-Toaster-Box .carousel:before {
  left: 0;
  background: linear-gradient(-90deg, #ffffff00, #ffffff);
}
.notif-Toaster-Box .carousel:after {
  right: 0;
  background: linear-gradient(90deg, #ffffff00, #ffffff);
}
.notif-Toaster-Box .carousel .slider {
  position: absolute;
  top: 0;
  left: 10px;
  z-index: 1;
  display: flex;
  gap: 40px;
}
.notif-Toaster-Box .carousel p {
  white-space: nowrap;
}

.notif-Toaster-Box-Test-Carousel {
  position: absolute;
  top: -1000px;
  left: -1000px;
}
.notif-Toaster-Box-Test-Carousel p {
  white-space: nowrap;
  font-size: 13px;
}
.notif-Toaster-Box-Test-Carousel .title {
  font-weight: 400;
}
.notif-Toaster-Box-Test-Carousel .details {
  font-weight: 300;
}

@keyframes carousel {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-50% - 20px));
  }
}

@media only screen and (max-width: 400px) {
  .notif-Toaster-Box {
    bottom: 2rem;
    right: 10px;
  }
}
</style>
