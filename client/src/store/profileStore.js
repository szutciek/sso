import { reactive } from "vue";

export default reactive({
  selectedProfileIndex: null,
  profiles: [],

  getCurrentProfile() {
    return this.profiles[this.selectedProfileIndex];
  },

  selectNewProfile(index) {
    this.selectedProfileIndex = index;
  },

  removeProfile(id) {
    this.profiles = this.profiles.filter((p) => {
      p._id === id;
    });
  },

  addProfile(profile) {
    console.log(profile);
    this.removeProfile(profile._id);
    this.profiles.push(profile);
    this.selectNewProfile(this.profiles.length - 1);
  },
});
