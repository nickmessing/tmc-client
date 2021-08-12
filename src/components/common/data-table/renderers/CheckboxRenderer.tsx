import { Checkbox } from '@/components/common/inputs/Checkbox'
import { defineComponent } from 'vue'

export const CheckboxRenderer = defineComponent({
  name: 'CheckboxRenderer',
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div class="h-full w-full flex items-center p-2">
        <Checkbox value={props.value} disabled />
      </div>
    )
  },
})
