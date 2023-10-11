<template>
  <div>
    <!-- Notification Icon with Badge -->
    <div @click="showNotifications">
      <i class="fas fa-bell"></i>
      <span
        v-if="unreadNotificationsCount > 0"
        class="badge font-bold text-red-500"
      >
        {{ unreadNotificationsCount }}</span
      >
    </div>
    <!-- Notification Dropdown (hidden by default) -->
    <div v-if="showDropdown" class="notification-dropdown">
      <div v-for="(notification, index) in notifications" :key="index">
        <div>
          <span class="font-bold">{{ notification.name }} </span>
          {{ $t("notifications.commented_on") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { commentsCollection, auth } from "@/includes/firebase";
export default {
  name: "Notifications",
  data() {
    return {
      showDropdown: false,
      notifications: [],
      unreadNotificationsCount: 0,
      Newcomments: [],
    };
  },
  methods: {
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
      this.showDropdown = !this.showDropdown;
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
  },

  async mounted() {
    commentsCollection
      .where("recieverId", "==", auth.currentUser.uid)
      .onSnapshot((querySnapshot) => {
        this.notifications = querySnapshot.docs.map((doc) => doc.data());
        this.unreadNotificationsCount = this.notifications.filter(
          (notification) => !notification.isRead
        ).length;
      });
  },
};
</script>
