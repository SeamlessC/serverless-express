export class DateService {
   
    public getDateString(date : any): string {
        const options: Intl.DateTimeFormatOptions = {
          timeZone: 'Asia/Colombo',
          year: 'numeric',
          month: 'short',
          day: '2-digit'
        };
        const formate = new Intl.DateTimeFormat([], options);
    
        const d = formate.format(date);
       
        return new Date(d).toISOString().split('T')[0]
      }
}