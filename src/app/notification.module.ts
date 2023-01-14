import { NgModule } from '@angular/core';
import { NotifierOptions, NotifierModule } from 'angular-notifier';

const customNotifierOptions: NotifierOptions = {
    position: {
          horizontal: {
              position: 'right',
              distance: 120
          },
          vertical: {
              position: 'top',
              distance: 7,
              gap: 10
          }
      },
    theme: 'material',
    behaviour: {
      autoHide: 7000,
      onClick: 'hide',
      onMouseover: 'pauseAutoHide',
      showDismissButton: true,
      stacking: 4
    },
    animations: {
      enabled: true,
      show: {
        preset: 'slide',
        speed: 500,
        easing: 'ease'
      },
      hide: {
        preset: 'fade',
        speed: 500,
        easing: 'ease',
        offset: 50
      },
      shift: {
        speed: 500,
        easing: 'ease'
      },
      overlap: 150
    }
  };

@NgModule({
  imports: [NotifierModule.withConfig(customNotifierOptions)],
  exports: [NotifierModule]
})
export class NotificationModule {} 