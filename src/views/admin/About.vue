<template>
  <div class="about">
    <h1>This is an about page</h1>
    {{info}}
  </div>
</template>


<script>

import request from "@/utils/request";
export default {
  name: 'About',
  components: {
  },
  data(){
    return {
      info:""
    }
  },
  created() {

  }
}
</script>