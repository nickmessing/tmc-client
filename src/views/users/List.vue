<template>
  <div>
    <!-- <Loading v-if="users.loading && users.data.length === 0" /> -->
    <ul>
      <li></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { user } from '@/api/modules/users'
import { computed, defineComponent, ref } from 'vue'
// import Loading from '@/components/common/Loading.vue'

export default defineComponent({
  components: {
    // Loading,
  },
  setup() {
    const page = ref(1)
    const users = user.find(page)
    const totalPages = computed(() => 1 + Math.floor(users.value.total / 50))

    return {
      page,
      users,
      totalPages,
    }
  },
})
</script>
