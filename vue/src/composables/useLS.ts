import { ref, watch } from 'vue';

export function useLS<T>(key: string, defaultValue: T) {
  const data = ref<T>(defaultValue);

  // 初始化读取
  try {
    const stored = localStorage.getItem(key);
    if (stored !== null) {
      data.value = JSON.parse(stored);
    }
  } catch (e) {
    console.error(`读取 localStorage 键 "${key}" 失败:`, e);
  }

  // 深度监听变化
  watch(
    data,
    (newVal) => {
      localStorage.setItem(key, JSON.stringify(newVal));
    },
    { deep: true }
  );

  return data;
}