<template>
  <div class="mb-8">
    <header class="bg-gray-700 z-1000">
      <nav class="flex justify-between items-center mx-auto w-screen z-1000">
        <div>
          <router-link
            class="text-orange flex items-center text-black font-bold uppercase text-2xl mr-3"
            :to="{ name: 'home' }"
            exact-active-class="no-active"
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              class="h-8 mr-3"
              alt="Flowbite Logo"
            />
            Music
          </router-link>
        </div>
        <div
          ref="navLinks"
          class="nav-links duration-500 lg:static absolute bg-gray-700 lg:min-h-fit min-h-[0vh] left-0 top-[-100%] lg:w-auto w-full flex items-center z-1000"
        >
          <ul
            class="px-3 flex lg:flex-row flex-col lg:items-center lg:gap-[4vw] gap-8 mt-0 lg:w-full"
          >
            <li>
              <a
                href="#"
                @click="onToggleMenu"
                class="text-3xl cursor-pointer lg:hidden hover:text-gray-500"
              >
                <span v-if="menuIconClass === 'close'">
                  <i class="fas fa-times z-10" style="color: white"></i>
                  <!-- Font Awesome menu icon -->
                </span>
              </a>
            </li>
            <li>
              <router-link
                class="text-white font-regular whitespace-nowrap"
                :to="{ name: 'about' }"
                >{{ $t("header.about") }}
              </router-link>
            </li>
            <li v-if="!userStore.userLoggedIn">
              <a
                class="text-white font-regular"
                href="#"
                @click.prevent="toggleAuthModal"
                >{{ $t("header.login") }}</a
              >
            </li>
            <li v-if="userLoggedIn" @click="onToggleMenu">
              <router-link
                class="text-white font-regular"
                :to="{ name: 'favourites' }"
                >FAVOURITES</router-link
              >
            </li>
            <li class="font-regular" v-if="!userStore.userLoggedIn">
              <a
                class="text-white font-regular"
                href="#"
                @click.prevent="toggleAuthModal"
                >{{ $t("header.register") }}</a
              >
            </li>
            <li v-if="userStore.userLoggedIn">
              <router-link
                class="text-white font-regular"
                :to="{ name: 'manage' }"
              >
                {{ $t("header.manage") }}</router-link
              >
            </li>
            <li v-if="userStore.userLoggedIn">
              <a
                class="text-white font-regular whitespace-nowrap"
                href="#"
                @click.prevent="signOut"
                >{{ $t("header.logout") }}</a
              >
            </li>
            <li v-if="userLoggedIn">
              <div
                class="pr-8 pl-1 text-white cursor-pointer whitespace-nowrap"
                data-modal-target="defaultModal"
                data-modal-toggle="defaultModal"
                @click="showNotificationsAndLikes"
              >
                <span class="font-normal font-regular mr-1"
                  >{{ $t("header.notifications") }}
                </span>
                <i class="fas fa-bell"></i>
                <span
                  v-if="unreadNotificationsCount > 0"
                  class="bg-red-500 text-white rounded-full px-2"
                >
                  {{ unreadNotificationsCount }}</span
                >
              </div>
            </li>
          </ul>
        </div>
        <div class="flex items-center gap-6">
          <!-- <button
          class="bg-[#a6c1ee] text-white px-5 py-2 rounded-full hover:bg-[#87acec]"
        >
          Sign in
        </button> -->
          <a
            class="px-2 ml-8 text-white"
            href="#"
            @click.prevent="changeLocale"
          >
            {{ currentLocale }}
          </a>
          <router-link :to="{ name: 'profile' }" class="px-1 py-1 w-12">
            <img
              id="showImage"
              class="max-w-xs w-12 items-center border rounded-full"
              :src="formData.profilePhotoUrl || 'assets/img/profile.png'"
              alt=""
          /></router-link>
          <ul>
            <li>
              <a
                href="#"
                @click="onToggleMenu"
                class="text-3xl cursor-pointer lg:hidden hover:text-gray-500"
              >
                <span v-if="menuIconClass === 'menu'">
                  <i class="fas fa-bars" style="color: white"></i>
                  <!-- Font Awesome menu icon -->
                </span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  </div>
  <div
    id="defaultModal"
    v-if="showModalFlag"
    tabindex="-1"
    aria-hidden="true"
    class="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full p-4 overflow-x-hidden overflow-y-auto bg-black bg-opacity-50"
    style="z-index: 9999"
  >
    <div class="relative w-full max-w-2xl max-h-full">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <!-- Modal header -->
        <div
          class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600"
        >
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ $t("notifications.your_notifi") }}
          </h3>
          <button
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="defaultModal"
            @click="closeModal"
          >
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-6 space-y-6">
          <div
            class="bg-white rounded-lg p-4 w-full max-w-md shadow-md"
            @click.stop
          >
            <!-- Notification content -->
            <div
              class="notification"
              v-for="(notification, index) in notifications.reverse()"
              :key="index"
            >
              <router-link
                :to="'/song/' + notification.sid"
                @click="closeModal"
              >
                <div class="m-3">
                  <span class="font-bold">{{ notification.name }} </span>
                  <p>commented on your song.</p>
                </div>
              </router-link>
            </div>
            <div
              class="notification"
              v-for="(likenotification, index) in likesnotifications.reverse()"
              :key="index"
            >
              <router-link
                :to="'/song/' + likenotification.sid"
                @click="closeModal"
              >
                <div class="m-3">
                  <span class="font-bold"
                    >{{ likenotification.likerName }}
                  </span>
                  <p>liked your song.</p>
                </div>
              </router-link>
            </div>
          </div>
        </div>
        <!-- Modal footer -->
        <div
          class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600"
        >
          <!-- <button
            data-modal-hide="defaultModal"
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            I accept
          </button>
          <button
            data-modal-hide="defaultModal"
            type="button"
            class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
          >
            Decline
          </button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import useModalStore from "@/stores/modal";
