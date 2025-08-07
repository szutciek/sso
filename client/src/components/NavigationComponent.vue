<template>
  <nav ref="nav" class="keep-dropdown-open">
    <div class="bar mW1200">
      <div class="logo">
        <div class="extension"></div>
        <Logo class="graphic" />
      </div>

      <ul>
        <li
          v-for="(item, i) in config.items"
          :class="item.type === 'drop' ? 'drop' : 'close-dropdown'"
          :data-interactionid="item.interactionId"
          :key="i"
        >
          {{ lS.localeKeys.NavigationComponent.items[i].name }}
        </li>
      </ul>

      <div class="actions close-dropdown">
        <button class="lang" @click="lS.toggleNextLocale()">
          {{ lS.locale.toUpperCase() }}
        </button>
        <button
          class="primary action hoverShadow"
          @click="$router.push(`/user/panel`)"
        >
          {{ lS.localeKeys.NavigationComponent.action }}
        </button>
      </div>
    </div>

    <div class="dropdownLocation">
      <NavigationDropdownComponent :config="config" />
    </div>
  </nav>
</template>

<style scoped>
nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  padding: 50px 10px 10px 10px;

  background-color: #fff;
  border-bottom: 1px solid #ddd;
}
.bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bar .logo {
  position: relative;
}
.bar .logo .extension {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  height: 500px;
  background-color: var(--main-color-l);

  overflow: hidden;
  border-radius: 0 0 4px 4px;
}

.bar ul {
  display: flex;
  flex: 2;
  gap: 24px;
  padding: 0 40px;
  list-style: none;
}
.bar li {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  padding: 8px 16px;
  cursor: pointer;
}

.bar .actions {
  display: flex;
  gap: 16px;
}
.bar .actions .lang {
  font-size: 16px;
  font-weight: 400;
  padding: 8px 12px;
  background-color: #0000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.bar .actions .primary {
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  padding: 8px 16px;
  background-color: var(--main-color-l);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.2s;
}

@media screen and (max-width: 800px) {
  .bar {
    padding: 0;
  }
  .bar ul {
    gap: 12px;
    padding: 0 20px;
  }
  .bar li {
    padding: 8px 12px;
  }
}
</style>

<script setup>
import { defineEmits, ref, onMounted } from "vue";
const emit = defineEmits(["update-nav-height"]);
const nav = ref(null);
onMounted(() => {
  emit("update-nav-height", nav.value.getBoundingClientRect().height);
});

import lS from "@/store/localeStore";

import Logo from "@/components/LogoComponent.vue";
import NavigationDropdownComponent from "./NavigationDropdownComponent.vue";

const config = {
  items: [
    {
      id: 1,
      type: "drop",
      dropIndex: 0,
      interactionId: `d-${crypto.randomUUID()}`,
    },
    {
      id: 2,
      type: "drop",
      dropIndex: 1,
      interactionId: `d-${crypto.randomUUID()}`,
    },
    {
      id: 3,
      type: "link",
    },
  ],
  drops: [
    {
      name: lS.localeKeys.NavigationComponent.items[0].name,
      items: [
        {
          type: "large",
          title: lS.localeKeys.NavigationComponent.items[0].topics[0].title,
          description:
            lS.localeKeys.NavigationComponent.items[0].topics[0].description,
          image: "https://assets.kanapka.eu/images/ceo.png",
          link: "/features/accounts",
        },
        {
          type: "large",
          title: lS.localeKeys.NavigationComponent.items[0].topics[1].title,
          description:
            lS.localeKeys.NavigationComponent.items[0].topics[1].description,
          image: "https://assets.kanapka.eu/images/ceo.png",
          link: "/features/flexibility",
        },
        {
          type: "list",
          title: lS.localeKeys.NavigationComponent.items[0].topics[2].title,
          list: [
            {
              text: lS.localeKeys.NavigationComponent.items[0].topics[2]
                .list[0],
              link: "/features/notifications",
            },
            {
              text: lS.localeKeys.NavigationComponent.items[0].topics[2]
                .list[1],
              link: "/features/account-management",
            },
          ],
        },
      ],
    },
    {
      name: lS.localeKeys.NavigationComponent.items[1].name,
      items: [
        {
          type: "large",
          title: lS.localeKeys.NavigationComponent.items[1].topics[0].title,
          description:
            lS.localeKeys.NavigationComponent.items[1].topics[0].description,
          image: "https://assets.kanapka.eu/images/ceo.png",
          link: "/features/accounts",
        },
        {
          type: "large",
          title: lS.localeKeys.NavigationComponent.items[1].topics[1].title,
          description:
            lS.localeKeys.NavigationComponent.items[1].topics[1].description,
          image: "https://assets.kanapka.eu/images/ceo.png",
          link: "/features/accounts",
        },
      ],
    },
  ],
};
</script>
