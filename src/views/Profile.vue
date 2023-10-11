<template>
  <div
    class="text-white text-center font-bold p-4 mb-4"
    v-if="login_show_alert"
    :class="login_alert_variant"
  >
    {{ login_alert_msg }}
  </div>
  <div class="text-center h-full" v-if="!userLoggedIn">
    <div class="w-full md:w-2/5 p-4 sm:p-6 lg:p-8 bg-white shadow-md">
      <span class="text-gray-600"
        >You have to Log In first to view your profile page</span
      >
    </div>
  </div>

  <div class="h-full" v-if="userLoggedIn">
    <div class="border-b-2 block md:flex">
      <div class="w-full md:w-2/5 p-4 sm:p-6 lg:p-8 bg-white shadow-md">
        <span class="text-gray-600">update your profile here</span>
        <div class="w-full p-8 mx-2 flex justify-center">
          <img
            id="showImage"
            class="max-w-xs w-32 items-center border"
            :src="formData.profilePhotoUrl || 'https://placehold.it/200x200'"
            alt=""
          />
        </div>

        <input type="file" id="photo" @change="handleFileUpload" />
      </div>

      <div class="w-full md:w-3/5 p-8 bg-white lg:ml-4 shadow-md">
        <div class="rounded shadow p-6">
          <form @submit.prevent="updateUser">
            <div class="pb-6">
              <label for="name" class="font-semibold text-gray-700 block pb-1"
                >Name</label
              >
              <div class="flex">
                <input
                  class="border-1 rounded-r px-4 py-2 w-full"
                  type="text"
                  id="name"
                  v-model="formData.name"
                  required
                />
              </div>
            </div>
            <div class="pb-4">
              <label for="email" class="font-semibold text-gray-700 block pb-1"
                >Email</label
              >
              <input
                id="email"
                class="border-1 rounded-r px-4 py-2 w-full"
                type="email"
                v-model="formData.email"
                required
              />
            </div>
            <div class="pb-4">
              <label for="age" class="font-semibold text-gray-700 block pb-1"
                >Age</label
              >
              <input
                id="age"
                class="border-1 rounded-r px-4 py-2 w-full"
                type="number"
                v-model="formData.age"
                required
              />
            </div>
            <div class="pb-4">
              <label
                for="country"
                class="font-semibold text-gray-700 block pb-1"
                >Country</label
              >
              <input
                id="country"
                class="border-1 rounded-r px-4 py-2 w-full"
                type="text"
                v-model="formData.country"
                required
              />
            </div>
            <div class="pb-4">
              <button
                class="-mt-2 text-md font-bold text-white bg-gray-700 rounded-full px-5 py-2 hover:bg-gray-800"
                type="submit"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, usersCollection, storage } from "@/includes/firebase";
import useUserStore from "@/stores/user";
import { mapState } from "pinia";
export default {
  data() {
    return {
      formData: {
        name: "",
        email: "",
        country: "",
        age: 0,
        profilePhotoUrl: null,
      },
      login_show_alert: false,
      login_in_submission: false,
      login_alert_variant: null,
      login_alert_msg: null,
    };
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
            email: userData.email,
            country: userData.country,
            age: userData.age,
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
  },
  methods: {
    async updateUser() {
      // Ensure the user is authenticated
      const user = auth.currentUser;

      if (user) {
        try {
          // Update the user's data in Firestore
          await usersCollection.doc(user.uid).update({
            name: this.formData.name,
            email: this.formData.email,
            country: this.formData.country,
            age: this.formData.age,
          });
          console.log("User information updated successfully.");
        } catch (error) {
          console.error("Error updating user information:", error);
        }
      } else {
        console.error("User is not authenticated.");
      }
      this.login_show_alert = true;
      this.login_in_submission = true;
      this.login_alert_variant = "bg-green-500";
      this.login_alert_msg = "Success !, your profile has been updated.";
    },
    async handleFileUpload(event) {
      const file = event.target.files[0];
      const userId = auth.currentUser.uid;

      if (file) {
        const storageRef = storage.ref();
        const fileRef = storageRef.child(
          `user_photos/${userId}/profile_photo.jpg`
        );

        try {
          await fileRef.put(file);
          console.log("File uploaded successfully.");

          // Update the user's profile photo URL in Firestore
          const downloadURL = await fileRef.getDownloadURL();
          await usersCollection.doc(userId).update({
            profilePhotoUrl: downloadURL,
          });
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    },
  },
  computed: {
    ...mapState(useUserStore, ["userLoggedIn"]),
  },
};
</script>
