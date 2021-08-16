import { defineComponent } from 'vue'

export const TextRenderer = defineComponent({
  name: 'TextRenderer',
  props: {
    value: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
    },
  },
  setup(props) {
    return () => (
      <div class="h-full w-full p-2 leading-6">
        {props.value || <span class="opacity-40">{props.placeholder}</span>}
      </div>
    )
  },
})
