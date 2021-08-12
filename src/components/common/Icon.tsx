import { computed, defineComponent } from 'vue'
import { typedProp } from '@/types/props'
import * as mdijs from '@mdi/js'

export type IconName = keyof typeof mdijs

export const Icon = defineComponent({
  name: 'Icon',
  props: {
    name: {
      type: typedProp<keyof typeof mdijs>(String),
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    width: {
      type: [Number, String],
      default: '',
    },
    height: {
      type: [Number, String],
      default: '',
    },
    size: {
      type: [Number, String],
      default: 24,
    },
    viewBox: {
      type: String,
      default: '0 0 24 24',
    },
    xmlns: {
      type: String,
      default: 'http://www.w3.org/2000/svg',
    },
    role: {
      type: String,
      default: 'img',
    },
    subClass: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const d = computed(() => mdijs[props.name])

    return () => (
      <span role={props.role} class="flex items-center icon">
        <svg
          class={props.subClass}
          fill="currentColor"
          width={props.width || props.size}
          height={props.height || props.size}
          viewBox={props.viewBox}
          xmlns={props.xmlns}
        >
          <path d={d.value} />
        </svg>
      </span>
    )
  },
})
