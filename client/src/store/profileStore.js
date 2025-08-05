import { reactive } from "vue";

export default reactive({
  selectedProfileIndex: 0,
  profiles: [],

  getCurrentProfile() {
    return this.profiles[this.selectedProfileIndex];
  },

  selectNewProfile(index) {
    this.selectedProfileIndex = index;
  },

  addProfile(profile) {
    this.profiles.push(profile);
  },
});
