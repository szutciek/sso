import decodeJWT from "@/assets/decodeJWT.js";
import { reactive } from "vue";

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
          if (res.status === 401) {
            this.removeProfile(profile._id);
            return this.saveProfileState();
          }

          profile.user = data;
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

  removeProfile(id) {
    this.profiles = this.profiles.filter((p) => p._id !== id);
  },

  clearDefaultStatus() {
    this.profiles.forEach((p) => {
      p.isDefault = false;
    });
  },

  addDefaultProfile(profile) {
    const payload = decodeJWT(profile.token);
    profile._id = payload._id;
    this.clearDefaultStatus();
    profile.isDefault = true;
    this.removeProfile(profile._id);
    this.profiles.push(profile);
    this.sortProfiles();
    this.saveProfileState();
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
