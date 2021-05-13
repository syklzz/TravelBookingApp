import { ValidatorFn, FormGroup } from '@angular/forms';
  
export function datesValidator(start: string, end: string): ValidatorFn {
    return (form: FormGroup):{ [key: string]: boolean} | null => {
        const startValue = form.get(start).value;
        const endValue = form.get(end).value;

        const startDate = new Date(startValue);
        const endDate = new Date(endValue);

        if (startDate.getTime() >= endDate.getTime()){
            return {invalidDate: true};
        }

        return null;

    };
}