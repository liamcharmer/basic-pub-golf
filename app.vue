<template>
  <div class="container mx-auto py-4 px-4 min-h-screen">
    <UTabs :items="items" class="w-full">
      <template #item="{ item }">
        <UCard>
          <template #header>
            <p
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              {{ item.label }}
            </p>
          </template>

          <div>
            <template v-if="item.key == 'account'">
              <template v-if="user == null">
                <h2 class="font-bold mb-2">Create player</h2>
                <UForm :state="state" class="space-y-4" @submit="onSubmit">
                  <UFormGroup label="Name" name="name">
                    <UInput v-model="state.name" />
                  </UFormGroup>

                  <UButton type="submit"> Create </UButton>
                </UForm>
                <hr class="my-4" />
                <h2 class="font-bold mb-2">Join as player</h2>
                <UForm
                  :state="codeState"
                  class="space-y-4 mb-4"
                  @submit="codeSubmit"
                >
                  <UFormGroup label="Code" name="code">
                    <UInput v-model="codeState.code" />
                  </UFormGroup>

                  <UButton type="submit"> Join </UButton>
                </UForm>
              </template>

              <template v-else>
                <h1 class="text-3xl mb-4">{{ user.name }}</h1>
                <p>
                  Unique Code: <strong>{{ user.code }}</strong>
                </p>
                <p class="text-xs italic mb-4">
                  Use this code to resume as this player (incase something
                  happens)
                </p>
                <p>
                  Total Score: <strong>{{ user.score }}</strong>
                </p>
                <template v-if="user.name == 'Kai B' || user.name == 'Liam C'">
                  <UButton class="mt-4" @click="wipeUsers()"
                    >Delete all Players</UButton
                  >
                </template>
              </template>
            </template>
            <template v-if="item.key == 'holes'">
              <template v-if="user !== null">
                <UTable :rows="user.holes" :columns="columns">
                  <template #score-data="{ row }">
                    <input
                      type="number"
                      @change="updateUser"
                      min="0"
                      step="1"
                      v-model="row.score"
                      style="width: 50px"
                      class="border rounded p-4 text-center border-black"
                    />
                  </template>
                </UTable>
              </template>
            </template>
            <template v-if="item.key == 'leaderboard'">
              <UTable :rows="leaderboards" :columns="leaderboardColumns" />
            </template>
          </div>

          <template #footer>
            Pub Crawl {{ new Date().getFullYear() }}
          </template>
        </UCard>
      </template>
    </UTabs>
  </div>
</template>

<script setup>
import { useLocalStorage } from "~/composables/useLocalStorage";

const { setItem, getItem, removeItem } = useLocalStorage();
let user = ref(null);

if (getItem("user")) {
  user.value = getItem("user");
}
let creatingUser = ref(false);
const state = reactive({
  name: undefined,
});

const codeState = reactive({
  code: undefined,
});

const columns = [
  {
    key: "hole",
    class: "font-bold",
    label: "Hole",
  },

  {
    key: "pub",
    label: "Pub",
  },
  {
    key: "drink",
    label: "Drink",
  },
  {
    key: "par",
    label: "Par",
  },
  {
    key: "score",
    label: "Score",
  },
];

async function codeSubmit(event) {
  let foundUser = await $fetch(`/api/players/${event.data.code}`, {});
  if (foundUser && foundUser !== null) {
    user.value = foundUser;
    setItem("user", foundUser);
  }
}
await getLatestUser();
async function getLatestUser() {
  if (user.value) {
    let updatedInfo = await $fetch(`/api/players/${user.value.code}`);
    if (updatedInfo && updatedInfo !== null) {
      user.value = updatedInfo;
      setItem("user", updatedInfo);
    } else {
      user.value = null;
      removeItem("user");
    }
  }
  setTimeout(async () => {
    await getLatestUser();
  }, 5000);
}

async function onSubmit(event) {
  if (event.data && event.data.name && creatingUser.value == false) {
    creatingUser.value = true;
    let createdUser = await $fetch("/api/players", {
      method: "POST",
      body: event.data,
    });
    user.value = createdUser;
    setItem("user", createdUser);
    creatingUser.value = false;
  }
}

const items = [
  {
    label: "Player",
    key: "account",
  },
  {
    label: "Holes",
    key: "holes",
  },
  {
    label: "Leaderboard",
    key: "leaderboard",
  },
];

let leaderboards = ref([]);
let leaderboardColumns = [
  {
    key: "order",
    label: "#",
  },
  {
    key: "name",
    label: "Player",
  },
  {
    key: "holes_played",
    label: "Holes Played",
  },
  {
    key: "score",
    label: "Score",
  },
];
async function getLeaderboard() {
  let latest = await $fetch("/api/players");
  leaderboards.value = latest;
  setTimeout(async () => {
    await getLeaderboard();
  }, 5000);
}
await getLeaderboard();

function deepEqual(obj1, obj2) {
  if (obj1 === obj2) {
    return true;
  }

  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 == null ||
    obj2 == null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

async function updateUser() {
  let updatedUser = await $fetch("/api/players", {
    method: "PUT",
    body: user.value,
  });
  user.value = updatedUser;
  setItem("user", updatedUser);
}

async function wipeUsers() {
  let deleteUsers = await $fetch("/api/players", {
    method: "DELETE",
  });

  user.value = null;
  removeItem("user");
}
</script>
