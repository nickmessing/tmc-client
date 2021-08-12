import { Checkbox } from '@/components/common/inputs/Checkbox'
import { typedProp } from '@/types/props'
import { defineComponent, onBeforeMount, onMounted, ref } from 'vue'

export const CheckboxEditor = defineComponent({
  name: 'CheckboxEditor',
  props: {
    initialValue: {
      type: Boolean,
      required: true,
    },
    onUpdate: {
      type: typedProp<(val: boolean) => void>(Function),
    },
    onCancel: {
      type: typedProp<() => void>(Function),
    },
  },
  setup(props) {
    const value = ref(false)
    const div = ref<HTMLDivElement | null>(null)

    const focus = () => (div.value?.querySelector('div.checkbox') as undefined | HTMLDivElement)?.focus()

    onBeforeMount(() => {
      value.value = props.initialValue
    })

    onMounted(focus)

    return () => (
      <div class="h-full w-full flex items-center p-2" ref={div} onClick={focus}>
        <Checkbox
          value={value.value}
          onInput={val => (value.value = val)}
          onSubmit={props.onUpdate}
          onCancel={props.onCancel}
        />
      </div>
    )
  },
})
