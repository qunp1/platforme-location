export function stressCatalog(cars, mode) {
  if (mode === 'empty') return [];
  if (mode === 'one') return cars.slice(0, 1);
  if (mode === 'many')
    return Array.from({ length: 1000 }, (_, i) => ({
      ...cars[i % cars.length],
      id: i < cars.length ? cars[i].id : `stress-${i}`,
    }));
  if (mode !== 'worst') return cars;
  return cars.map((car, i) => ({
    ...car,
    name:
      i % 2
        ? 'Dacia Jogger Extreme sept places avec coffre de toit et boîte automatique'
        : 'Mercedes-BenzClasseVExtraLongueAvantgarde',
    agency:
      i % 2 ? 'نور الهدى لتأجير السيارات بالناظور' : 'LocationAutomobileNadorMarchicaInternational',
    daily: 1299900,
    deposit: 25000000,
    image: i % 3 === 0 ? null : car.image,
  }));
}
