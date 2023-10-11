<template>
  <div
    class="text-white text-center font-bold p-4 mb-4"
    v-if="login_show_alert"
    :class="login_alert_variant"
  >
    {{ login_alert_msg }}
  </div>
  <vee-form :validation-schema="loginSchema" @submit="login">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        name="email"
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field
        name="password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <ErrorMessage class="text-red-600" name="password" />
    </div>
    <div class="mb-3">
      <button
        type="button"
        @click="forgotPassword"
        class="text-purple-600 hover:underline cursor-pointer"
      >
        Forgot password?
      </button>
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="login_in_submission"
    >
      Submit
    </button>
  </vee-form>
  <div v-if="forgot" class="mb-3">
    <label class="inline-block mb-2">Email</label>
    <input
      v-model="email"
      name="Email"
      type="email"
      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      placeholder="Enter Email to reset password"
    />
    <button
      type="button"
      @click="resetPassword"
      class="text-purple-600 hover:underline cursor-pointer"
    >
      Reset
    </button>
  </div>
</template>

<script>
import { mapActions } from "pinia";
import useUserStore from "@/stores/user";
import { auth } from "@/includes/firebase";
export default {
  name: "LoginForm",
  data() {
    return {
      loginSchema: {
        email: "required|email",
        password: "required|min:9|max:100",
      },
      login_in_submission: false,
      login_show_alert: false,
      login_alert_variant: "bg-blue-500",
      login_alert_msg: "Please wait! We are logging you in.",
      email: "",
      forgot: false,
    };
  },
  methods: {
    ...mapActions(useUserStore, ["authenticate"]),
    async login(values) {
      this.login_show_alert = true;
      this.login_in_submission = true;
      this.login_alert_variant = "bg-blue-500";
      this.login_alert_msg = "Please wait! We are logging you in.";

      try {
        await this.authenticate(values);
      } catch (error) {
        this.login_in_submission = false;
        this.login_alert_variant = "bg-red-500";
        this.login_alert_msg = "Invalid login details.";
        return;
      }

      this.login_alert_variant = "bg-green-500";
      this.login_alert_msg = "Success! You are now logged in.";
      window.location.reload();
    },
    async resetPassword() {
      try {
        console.log(this.email);
        // Check if the email is valid
        if (!this.email) {
          this.login_show_alert = true;
          this.login_alert_variant = "bg-red-500";
          this.login_alert_msg = "Please enter your email address.";
          return;
        }

        // Send a password reset email to the user's email address
        await auth.sendPasswordResetEmail(this.email);
        this.login_show_alert = true;
        this.login_alert_variant = "bg-green-500";
        this.login_alert_msg = "Password reset email sent. Check your inbox.";

        // Optionally, you can clear the email input field after sending the reset email
        this.email = "";
      } catch (error) {
        console.error("Error sending password reset email:", error);
        this.login_alert_variant = "bg-red-500";
        this.login_alert_msg =
          "Failed to send password reset email. Please try again.";
      }
    },
    forgotPassword() {
      this.forgot = true;
    },
  },
};
</script>
