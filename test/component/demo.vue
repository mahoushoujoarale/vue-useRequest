<template>
  <div>useRequest Test Demo</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue-demi';
import useRequest from '@/useRequest';

const props = defineProps<{
  cancelOnDispose: boolean;
}>();
const emit = defineEmits(['onCancel']);

const request = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('success');
    }, 1000);
  });
};
const onCancel = () => {
  emit('onCancel');
};

const { run } = useRequest(request, {
  cancelOnDispose: props.cancelOnDispose,
  onCancel,
});

onMounted(run);
</script>