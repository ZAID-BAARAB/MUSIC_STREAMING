<template>
  <li
    class="flex flex-row items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50 example snapshot"
    :class="`song-id-${song.docID}`"
  >
    <div>
      <router-link
        :to="{ name: 'song', params: { id: song.docID } }"
        class="font-bold block text-gray-600 composition-name"
      >
        <img
          src="/assets/img/music.jpeg"
          alt="music icon"
          class="w-12 h-12 object-cover"
        />
      </router-link>
    </div>
    <div class="flex-grow ml-4">
      <router-link
        :to="{ name: 'song', params: { id: song.docID } }"
        class="font-bold block text-gray-600 composition-name"
      >
        {{ song.modified_name }}
      </router-link>
      <span class="text-gray-500 text-sm">
        {{ song.display_name }}
      </span>
    </div>

    <div class="flex justify-between items-center space-x-4">
      <button
        v-if="userLoggedIn"
        @click="addToLikedSongs"
        :disabled="isLiking"
        class="mr-2"
      >
        <i :class="likeClass" aria-hidden="true"></i>
        {{ number_of_likes }}
      </button>
      <button v-if="userLoggedIn" @click="addToLovedSongs" class="mr-2">
        <i :class="heartClass"></i>
      </button>
      <router-link
        custom
        :to="{ name: 'song', params: { id: song.docID }, hash: '#comments' }"
        v-slot="{ navigate }"
      >
        <span class="comments" @click="navigate">
          <i class="fa fa-comments text-gray-600"></i>
          {{ song.comment_count }}
        </span>
      </router-link>
    </div>
  </li>
</template>

