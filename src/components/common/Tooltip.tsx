import { typedProp } from '@/types/props'
import { computed, defineComponent } from 'vue'

export const Tooltip = defineComponent({
  name: 'Tooltip',
  props: {
    content: {
      type: typedProp<string | (() => JSX.Element)>([String, Function]),
      required: true,
    },
  },
  setup(props, ctx) {
    const data = computed(() => (typeof props.content === 'string' ? props.content : props.content()))
    return () => (
      <div class="relative">
        <div class="tooltip">{data.value}</div>
        {ctx.slots.default?.()}
      </div>
    )
  },
})
