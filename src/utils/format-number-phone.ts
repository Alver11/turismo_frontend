export function phoneFormat(phone: string): string {
  if(phone != null && phone.trim().length > 0){
    let newNumber = phone.replace(/[^\d]/g, '');

    if (newNumber.startsWith('+')) {
      newNumber = newNumber.substring(1);
    }else{
      newNumber = newNumber.slice(-8);
    }
    return `5959${newNumber}`;
  }else{
    return ''
  }
}
