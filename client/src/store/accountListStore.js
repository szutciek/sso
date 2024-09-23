import { reactive } from "vue";

export default reactive({
  selectedProfileIndex: 0,
  profiles: [
    {
      profile: "https://assets.kanapka.eu/images/ceo.png",
      email: "szutermaciek@gmail.com",
      username: "SZUTCIEK",
      gender: "Male",
      birthday: "23/07/2005",
      authorizedApps: [
        {
          name: "Kanapka Studios",
          developerId: "kanapka",
          apps: [
            {
              name: "Webcam Game",
              appId: "webcam-game",
              shared: ["email", "username", "color", "age"],
            },
            {
              name: "Gaming",
              appId: "gaming",
              shared: ["email", "username", "color"],
            },
            {
              name: "Sztorify",
              appId: "sztorify",
              shared: ["email", "username", "birthday"],
            },
          ],
        },
        {
          name: "Jane",
          developerId: "jane",
          apps: [
            {
              name: "Janes Cooking Website",
              appId: "janes-cooking-website",
              shared: ["email", "username"],
            },
          ],
        },
      ],
    },
    {
      profile: "https://assets.kanapka.eu/images/jaehee.jpg",
      email: "jaeheecha@gmail.com",
      username: "JaneCha",
      gender: "Female",
      birthday: "25/09/2005",
      authorizedApps: [
        {
          name: "Kanapka Studios",
          developerId: "kanapka",
          apps: [
            {
              name: "Webcam Game",
              appId: "webcam-game",
              shared: ["email", "username", "color", "age"],
            },
            {
              name: "Gaming",
              appId: "gaming",
              shared: ["email", "username", "color"],
            },
          ],
        },
        {
          name: "Jane",
          developerId: "jane",
          apps: [
            {
              name: "Janes Cooking Website",
              appId: "janes-cooking-website",
              shared: ["email", "username"],
            },
          ],
        },
      ],
    },
  ],

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
