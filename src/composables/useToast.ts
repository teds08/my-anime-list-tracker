import { useQuasar } from 'quasar';

export function useToast() {
  const $q = useQuasar();

  function success(message: string) {
    $q.notify({
      type: 'positive',
      message,
      position: 'top-right',
      timeout: 2500,
      progress: true,
      actions: [
        {
          icon: 'close',
          color: 'white',
        },
      ],
    });
  }

  function error(message: string) {
    $q.notify({
      type: 'negative',
      message,
      position: 'top-right',
      timeout: 3500,
      progress: true,
      actions: [
        {
          icon: 'close',
          color: 'white',
        },
      ],
    });
  }

  function info(message: string) {
    $q.notify({
      type: 'info',
      message,
      position: 'top-right',
      timeout: 2500,
      progress: true,
      actions: [
        {
          icon: 'close',
          color: 'white',
        },
      ],
    });
  }

  function warning(message: string) {
    $q.notify({
      type: 'warning',
      message,
      position: 'top-right',
      timeout: 3000,
      progress: true,
      actions: [
        {
          icon: 'close',
          color: 'white',
        },
      ],
    });
  }

  return {
    success,
    error,
    info,
    warning,
  };
}
