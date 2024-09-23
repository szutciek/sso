import router from "@/router";
import { reactive } from "vue";

import appStore from "./appStore.js";

export default reactive({
  data: {
    name: null,
    surname: null,
    email: null,
    privelege: null,
  },

  isLoggedIn: false,

  loadPreviousState() {
    const data = this.retrieve();

    if (data != null) {
      this.isLoggedIn = true;
      this.updateData(data);
    }
  },
  checkLoginStatus() {
    fetch("/api/auth/me").then((res) => {
      if (res.status === 200) {
        this.isLoggedIn = true;
        res.json().then((data) => {
          this.isLoggedIn = true;
          this.updateData(data.data);
        });
      } else {
        this.logout();
      }
    });
  },
  async logout(userInitiated = false) {
    try {
      const promise = fetch("/api/auth/logout");

      if (userInitiated === true) {
        appStore.createNotif({
          type: "info",
          promise: {
            promise: promise,
            while: "Trwa wylogowywanie...",
          },
          title: `Zostałeś(aś) wylogowany(a)!`,
          details: `Do zobaczenia${
            this.data.name ? `, ${this.data.name}!` : "!"
          }`,
          duration: 5000,
          undo: () => {
            router.push("/login");
          },
        });
      }

      const result = await promise;

      if (result.status === 200) {
        this.data.name = null;
        this.data.surname = null;
        this.data.email = null;
        this.data.privelege = null;
        this.isLoggedIn = false;
        window.localStorage.removeItem("user");
      }

      if (userInitiated === true) {
        router.push("/");
      }
    } catch (err) {
      console.warn(`Could not log out: ${err.message}`);
    }
  },

  updateData(data) {
    this.data.name = data.name;
    this.data.surname = data.surname;
    this.data.email = data.email;
    this.data.privelege = data.privelege;
    this.save(this.data);
  },

  save(data) {
    window.localStorage.setItem("user", JSON.stringify(data));
  },
  retrieve() {
    return JSON.parse(window.localStorage.getItem("user"));
  },
});
