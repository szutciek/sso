import { reactive } from "vue";

export default reactive({
  notifications: [],

  createNotif(data) {
    if (!this.notifications) this.notifications = [];

    const id = crypto.randomUUID();

    this.notifications = [
      ...this.notifications,
      {
        id: id,
        type: data.type,
        title: data.title,
        details: data.details,
        start: new Date().getTime(),
        duration: data.duration,
        undo: data.undo,
        promise: data.promise,
      },
    ];

    return new Promise((res) => {
      setTimeout(() => {
        this.removeNotif(id);
        res();
      }, data.duration);
    });
  },

  removeNotif(id) {
    this.notifications = this.notifications.filter((notif) => notif.id !== id);
  },
});
