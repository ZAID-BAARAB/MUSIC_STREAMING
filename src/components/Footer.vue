<template>
  <div class="bg-gray-700">
    <div class="container mx-auto py-6 px-4">
      <div class="text-center">
        <h5 class="textstyle text-lg font-semibold mb-2">Owner Contacts</h5>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="mt-4 text-center">
          <a
            href="+212658572007"
            class="text-gray-300 hover:text-white block mb-1"
          >
            <i class="fas fa-phone-square mr-2">
              <span class="ml-3">+212658572007</span>
            </i>
          </a>
        </div>

        <div class="mt-4 text-center">
          <a
            href="mailto:baarabzaid42@gmail.com"
            class="text-gray-300 hover:text-white block mb-1"
          >
            <i class="fas fa-at">
              <span class="ml-3"> baarabzaid42@gmail.com</span>
            </i>
          </a>
        </div>
        <div class="mt-4 text-center">
          <a
            href="https://www.linkedin.com/in/zaid-baarab-398256256?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
            class="text-gray-300 hover:text-white block mb-1"
            ><i class="fab fa-linkedin">
              <span class="ml-3"> Zaid BAARAB</span></i
            ></a
          >
        </div>
      </div>

      <div class="flex flex-col sm:flex-row justify-center items-center mt-6">
        <div class="mb-2 sm:mb-0">
          <div class="text-white">
            <span>&copy;</span>
            <span class="text-white-500 font-bold text-lg mx-1">C</span>
            <span class="text-white"> 2023</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Footer_comp",
};
</script>
<style>
.textstyle {
  color: #f3e2ba;
  font-family: Charlemagne Std;
}
</style>
