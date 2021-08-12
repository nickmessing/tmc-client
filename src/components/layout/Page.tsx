import { typedProp } from '@/types/props'
import { defineComponent } from 'vue'

export const PageLayout = defineComponent({
  name: 'PageLayout',
  props: {
    title: {
      type: String,
      required: true,
    },
    button: {
      type: typedProp<() => JSX.Element | null>(Function),
    },
  },
  setup(props, ctx) {
    return () => (
      <div class="p-10">
        <div class="h-10 flex flex-row">
          <h2 class="text-3xl leading-10">{props.title}</h2>
          <div class="flex-grow" />
          <div>{props.button?.()}</div>
        </div>
        <div class="mt-8">{ctx.slots.default?.()}</div>
      </div>
    )
  },
})
