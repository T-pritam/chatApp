export default function formatDateString(dateString: string): string {
    const inputDate = new Date(dateString);
    const now = new Date();
    
    // Check if the date is today
    const isToday = inputDate.getDate() === now.getDate() && 
                    inputDate.getMonth() === now.getMonth() && 
                    inputDate.getFullYear() === now.getFullYear();
    
    if (isToday) {
        // Return only the time in HH:MM 24-hour format
        return inputDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    // Calculate the difference in days
    const diffTime = now.getTime() - inputDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) {
        // If it's between today and the last 7 days, return the day
        return inputDate.toLocaleDateString('en-US', { weekday: 'long' });
    }

    // Otherwise, return full date with month and year
    return inputDate.toLocaleDateString();
}