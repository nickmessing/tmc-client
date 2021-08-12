import { computed, defineComponent } from 'vue'
import { typedProp } from '@/types/props'
import { RouteLocationRaw, RouterLink } from 'vue-router'

export const Button = defineComponent({
  name: 'Button',
  props: {
    type: {
      type: typedProp<'button' | 'link' | 'router-link'>(String),
      default: 'button',
    },
    href: {
      type: String,
      default: '',
    },
    to: {
      type: typedProp<RouteLocationRaw>([String, Object]),
      default: '',
    },
    submit: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    style: {
      type: typedProp<'primary' | 'gray'>(String),
      default: 'primary',
    },
    onClick: {
      type: typedProp<(event: Event) => void>(Function),
    },
  },
  setup(props, ctx) {
    const content = computed(() => ctx.slots.default?.())

    const classes = computed(() => ({
      'text-white rounded-xl block h-10 text-sm leading-10 px-4': true,
      'bg-primary-main': props.style === 'primary',
      'hover:bg-primary-light active:bg-primary-dark': props.style === 'primary' && !props.disabled,
      'bg-gray-500': props.style === 'gray',
      'hover:bg-gray-300 active:bg-gray-700': props.style === 'gray' && !props.disabled,
      'opacity-50 cursor-default': props.disabled,
      'cursor-pointer': !props.disabled,
    }))

    const commonAttrs = computed(() => ({
      class: classes.value,
      onClick: props.onClick,
    }))

    return () =>
      props.type === 'button' ? (
        <button {...commonAttrs.value} type={props.submit ? 'submit' : 'button'}>
          {content.value}
        </button>
      ) : props.type === 'link' ? (
        <a href={props.href} {...commonAttrs.value}>
          {content.value}
        </a>
      ) : (
        <RouterLink to={props.to} {...commonAttrs.value}>
          {content.value}
        </RouterLink>
      )
  },
})
