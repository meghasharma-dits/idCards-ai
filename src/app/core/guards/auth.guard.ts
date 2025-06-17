import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageKeys } from '../enums/storage-keys.enum';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router)
  const token = sessionStorage.getItem(StorageKeys.token);

  if (token) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
