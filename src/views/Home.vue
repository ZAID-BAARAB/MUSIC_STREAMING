<template>
  <main>
    <!-- Introduction -->
    <section class="mb-3 py-15 text-white text-center">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"
      ></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h4 class="gotham uppercase font-bold text-5xl mb-3">
            {{ $t("home.listen") }}
          </h4>
          <p class="gotham w-full md:w-8/12 mx-auto">
            {{ $t("home.description") }}
          </p>
          <!-- <p class="w-full md:w-8/12 mx-auto">
            this is music stream applications where you can enjoy listening and posting your own songs
          </p> -->
        </div>
      </div>

      <img
        class="block mx-auto mb-2 w-auto max-w-full"
        src="/assets/img/introduction-music.png"
      />
      <div>
        <form class="mx-11">
          <label
            for="default-search"
            class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >Search</label
          >
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
            >
              <svg
                class="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              @input="performSearch"
              type="search"
              id="default-search"
              class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-40%"
              placeholder="Search for a song..."
              required
            />
            <button
              type="submit"
              disabled
              class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- Main Content -->
    <section v-if="searchQuery == ''" class="container mx-auto mt-1">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div
          class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
          v-icon-secondary="{ icon: 'headphones-alt', right: true }"
        >
          <span class="card-title">{{ $t("home.songs") }}</span>
          <!-- Icon -->
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <app-song-item v-for="song in songs" :key="song.docID" :song="song" />
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
    <!--=== search section ======= -->
    <section v-if="searchQuery !== ''" class="container mx-auto mt-1">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div
          class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
          v-icon-secondary="{ icon: 'headphones-alt', right: true }"
        >
          <span class="card-title">{{ $t("home.songs") }}</span>
          <!-- Icon -->
        </div>
        <!-- Playlist -->
        <ol id="playlist2">
          <app-song-item
            v-for="song in searchResults"
            :key="song.docID"
            :song="song"
          />
        </ol>
        <!-- ..end Playlist-->
      </div>
    </section>
  </main>
</template>

<script>
import { songsCollection, db } from "@/includes/firebase";
import AppSongItem from "@/components/SongItem.vue";
import IconSecondary from "@/directives/icon-secondary";
import { mapState } from "pinia";
import useUserStore from "@/stores/user";

export default {
  name: "Home",
  components: {
    AppSongItem,
  },
  directives: {
    "icon-secondary": IconSecondary,
  },
  data() {
    return {
      songs: [],
      maxPerPage: 25,
      pendingRequest: false,
      searchQuery: "",
      searchResults: [],
    };
  },
  async created() {
    this.getSongs();

    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;
      // Alternative (less strict)
      // const bottomOfWindow =
      //   Math.round(scrollTop) + innerHeight > offsetHeight - 100;
      const bottomOfWindow =
        Math.round(scrollTop) + innerHeight === offsetHeight;

      if (bottomOfWindow) {
        this.getSongs();
      }
    },
    async getSongs() {
      if (this.pendingRequest) {
        return;
      }

      this.pendingRequest = true;

      let snapshots;

      if (this.songs.length) {
        const lastDoc = await songsCollection
          .doc(this.songs[this.songs.length - 1].docID)
          .get();

        snapshots = await songsCollection
          .orderBy("modified_name")
          .startAfter(lastDoc)
          .limit(this.maxPerPage)
          .get();
      } else {
        snapshots = await songsCollection
          .orderBy("modified_name")
          .limit(this.maxPerPage)
          .get();
      }

      snapshots.forEach((document) => {
        this.songs.push({
          docID: document.id,
          ...document.data(),
        });
      });

      this.pendingRequest = false;
    },
    async performSearch() {
      if (!this.searchQuery) {
        this.searchResults = []; // Clear the results if the search query is empty
        return;
      }

      try {
        const snapshot = await db
          .collection("songs") // Use the correct collection name
          .where("modified_name", ">=", this.searchQuery) // Correct the field name
          .where("modified_name", "<=", this.searchQuery + "\uf8ff") // Correct the field name
          .get();

        this.searchResults = snapshot.docs.map((doc) => {
          return {
            docID: doc.id,
            ...doc.data(),
          };
        });
        console.log(this.searchResults);
      } catch (error) {
        console.error("Error performing search:", error);
      }
    },
  },
  computed: {
    ...mapState(useUserStore, ["userLoggedIn"]),
  },
};
</script>

<style scoped>
@font-face {
  font-family: "Archeologicaps";
  src: url("@/assets/font/Archeologicaps.ttf") format("opentype"); /* Use 'opentype' format for OTF fonts */
  font-weight: bold;
  font-style: normal;
}
.gotham {
  font-family: "Archeologicaps", sans-serif !important;
}
</style>
