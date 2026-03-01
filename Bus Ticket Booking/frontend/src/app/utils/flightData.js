export const AIRLINES = [
    { code: '6E', name: 'IndiGo', logo: '6E' },
    { code: 'AI', name: 'Air India', logo: 'AI' },
    { code: 'SG', name: 'SpiceJet', logo: 'SG' },
    { code: 'UK', name: 'Vistara', logo: 'UK' },
    { code: 'G8', name: 'Go First', logo: 'G8' },
    { code: 'QP', name: 'Akasa Air', logo: 'QP' },
];

export const AIRPORTS = {
    MAA: { code: 'MAA', city: 'Chennai', name: 'Chennai International Airport' },
    DEL: { code: 'DEL', city: 'Delhi', name: 'Indira Gandhi International Airport' },
    BOM: { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj International Airport' },
    BLR: { code: 'BLR', city: 'Bangalore', name: 'Kempegowda International Airport' },
    HYD: { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi International Airport' },
    CCU: { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhas Chandra Bose International Airport' },
};

export const POPULAR_ROUTES = [
    { from: 'MAA', to: 'DEL' },
    { from: 'BOM', to: 'BLR' },
    { from: 'DEL', to: 'BOM' },
    { from: 'HYD', to: 'MAA' },
];

export function generateFlightNumber(airlineCode) {
    return `${airlineCode}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function calculateDuration(depTime, arrTime) {
    const [depH, depM] = depTime.split(':').map(Number);
    const [arrH, arrM] = arrTime.split(':').map(Number);
    let totalMin = (arrH * 60 + arrM) - (depH * 60 + depM);
    if (totalMin < 0) totalMin += 24 * 60;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${h}h ${m}m`;
}
