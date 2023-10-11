<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold text-center mb-6">About Us</h1>

    <!-- Meet the Team Section -->
    <section class="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h2 class="text-2xl font-semibold mb-4">Meet the Team</h2>

      <!-- Zaid BAARAB - Founder & Developer -->
      <div class="flex items-center space-x-4">
        <img
          src="/assets/img/zaid.jpeg"
          alt="Zaid BAARAB"
          class="w-16 h-16 rounded-full"
        />
        <div>
          <h3 class="text-lg font-semibold">Zaid BAARAB</h3>
          <p class="text-gray-600">Founder & Developer</p>
          <p class="text-gray-800">
            Zaid is a software engineering student with a passion for Web
            Developpment using a varity of modern technologies for better user
            experience . He founded our music streaming platform with the aim of
            providing music enthusiasts with an immersive listening experience.
            responsible for bringing your favorite tunes to your fingertips.
          </p>
        </div>
      </div>
    </section>

    <!-- Our Mission Section -->
    <section class="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h2 class="text-2xl font-semibold mb-4">Our Mission</h2>
      <p class="text-gray-800">
        At Your Music Streaming Web App Name, we are committed to delivering the
        best music streaming experience to our users. Our mission is to provide
        an extensive library of music, a user-friendly interface, and innovative
        features that enhance your musical journey. We believe that music has
        the power to connect people, inspire creativity, and uplift spirits, and
        we're dedicated to making that a reality for our users.
      </p>
    </section>

    <!-- Contact Us Section -->
    <section class="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h2 class="text-2xl font-semibold mb-4">Contact Us</h2>
      <ul class="list-disc list-inside text-gray-800">
        <li>
          Email:
          <a href="mailto:baarabzaid42@gmail.com"
            >contact@yourmusicstreamingapp.com</a
          >
        </li>
        <li>Phone: +212-658572007</li>
      </ul>
    </section>

    <!-- Join Our Team Section -->
    <section class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-semibold mb-4">Join Our Team</h2>
      <p class="text-gray-800">
        Are you passionate about developping our Music streaming website? We're
        always looking for new ideas, talented individuals to contribute to the
        future of music streaming. If you're interested, please send your an
        email to the Founder including your observations
        <a href="mailto:baarabzaid42@gmail.com">baarabzaid42@gmail.com</a>.
      </p>
    </section>
  </div>
</template>
<script>
export default {
  name: "About_page",
};
</script>
