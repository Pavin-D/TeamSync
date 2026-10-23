export interface GeolocationPositionResult {
  latitude: number;
  longitude: number;
  approximateCity?: string;
  approximateArea?: string;
}

export const geolocationService = {
  isSupported: (): boolean => true,

  getCurrentPosition: (): Promise<GeolocationPositionResult> => {
    return new Promise((resolve) => {
      // Mocked location as requested by user for all accounts
      resolve({
        latitude: 11.274,
        longitude: 77.607,
        approximateCity: 'Perundurai, Erode',
        approximateArea: 'Kongu Engineering College, IT Park',
      });
    });
  },
};
