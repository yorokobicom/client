<template>
  <div class="m-auto p-8 h-full">
    <div class="flex flex-col items-center">
      <h1 class="text-3xl font-bold mb-8 text-gray-900">Workspaces</h1>
      <base-spinner v-if="workspace.isLoading" />
      <template v-else-if="!workspace.workspaces">
        <p>You have no workspaces.</p>
        <p>Begin creating your first one below.</p>
      </template>
      <template v-else>
        <div class="rounded shadow-md">
          <WorkspaceItem
            v-for="workspace in workspace.workspaces"
            :key="workspace.id"
            :workspace="workspace"
          ></WorkspaceItem>
        </div>
      </template>
      <router-link
        :to="{ name: 'new_workspace' }"
        class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-64 mt-8 text-center"
        >New Workspace</router-link
      >
    </div>
  </div>
</template>

<script>
import FlexCenter from '@/mixins/FlexCenter.js'
import WorkspaceItem from '@/components/WorkspaceItem'
import { mapState } from 'vuex'

export default {
  components: { WorkspaceItem },
  mixins: [FlexCenter],
  metaInfo: {
    title: 'Your Workspaces'
  },
  mounted() {
    if (!this.workspace.workspaces.length) {
      this.$store.dispatch('fetchWorkspaces').catch(error => {
        if (error.response.status === 404) {
          this.$router.push('/')
          this.$store.dispatch('logout')
        }
        return Promise.reject(error)
      })
    }
  },
  computed: mapState(['workspace'])
}
</script>
