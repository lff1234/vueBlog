<template>
  <div>
    <ul>
      <li>ee</li>
    </ul>
  </div>
</template>

<script>
import { request } from '../utils/network/request';
export default {
  name: 'Tag',
  data() {
    return {
      shiyan: ''
    };
  },
  methods: {},
  created() {
    request({
      url: '/api/tag'
    })
      .then(res => console.log(res))
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style scoped></style>
