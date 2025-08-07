import decodeJWT from "@/assets/decodeJWT.js";
import wrappedFetch from "@/assets/wrappedFetch";
import { reactive } from "vue";
import notificationStore from "./notificationStore.js";

export default reactive({
  loadedProfiles: false,
  profiles: [],

  async getFullProfileList() {
    await Promise.all(
      this.profiles.map(async (profile) => {
        try {
          const res = await fetch(`/api/users/me`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${profile.token}`,
            },
          });
          const data = await res.json();
          if (!res.ok) {
            console.warn(res);
          }
          if (res.status === 401 || res.status === 404) {
            this.removeProfile(profile._id);
            return this.saveProfileState();
          }
          profile.user = data;
          profile.decodedToken = decodeJWT(profile.token);
        } catch (err) {
          console.error("Error fetching profile:", profile._id, err);
        }
      })
    );
  },

  sortProfiles() {
    this.profiles.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return 0;
    });
  },

  getCurrentProfile() {
    return this.profiles.find((p) => p.isDefault === true);
  },

  getProfileById(id) {
    return this.profiles.find((p) => p._id === id);
  },

  removeProfile(id) {
    return new Promise((resolve, reject) => {
      try {
        const currentProfile = this.getCurrentProfile();
        if (currentProfile?._id !== id) {
          this.profiles = this.profiles.filter((p) => p._id !== id);
          this.saveProfileState();

          notificationStore.createNotif({
            type: "info",
            title: "Forgetting Profile",
            details: `Profile was forgotten`,
            duration: 5000,
            promise: {
              promise: new Promise((resolve) => resolve()),
              while: "Forgetting profile...",
            },
          });

          return resolve();
        }

        const clearRequest = wrappedFetch("/authenticate/clear-auth-cookies", {
          method: "POST",
          body: JSON.stringify({
            token: currentProfile.token,
          }),
        });

        notificationStore.createNotif({
          type: "info",
          title: "Forgetting Profile",
          details: `Profile was forgotten`,
          duration: 5000,
          promise: {
            promise: clearRequest,
            while: "Forgetting profile...",
          },
        });

        clearRequest
          .then((data) => {
            this.profiles = this.profiles.filter((p) => p._id !== id);
            this.saveProfileState();
            resolve();
          })
          .catch((err) => reject());
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  },

  clearDefaultStatus() {
    this.profiles.forEach((p) => {
      p.isDefault = false;
    });
  },

  addDefaultProfile(profile) {
    try {
      const payload = decodeJWT(profile.token);
      profile._id = payload._id;
      this.clearDefaultStatus();
      profile.isDefault = true;
      this.profiles = this.profiles.filter((p) => p._id !== profile._id);
      this.profiles.push(profile);
      this.sortProfiles();
      this.saveProfileState();
    } catch (err) {
      console.warn(err);
    }
  },

  saveProfileState() {
    const data = {
      profiles: this.profiles,
    };
    window.localStorage.setItem("profileState", JSON.stringify(data));
  },

  loadProfileState() {
    if (this.loadedProfiles) return;
    this.loadedProfiles = true;
    const data = window.localStorage.getItem("profileState");
    if (!data) return;
    const json = JSON.parse(data);
    this.profiles = json.profiles;
  },
});