import useUserStore from "@/stores/user";
import {
  commentsCollection,
  auth,
  likesCollection,
  usersCollection,
} from "@/includes/firebase";
import { mapState } from "pinia";
export default {
  name: "navbar",
  data() {
    return {
      formData: {
        name: null,
        profilePhotoUrl: null,
      },
      menuIconClass: "menu",
      navLinks: null,
      showDropdown: false,
      notifications: [],
      unreadNotificationsCount: 0,
      Newcomments: [],
      showModalFlag: false,
      likesnotifications: [],
    };
  },

  methods: {
    onToggleMenu() {
      this.menuIconClass = this.menuIconClass === "menu" ? "close" : "menu";
      this.navLinks.classList.toggle("top-[9%]");
    },
    toggleAuthModal() {
      this.modalStore.isOpen = !this.modalStore.isOpen;
      console.log(this.modalStore.isOpen);
    },
    signOut() {
      this.userStore.signOut();

      if (this.$route.meta.requiresAuth) {
        this.$router.push({ name: "home" });
      }
    },
    changeLocale() {
      this.$i18n.locale = this.$i18n.locale === "en" ? "fr" : "en";
    },
    async updateComments(commentIds) {
      for (const commentId of commentIds) {
        try {
          // Query for the document with the specified commentId
          const querySnapshot = await commentsCollection
            .where("commentId", "==", commentId)
            .get();

          // Check if a document with the specified commentId exists
          if (!querySnapshot.empty) {
            // Get the reference to the document
            const commentRef = querySnapshot.docs[0].ref;

            // Update the isRead field for the document
            await commentRef.update({ isRead: true });
            console.log(`Comment with commentId ${commentId} marked as read.`);
          } else {
            console.error(`Document with commentId ${commentId} not found.`);
          }
        } catch (error) {
          console.error(
            `Error marking comment with commentId ${commentId} as read:`,
            error
          );
        }
      }
    },
    showNotifications() {
      // this.showDropdown = !this.showDropdown;
      this.showModalFlag = !this.showModalFlag;
      commentsCollection
        .where("recieverId", "==", auth.currentUser.uid)
        .onSnapshot((querySnapshot) => {
          this.Newcomments = querySnapshot.docs.map((doc) => doc.data());
          const commentIds = this.Newcomments.map(
            (notification) => notification.commentId
          );
          this.updateComments(commentIds);
        });
    },
    async updateIsRead() {
      // Update the isRead field to true for the current like document
      likesCollection
        .where("recieverID", "==", auth.currentUser.uid)
        .where("isRead", "==", false)
        .onSnapshot((likesQuerySnapshot) => {
          likesQuerySnapshot.forEach((likeDoc) => {
            likeDoc.ref.update({ isRead: true });
          });
        });
    },
    showNotificationsAndLikes() {
      this.showNotifications();
      this.updateIsRead();
    },
    showModal() {
      this.showModalFlag = true;
    },
    closeModal() {
      this.showModalFlag = false;
      this.unreadNotificationsCount = 0;
    },
  },
  computed: {
    ...mapStores(useModalStore, useUserStore),
    currentLocale() {
      return this.$i18n.locale === "en" ? "French" : "English";
    },
    ...mapState(useUserStore, ["userLoggedIn"]),
  },

  async created() {
    commentsCollection
      .where("recieverId", "==", auth.currentUser.uid)
      .onSnapshot((querySnapshot) => {
        this.notifications = querySnapshot.docs.map((doc) => doc.data());
        this.unreadNotificationsCount = this.notifications.filter(
          (notification) => !notification.isRead
        ).length;
      });

    //likes notifications
    likesCollection
      .where("recieverID", "==", auth.currentUser.uid)
      .where("isRead", "==", false)
      .onSnapshot((likesQuerySnapshot) => {
        likesQuerySnapshot.forEach((likeDoc) => {
          const likeData = likeDoc.data();
          // Increment unreadNotificationsCount for each matching document
          this.unreadNotificationsCount++;
          console.log(
            "unreadNotificationsCount=" + this.unreadNotificationsCount
          );
          this.likesnotifications.push(likeData);
          this.updateIsRead(likeDoc);
        });
      });
  },
  async mounted() {
    // Ensure the user is authenticated
    const user = auth.currentUser;

    if (user) {
      // Fetch the user data from Firestore using the current user's ID
      try {
        const userDoc = await usersCollection.doc(user.uid).get();

        if (userDoc.exists) {
          // Populate the form data with the user's current information
          const userData = userDoc.data();
          this.formData = {
            name: userData.name,
            profilePhotoUrl: userData.profilePhotoUrl,
          };
        } else {
          console.error("User document does not exist.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      console.error("User is not authenticated.");
    }
    this.navLinks = this.$refs.navLinks;
  },
};
</script>

<style scoped>
.notification:hover {
  background-color: #d9dddc;
  text-decoration-color: black !important;
  cursor: pointer;
}
.font-regular {
  font-family: regular;
  color: #f3e2ba !important;
}
.text-orange {
  color: #f59e0b !important;
  fill: #f59e0b !important;
}
.font-regular:hover {
  color: #f59e0b !important;
}
</style>
