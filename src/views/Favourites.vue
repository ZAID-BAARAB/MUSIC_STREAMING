<template>
  <div>
    <h1>Favorites</h1>

    <section class="container mx-auto">
      <div
        class="bg-white rounded border border-gray-200  flex flex-col"
      >
        <div
          class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
          v-icon-secondary="{ icon: 'headphones-alt', right: true }"
        >
          <span class="card-title">{{ $t("home.songs") }}</span>
        </div>
        <table class="mx-4 my-4 p-3 w-full">
          <thead>
            <tr>
              <th scope="col">Published By</th>
              <th scope="col">Loved Songs</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="mb-5"
              v-for="(favorite, index) in favorites"
              :key="index"
            >
              <td class="px-5 py-2">{{ favorite.display_name }}</td>
              <td
                class="px-5 py-2 mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
              >
                {{ favorite.songName }}
              </td>
              <td class="px-5 py-2">
                <button @click="togglePlay(favorite)">
                  <li :class="playIcon(favorite)"></li>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { favouriteCollection, songsCollection } from "@/includes/firebase";
import { Howl } from "howler";
import { auth } from "@/includes/firebase";

export default {
  name: "Favourites_comp",

  setup() {
    const favorites = ref([]);
    let currentlyPlaying = null; // To keep track of the currently playing song

    onMounted(async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error("User not authenticated.");
          return;
        }

        const querySnapshot = await favouriteCollection
          .where("userId", "==", user.uid)
          .get();

        querySnapshot.forEach((doc) => {
          favorites.value.push({
            userId: doc.data().userId,
            songName: doc.data().songName,
            display_name: doc.data().display_name,
            sound: null,
            isPlaying: false,
            playbackPosition: 0,
          });
        });
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    });

    const togglePlay = async (favorite) => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error("User not authenticated.");
          return;
        }

        // If there's a currently playing song, pause it
        if (currentlyPlaying && currentlyPlaying !== favorite) {
          currentlyPlaying.sound.pause();
          currentlyPlaying.isPlaying = false;
        }

        if (favorite.sound) {
          favorite.sound.pause();
          favorite.playbackPosition = favorite.sound.seek();
        }

        const songQuery = await songsCollection
          .where("modified_name", "==", favorite.songName)
          .get();

        if (!songQuery.empty) {
          const songDoc = songQuery.docs[0];
          const songData = songDoc.data();

          favorite.sound = new Howl({
            src: [songData.url],
            html5: true,
            onend: () => {
              favorite.isPlaying = false;
            },
          });

          favorite.sound.seek(favorite.playbackPosition);

          favorite.isPlaying = !favorite.isPlaying;

          if (favorite.isPlaying) {
            favorite.sound.play();
            currentlyPlaying = favorite;
          } else {
            favorite.sound.pause();
            currentlyPlaying = null;
          }
        } else {
          console.error("Song not found in songsCollection");
        }
      } catch (error) {
        console.error("Error playing song:", error);
      }
    };

    const playIcon = (favorite) => {
      if (favorite.isPlaying) {
        return "fas fa-pause";
      } else {
        return "fas fa-play";
      }
    };

    return {
      favorites,
      togglePlay,
      playIcon,
    };
  },
};
</script>