<script>
//import { ref } from "vue";
import { auth } from "@/includes/firebase";
import { favouriteCollection } from "@/includes/firebase";
import { likesCollection } from "@/includes/firebase";
import { songsCollection } from "@/includes/firebase";
import firebase from "firebase/app";
import useUserStore from "@/stores/user";
import { mapState } from "pinia";
export default {
  name: "SongItem",
  props: ["song"],

  data() {
    return {
      LovedSong: null,
      isLoved: false,
      heartClass: "far fa-heart",
      authur: null,
      likedSongName: null,
      isLiked: false,
      likeClass: "fas fa-thumbs-up",
      number_of_likes: 0,
      isLiking: false,
    };
  },

  methods: {
    async addToLovedSongs() {
      // Check if a user is logged in
      const user = auth.currentUser;
      if (!user) {
        console.error("User not authenticated.");
        return;
      }

      // Add the name of the song to the LovedSong data property
      this.LovedSong = this.song.modified_name;
      this.authur = this.song.display_name;
      // Check if the song is not loved (i.e., if it's not in favourites)
      if (!this.isLoved) {
        // Define the data to be added to the "favourites" collection
        const songData = {
          songName: this.LovedSong,
          userId: user.uid, // Include the user's ID
          display_name: this.authur,
        };

        try {
          // Add the song data to the "favourites" collection
          await favouriteCollection.add(songData);
          console.log(this.LovedSong + " song is added to favourites");
        } catch (error) {
          console.error("Error adding song to favourites:", error);
        }
      } else {
        // Add the 'else' block for removing the song from favourites
        try {
          const querySnapshot = await favouriteCollection
            .where("songName", "==", this.LovedSong)
            .where("userId", "==", user.uid)
            .get();

          querySnapshot.forEach(async (doc) => {
            // Delete the matching song document from favourites
            await doc.ref.delete();
            console.log(this.LovedSong + " song is removed from favourites");
          });
        } catch (error) {
          console.error("Error removing song from favourites:", error);
        }
      }

      // Toggle the isLoved property
      this.isLoved = !this.isLoved;
      this.heartClass = this.isLoved
        ? "fas fa-heart text-red-500"
        : "far fa-heart";
    },

    async checkIfLoved() {
      const user = auth.currentUser;
      if (!user) {
        console.error("User not authenticated.");
        return;
      }

      this.LovedSong = this.song.modified_name;

      try {
        const querySnapshot = await favouriteCollection
          .where("songName", "==", this.LovedSong)
          .where("userId", "==", user.uid)
          .get();

        if (!querySnapshot.empty) {
          // The song exists in the favorite collection, mark it as loved
          this.isLoved = true;
          this.heartClass = "fas fa-heart text-red-500";
        }
      } catch (error) {
        console.error("Error checking if song is loved:", error);
      }
      console.log(this.song.modified_name + "is already loved");
      console.log(this.heartClass);
    },
    async addToLikedSongs() {
      if (this.isLiking) return;
      this.isLiking = true;
      const user = auth.currentUser;
      if (!user) {
        console.error("User not authenticated.");
        return;
      }
      try {
        // Add the name of the song to the LovedSong data property
        this.likedSongName = this.song.modified_name;
        this.likerID = user.uid;
        this.likerName = user.displayName;
        this.recieverID = this.song.uid;
        this.likeIsRead = false;
        // Check if the song is not liked (i.e., if it's not in likes)
        if (!this.isLiked) {
          const likedData = {
            likedSongName: this.likedSongName,
            likerID: this.likerID,
            isRead: this.likeIsRead,
            recieverID: this.recieverID,
            likerName: this.likerName,
          };
          console.log(likedData);
          try {
            await likesCollection.add(likedData);
            console.log(this.likedSongName + " song is added to likees");
          } catch (error) {
            console.error("Error adding song to likes:", error);
          }
        } else {
          // Add the 'else' block for removing the song from favourites
          try {
            const querySnapshot = await likesCollection
              .where("likedSongName", "==", this.likedSongName)
              .where("likerID", "==", user.uid)
              .get();

            querySnapshot.forEach(async (doc) => {
              // Delete the matching song document from favourites
              await doc.ref.delete();
              console.log(this.likedSongName + " song is removed from liked");
            });
          } catch (error) {
            console.error("Error removing song from liked:", error);
          }
        }
        try {
          // Query for the document with the specified commentId
          const querySnapshot = await songsCollection
            .where("modified_name", "==", this.likedSongName)
            .get();

          // Check if a document with the specified commentId exists
          if (!querySnapshot.empty) {
            // Get the reference to the document
            const songRef = querySnapshot.docs[0].ref;

            // Update the isRead field for the document
            if (!this.isLiked) {
              await songRef.update({
                number_of_likes: firebase.firestore.FieldValue.increment(1),
              });
            } else {
              await songRef.update({
                number_of_likes: firebase.firestore.FieldValue.increment(-1),
              });
            }
            const songData = (await songRef.get()).data();
            this.number_of_likes = songData.number_of_likes;
            console.log(`Comment with commentId ${songRef} marked as read.`);
          } else {
            console.error(
              `Document with commentId ${this.likedSongName} not found.`
            );
          }
        } catch (error) {
          console.error(
            `Error marking song with name ${this.likedSongName} as liked:`,
            error
          );
        }

        // Toggle the isLoved property
        this.isLiked = !this.isLiked;
        this.likeClass = this.isLiked
          ? "fas fa-thumbs-up text-blue-500"
          : "far fa-thumbs-up";
        this.isLiking = false;
      } catch (error) {
        console.error("Error adding/removing song from liked:", error);
      } finally {
        this.isLiking = false; // Re-enable the like button
      }
    },
    async calculateLikesNumber() {
      const querySnapshot = await songsCollection
        .where("modified_name", "==", this.likedSongName)
        .get();
      const songRef = querySnapshot.docs[0].ref;
      const songData = (await songRef.get()).data();
      this.number_of_likes = songData.number_of_likes;
    },
    async checkIfLiked() {
      const user = auth.currentUser;
      if (!user) {
        console.error("User not authenticated.");
        return;
      }

      this.likedSongName = this.song.modified_name;

      try {
        const querySnapshot = await likesCollection
          .where("likedSongName", "==", this.likedSongName)
          .where("likerID", "==", user.uid)
          .get();

        if (!querySnapshot.empty) {
          // The song exists in the favorite collection, mark it as loved
          this.isLiked = true;
          this.likeClass = "fas fa-thumbs-up text-blue-500";
        }
      } catch (error) {
        console.error("Error checking if song is liked:", error);
      }
      console.log(this.song.modified_name + "is already liked");
      console.log(this.likeClass);
    },
  },
  computed: {
    ...mapState(useUserStore, ["userLoggedIn"]),
  },
  created() {
    // Call the checkIfLoved method when the component is mounted
    this.checkIfLoved();
    this.checkIfLiked();
    this.calculateLikesNumber();
  },
};
</script>
