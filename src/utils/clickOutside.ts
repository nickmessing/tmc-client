import { onBeforeUnmount, onMounted, Ref } from 'vue'

const listeners: {
  el: Ref<HTMLElement | null>
  fn: () => void
}[] = []

const click = (element: HTMLElement) => listeners.map(({ el, fn }) => !el.value?.contains(element) && fn())

document.body.addEventListener('click', event => click(event.target as HTMLElement))

export const onClickOutside = (el: Ref<HTMLElement | null>, fn: () => void) => {
  const listener = { el, fn }
  onMounted(() => {
    listeners.push(listener)
  })
  onBeforeUnmount(() => {
    listeners.splice(listeners.indexOf(listener), 1)
  })
}
