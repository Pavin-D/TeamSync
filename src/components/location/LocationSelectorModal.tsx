import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { TextInput } from '@/components/ui/Inputs';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { MapPin, Navigation, Check } from 'lucide-react';
import { geolocationService } from '@/services/api/geolocationService';

export interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (city: string, area: string) => void;
}

export const LocationSelectorModal: React.FC<LocationSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
}) => {
  const [searchCity, setSearchCity] = useState('');
  const [selectedCity, setSelectedCity] = useState('Chennai');
  const [selectedArea, setSelectedArea] = useState('Chennai, Tamil Nadu');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectError, setDetectError] = useState<string | null>(null);

  const popularCities = [
    { city: 'Chennai', area: 'Chennai, Tamil Nadu' },
    { city: 'Bengaluru', area: 'Bengaluru, Karnataka' },
    { city: 'Hyderabad', area: 'Hyderabad, Telangana' },
    { city: 'Mumbai', area: 'Mumbai, Maharashtra' },
    { city: 'Delhi / NCR', area: 'New Delhi' },
  ];

  const handleUseCurrentLocation = async () => {
    setIsDetecting(true);
    setDetectError(null);
    try {
      const pos = await geolocationService.getCurrentPosition();
      const city = pos.approximateCity || 'Chennai';
      onSelectLocation(city, `${city} (Detected Area)`);
      onClose();
    } catch (err: any) {
      setDetectError(err.message || 'Unable to detect location. Please select manually.');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSave = () => {
    onSelectLocation(selectedCity, selectedArea);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Your Approximate Location">
      <div className="space-y-4 text-left">
        <p className="text-xs text-slate-500">
          Select your city or locality to find nearby teammates and hackathon teams. Your exact home address is never stored or shown.
        </p>

        <Button
          size="sm"
          fullWidth
          variant="outline"
          isLoading={isDetecting}
          onClick={handleUseCurrentLocation}
          leftIcon={<Navigation className="w-4 h-4 text-brand-600" />}
        >
          Use Current Device Location
        </Button>

        {detectError && (
          <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
            {detectError}
          </p>
        )}

        <div className="border-t border-slate-100 pt-3 space-y-3">
          <label className="text-xs font-bold text-slate-900 block">Search City or Locality</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <TextInput
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Type city name (e.g., Chennai, Bengaluru)..."
              className="pl-9"
            />
          </div>

          <div className="space-y-1 pt-1">
            <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Popular Tech Hubs</span>
            {popularCities.map((item) => {
              const isSelected = selectedCity === item.city;
              return (
                <button
                  key={item.city}
                  type="button"
                  onClick={() => {
                    setSelectedCity(item.city);
                    setSelectedArea(item.area);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                    isSelected ? 'bg-brand-50 text-brand-700 border border-brand-200' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{item.area}</span>
                  {isSelected && <Check className="w-4 h-4 text-brand-600" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <SecondaryButton size="sm" onClick={onClose}>
            Cancel
          </SecondaryButton>
          <Button size="sm" onClick={handleSave}>
            Save Location
          </Button>
        </div>
      </div>
    </Modal>
  );
};
