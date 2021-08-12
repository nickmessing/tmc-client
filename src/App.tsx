import { defineComponent, onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import { Navigation } from './components/layout/Navigation'
import '@/auth'
import { useAuth } from '@/auth'

export default defineComponent({
  setup() {
    const auth = useAuth()

    const joke = ref<string>('')

    const getJoke = async () => {
      const res = await fetch('https://icanhazdadjoke.com/', {
        headers: {
          Accept: 'text/plain',
        },
      })
      const data = await res.text()
      joke.value = data
    }
    onMounted(getJoke)

    return () =>
      auth.authenticated.value ? (
        <div class="h-full w-full flex flex-row">
          <div class="h-full w-48">
            <Navigation />
          </div>
          <div class="h-full flex-grow overflow-auto">
            <RouterView />
          </div>
        </div>
      ) : (
        <div class="h-full w-fulll">
          <div class="absolute top-1/2 left-1/2 text-4xl transform -translate-x-1/2 -translate-y-1/2 text-center">
            <h3 class="text-4xl">Waiting for google authentication</h3>
            <h5 class="text-xl mt-4">{joke.value}</h5>
          </div>
        </div>
      )
  },
})
