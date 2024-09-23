<template>
  <div :class="['userProfile', props.selected && 'selected']">
    <div class="userInfo flexVert">
      <img :src="props.profile.profile" alt="profile" />
      <div>
        <p class="b2 med">{{ props.profile.username }}</p>
        <div :class="['accordion-content', !props.selected && 'hidden']">
          <div>
            <p class="b3">
              {{ props.profile.email }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div :class="['details', 'accordion-content', !props.selected && 'hidden']">
      <div>
        <div class="distance">
          <p class="b2">
            <span>{{ lS.localeKeys.UserProfile.birthday }}:</span>
            {{ props.profile.birthday }}
          </p>
          <p class="b2">
            <span>{{ lS.localeKeys.UserProfile.gender }}:</span>
            {{ props.profile.gender }}
          </p>
        </div>
      </div>
    </div>
    <div :class="['actions', 'accordion-content', !props.selected && 'hidden']">
      <div>
        <div class="distance flexVert">
          <button class="b3 med edit">
            {{ lS.localeKeys.UserProfile.edit }}
          </button>
          <button class="b3 med delete">
            {{ lS.localeKeys.UserProfile.forget }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import lS from "@/store/localeStore.js";
import { defineProps, defineEmits } from "vue";
const props = defineProps(["profile", "selected"]);
const emits = defineEmits(["edit", "delete"]);
</script>

<style scoped>
.userProfile .details .distance,
.userProfile .actions .distance {
  padding: 10px 0 0 0;
  border-top: 1px dotted var(--third-color-d);
  margin: 10px 0 0 0;
}
.userProfile .details p {
  color: var(--third-color-l);
}
.userProfile .details p span {
  color: var(--third-color-d);
}
.userProfile .actions div {
  gap: 10px;
}
.userProfile .actions button {
  width: 100%;
  padding: 6px 12px;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  border: 1px solid transparent;
  color: #fff;
  background-color: transparent;
}
.userProfile .actions button.edit {
  background-color: #fff1;
}
.userProfile .actions button.delete {
  background-color: #c442;
}
.userProfile .actions button.edit:hover {
  background-color: #fff2;
}
.userProfile .actions button.delete:hover {
  background-color: #c444;
}

.userProfile {
  width: 100%;
  height: 100%;
  overflow: hidden;

  border: 2px dotted transparent;
  border-radius: 10px;
  padding: 10px;

  color: #fff;
  cursor: pointer;
  transition: 0.2s;
}
.userProfile.selected {
  border: 2px dotted var(--main-color-l);
  cursor: unset;
}

.userProfile .userInfo {
  gap: 20px;
}
.userProfile .userInfo img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #fff;
}
</style>
