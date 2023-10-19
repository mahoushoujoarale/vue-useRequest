<template>
  <div>useRequest Test Demo</div>
</template>

<script lang="ts" setup>
import { useRequest } from '@/index';

const request = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('success');
    }, 1000);
  });
};

const props = defineProps<{
  cancelOnDispose: boolean;
}>();
const emit = defineEmits(['onCancel']);

const onCancel = () => {
  emit('onCancel');
};
const { run } = useRequest(request, {
  cancelOnDispose: props.cancelOnDispose,
  onCancel: onCancel,
});

run();
</script>