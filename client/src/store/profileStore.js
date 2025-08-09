import decodeJWT from "@/assets/decodeJWT.js";
import wrappedFetch from "@/assets/wrappedFetch";
import { reactive } from "vue";
import notificationStore from "./notificationStore.js";
import lS from "./localeStore.js";

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

  getDefaultProfile() {
    return this.profiles.find((p) => p.isDefault === true);
  },

  getProfileById(id) {
    return this.profiles.find((p) => p._id === id);
  },

  removeProfile(id) {
    return new Promise((resolve, reject) => {
      try {
        const defaultProfile = this.getDefaultProfile();
        if (defaultProfile?._id !== id) {
          this.profiles = this.profiles.filter((p) => p._id !== id);
          this.saveProfileState();

          notificationStore.createNotif({
            type: "info",
            title: lS.localeKeys.profileStore.notificationForget.title,
            details: lS.localeKeys.profileStore.notificationForget.details,
            duration: 5000,
            promise: {
              promise: new Promise((resolve) => resolve()),
              while: lS.localeKeys.profileStore.notificationForget.while,
            },
          });

          return resolve();
        }

        const clearRequest = wrappedFetch("/authenticate/clear-auth-cookies", {
          method: "POST",
          body: JSON.stringify({
            token: defaultProfile.token,
          }),
        });

        notificationStore.createNotif({
          type: "info",
          title: lS.localeKeys.profileStore.notificationForget.title,
          details: lS.localeKeys.profileStore.notificationForget.details,
          duration: 5000,
          promise: {
            promise: clearRequest,
            while: lS.localeKeys.profileStore.notificationForget.while,
          },
        });

        clearRequest
          .then((data) => {
            this.profiles = this.profiles.filter((p) => p._id !== id);
            if (this.profiles.length !== 0) {
              this.setDefaultProfile(this.profiles[0]._id)
                .then(() => resolve())
                .catch((err) => reject());
            }
            this.saveProfileState();
          })
          .catch((err) => reject());
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  },

  setDefaultProfile(id) {
    return new Promise((resolve, reject) => {
      try {
        const profile = this.getProfileById(id);
        const defaultRequest = wrappedFetch("/authenticate/set-default-token", {
          method: "POST",
          body: JSON.stringify({
            token: profile.token,
          }),
        });

        notificationStore.createNotif({
          type: "info",
          title: lS.localeKeys.profileStore.notificationDefault.title,
          details: `"${profile.user.username}" ${lS.localeKeys.profileStore.notificationDefault.details}`,
          duration: 5000,
          promise: {
            promise: defaultRequest,
            while: lS.localeKeys.profileStore.notificationDefault.while,
          },
        });

        defaultRequest
          .then((data) => {
            this.addDefaultProfile({
              token: data.token,
            });

            this.getFullProfileList().catch((err) => {
              console.warn(err);
            });

            resolve();
          })
          .catch((err) => reject(err));
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
