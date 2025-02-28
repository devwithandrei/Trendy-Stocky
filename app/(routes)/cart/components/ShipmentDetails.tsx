"use client";
import React, { FC, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import useCart from '@/hooks/use-cart';
import { ChevronDown, Check, Phone, MapPin, Search } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface ShipmentDetailsProps {
  onFormValid: (isValid: boolean, formData: any) => void;
}

// Country data with phone prefixes
const countries = [
  { label: "United States", value: "US", prefix: "+1" },
  { label: "United Kingdom", value: "GB", prefix: "+44" },
  { label: "Germany", value: "DE", prefix: "+49" },
  { label: "France", value: "FR", prefix: "+33" },
  { label: "Spain", value: "ES", prefix: "+34" },
  { label: "Italy", value: "IT", prefix: "+39" },
  { label: "Canada", value: "CA", prefix: "+1" },
  { label: "Australia", value: "AU", prefix: "+61" },
  { label: "Japan", value: "JP", prefix: "+81" },
  { label: "China", value: "CN", prefix: "+86" },
  { label: "India", value: "IN", prefix: "+91" },
  { label: "Brazil", value: "BR", prefix: "+55" },
  { label: "Mexico", value: "MX", prefix: "+52" },
  { label: "Netherlands", value: "NL", prefix: "+31" },
  { label: "Sweden", value: "SE", prefix: "+46" },
  { label: "Switzerland", value: "CH", prefix: "+41" },
  { label: "Belgium", value: "BE", prefix: "+32" },
  { label: "Austria", value: "AT", prefix: "+43" },
  { label: "Portugal", value: "PT", prefix: "+351" },
  { label: "Greece", value: "GR", prefix: "+30" },
  { label: "Denmark", value: "DK", prefix: "+45" },
  { label: "Finland", value: "FI", prefix: "+358" },
  { label: "Norway", value: "NO", prefix: "+47" },
  { label: "Ireland", value: "IE", prefix: "+353" },
  { label: "Poland", value: "PL", prefix: "+48" },
  { label: "Russia", value: "RU", prefix: "+7" },
  { label: "Turkey", value: "TR", prefix: "+90" },
  { label: "South Korea", value: "KR", prefix: "+82" },
  { label: "Singapore", value: "SG", prefix: "+65" },
  { label: "New Zealand", value: "NZ", prefix: "+64" },
];

// City data for each country
const citiesByCountry: Record<string, Array<{ label: string, value: string }>> = {
  "US": [
    { label: "New York", value: "New York" },
    { label: "Los Angeles", value: "Los Angeles" },
    { label: "Chicago", value: "Chicago" },
    { label: "Houston", value: "Houston" },
    { label: "Phoenix", value: "Phoenix" },
    { label: "Philadelphia", value: "Philadelphia" },
    { label: "San Antonio", value: "San Antonio" },
    { label: "San Diego", value: "San Diego" },
    { label: "Dallas", value: "Dallas" },
    { label: "San Jose", value: "San Jose" },
    { label: "Austin", value: "Austin" },
    { label: "Jacksonville", value: "Jacksonville" },
    { label: "Fort Worth", value: "Fort Worth" },
    { label: "Columbus", value: "Columbus" },
    { label: "Indianapolis", value: "Indianapolis" },
  ],
  "GB": [
    { label: "London", value: "London" },
    { label: "Birmingham", value: "Birmingham" },
    { label: "Manchester", value: "Manchester" },
    { label: "Glasgow", value: "Glasgow" },
    { label: "Liverpool", value: "Liverpool" },
    { label: "Bristol", value: "Bristol" },
    { label: "Edinburgh", value: "Edinburgh" },
    { label: "Leeds", value: "Leeds" },
    { label: "Sheffield", value: "Sheffield" },
    { label: "Newcastle", value: "Newcastle" },
    { label: "Nottingham", value: "Nottingham" },
    { label: "Cardiff", value: "Cardiff" },
    { label: "Belfast", value: "Belfast" },
    { label: "Leicester", value: "Leicester" },
    { label: "Coventry", value: "Coventry" },
  ],
  "DE": [
    { label: "Berlin", value: "Berlin" },
    { label: "Hamburg", value: "Hamburg" },
    { label: "Munich", value: "Munich" },
    { label: "Cologne", value: "Cologne" },
    { label: "Frankfurt", value: "Frankfurt" },
    { label: "Stuttgart", value: "Stuttgart" },
    { label: "Düsseldorf", value: "Düsseldorf" },
    { label: "Leipzig", value: "Leipzig" },
    { label: "Dortmund", value: "Dortmund" },
    { label: "Essen", value: "Essen" },
    { label: "Bremen", value: "Bremen" },
    { label: "Dresden", value: "Dresden" },
    { label: "Hanover", value: "Hanover" },
    { label: "Nuremberg", value: "Nuremberg" },
    { label: "Duisburg", value: "Duisburg" },
  ],
  "FR": [
    { label: "Paris", value: "Paris" },
    { label: "Marseille", value: "Marseille" },
    { label: "Lyon", value: "Lyon" },
    { label: "Toulouse", value: "Toulouse" },
    { label: "Nice", value: "Nice" },
    { label: "Nantes", value: "Nantes" },
    { label: "Strasbourg", value: "Strasbourg" },
    { label: "Montpellier", value: "Montpellier" },
    { label: "Bordeaux", value: "Bordeaux" },
    { label: "Lille", value: "Lille" },
    { label: "Rennes", value: "Rennes" },
    { label: "Reims", value: "Reims" },
    { label: "Le Havre", value: "Le Havre" },
    { label: "Saint-Étienne", value: "Saint-Étienne" },
    { label: "Toulon", value: "Toulon" },
  ],
  "ES": [
    { label: "Madrid", value: "Madrid" },
    { label: "Barcelona", value: "Barcelona" },
    { label: "Valencia", value: "Valencia" },
    { label: "Seville", value: "Seville" },
    { label: "Zaragoza", value: "Zaragoza" },
    { label: "Málaga", value: "Málaga" },
    { label: "Murcia", value: "Murcia" },
    { label: "Palma", value: "Palma" },
    { label: "Las Palmas", value: "Las Palmas" },
    { label: "Bilbao", value: "Bilbao" },
    { label: "Alicante", value: "Alicante" },
    { label: "Córdoba", value: "Córdoba" },
    { label: "Valladolid", value: "Valladolid" },
    { label: "Vigo", value: "Vigo" },
    { label: "Gijón", value: "Gijón" },
  ],
};

// Sample postal code data for auto-filling
const postalCodeData: Record<string, { city: string, country: string }> = {
  "10001": { city: "New York", country: "US" },
  "90001": { city: "Los Angeles", country: "US" },
  "60601": { city: "Chicago", country: "US" },
  "77001": { city: "Houston", country: "US" },
  "85001": { city: "Phoenix", country: "US" },
  "SW1A": { city: "London", country: "GB" },
  "B1": { city: "Birmingham", country: "GB" },
  "M1": { city: "Manchester", country: "GB" },
  "G1": { city: "Glasgow", country: "GB" },
  "L1": { city: "Liverpool", country: "GB" },
  "10115": { city: "Berlin", country: "DE" },
  "20095": { city: "Hamburg", country: "DE" },
  "80331": { city: "Munich", country: "DE" },
  "50667": { city: "Cologne", country: "DE" },
  "60306": { city: "Frankfurt", country: "DE" },
  "75001": { city: "Paris", country: "FR" },
  "13001": { city: "Marseille", country: "FR" },
  "69001": { city: "Lyon", country: "FR" },
  "31000": { city: "Toulouse", country: "FR" },
  "06000": { city: "Nice", country: "FR" },
  "28001": { city: "Madrid", country: "ES" },
  "08001": { city: "Barcelona", country: "ES" },
  "46001": { city: "Valencia", country: "ES" },
  "41001": { city: "Seville", country: "ES" },
  "50001": { city: "Zaragoza", country: "ES" },
};

// Default cities for countries not explicitly defined
const defaultCities = [
  { label: "Select a city", value: "" },
  { label: "Capital City", value: "Capital" },
  { label: "Major City 1", value: "Major City 1" },
  { label: "Major City 2", value: "Major City 2" },
  { label: "Major City 3", value: "Major City 3" },
];

const ShipmentDetails: React.FC<ShipmentDetailsProps> = ({ onFormValid }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phonePrefix: "+1",
    phoneNumber: "",
    address: "",
    city: "",
    country: "",
    postalCode: ""
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phoneNumber: false,
    address: false,
    city: false,
    country: false,
    postalCode: false
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phoneNumber: false,
    address: false,
    city: false,
    country: false,
    postalCode: false
  });

  const [isLoadingCities, setIsLoadingCities] = useState(false);

  // Get available cities based on selected country
  const availableCities = useMemo(() => {
    if (!formData.country) return [];
    return citiesByCountry[formData.country] || defaultCities;
  }, [formData.country]);

  // Get selected country object
  const selectedCountry = useMemo(() => {
    return countries.find(country => country.value === formData.country);
  }, [formData.country]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // If postal code changes, try to auto-fill city and country
    if (name === 'postalCode' && value.length >= 4) {
      const matchingPostalCode = Object.keys(postalCodeData).find(code => 
        value.toUpperCase().startsWith(code)
      );
      
      if (matchingPostalCode) {
        const data = postalCodeData[matchingPostalCode];
        
        // Simulate loading
        setIsLoadingCities(true);
        setTimeout(() => {
          setFormData(prev => ({
            ...prev,
            city: data.city,
            country: data.country,
            phonePrefix: countries.find(c => c.value === data.country)?.prefix || prev.phonePrefix
          }));
          
          setTouched(prev => ({
            ...prev,
            city: true,
            country: true
          }));
          
          setIsLoadingCities(false);
        }, 500);
      }
    }
    
    validateField(name, value);
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => {
      // If country changes, reset city and update phone prefix
      if (name === 'country') {
        const country = countries.find(c => c.value === value);
        return {
          ...prev,
          [name]: value,
          city: '',
          phonePrefix: country?.prefix || '+1'
        };
      }
      return { ...prev, [name]: value };
    });
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  // Validate a single field
  const validateField = (name: string, value: string) => {
    let isValid = true;

    switch (name) {
      case 'name':
        isValid = value.trim() !== "";
        break;
      case 'email':
        isValid = value.trim() !== "" && /\S+@\S+\.\S+/.test(value);
        break;
      case 'phoneNumber':
        isValid = value.trim() !== "" && /^\d+$/.test(value);
        break;
      case 'address':
      case 'city':
      case 'country':
      case 'postalCode':
        isValid = value.trim() !== "";
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: !isValid }));
    return isValid;
  };

  // Validate all form fields
  const validateForm = () => {
    const newErrors = {
      name: !validateField('name', formData.name),
      email: !validateField('email', formData.email),
      phoneNumber: !validateField('phoneNumber', formData.phoneNumber),
      address: !validateField('address', formData.address),
      city: !validateField('city', formData.city),
      country: !validateField('country', formData.country),
      postalCode: !validateField('postalCode', formData.postalCode)
    };

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      phoneNumber: true,
      address: true,
      city: true,
      country: true,
      postalCode: true
    });

    const isValid = !Object.values(newErrors).includes(true);
    
    // Format the data for submission
    const formattedData = {
      name: formData.name,
      email: formData.email,
      phone: `${formData.phonePrefix}${formData.phoneNumber}`,
      address: formData.address,
      city: formData.city,
      country: formData.country,
      postalCode: formData.postalCode
    };
    
    onFormValid(isValid, isValid ? formattedData : null);
    return isValid;
  };

  // Validate form on blur
  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field as keyof typeof formData] as string);
  };

  // Effect to validate form when any field changes
  useEffect(() => {
    if (Object.values(touched).some(t => t)) {
      validateForm();
    }
  }, [formData]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Shipping Details</h2>

      <div className="space-y-5">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={() => handleBlur('name')}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.name && touched.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            } focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200`}
            placeholder="John Doe"
          />
          {errors.name && touched.name && (
            <p className="mt-1 text-sm text-red-500">Please enter your full name</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.email && touched.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            } focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200`}
            placeholder="your.email@example.com"
          />
          {errors.email && touched.email && (
            <p className="mt-1 text-sm text-red-500">Please enter a valid email address</p>
          )}
        </div>

        {/* Phone Number Field with Country Prefix */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <div className="flex">
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center justify-between w-[90px] px-3 py-2.5 rounded-l-lg border border-gray-300 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Phone size={16} className="mr-1" />
                    <span>{formData.phonePrefix}</span>
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto">
                  {countries.map((country) => (
                    <DropdownMenuItem
                      key={country.value}
                      onClick={() => handleSelectChange('phonePrefix', country.prefix)}
                      className="flex items-center justify-between"
                    >
                      <span>{country.label}</span>
                      <span className="ml-2 text-gray-500">{country.prefix}</span>
                      {formData.phonePrefix === country.prefix && (
                        <Check size={16} className="ml-2 text-green-500" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              onBlur={() => handleBlur('phoneNumber')}
              className={`flex-1 px-4 py-2.5 rounded-r-lg border-t border-r border-b ${
                errors.phoneNumber && touched.phoneNumber ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              } focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200`}
              placeholder="123456789"
            />
          </div>
          {errors.phoneNumber && touched.phoneNumber && (
            <p className="mt-1 text-sm text-red-500">Please enter a valid phone number</p>
          )}
        </div>

        {/* Postal Code Field - For Auto-filling */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
          <div className="relative">
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              onBlur={() => handleBlur('postalCode')}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.postalCode && touched.postalCode ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              } focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200`}
              placeholder="Enter postal code to auto-fill address"
            />
            <Search size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          {errors.postalCode && touched.postalCode && (
            <p className="mt-1 text-sm text-red-500">Please enter your postal code</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Enter your postal code to auto-fill city and country</p>
        </div>

        {/* Country and City Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Country Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <div className="relative">
              <Select
                options={countries}
                value={formData.country}
                onChange={(value) => handleSelectChange('country', value)}
                className={`w-full ${
                  errors.country && touched.country ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                }`}
                onBlur={() => handleBlur('country')}
              />
              {errors.country && touched.country && (
                <p className="mt-1 text-sm text-red-500">Please select a country</p>
              )}
            </div>
          </div>

          {/* City Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <div className="relative">
              <Select
                options={availableCities}
                value={formData.city}
                onChange={(value) => handleSelectChange('city', value)}
                className={`w-full ${
                  errors.city && touched.city ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                }`}
                disabled={!formData.country || isLoadingCities}
                onBlur={() => handleBlur('city')}
              />
              {isLoadingCities && (
                <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                </div>
              )}
              {errors.city && touched.city && (
                <p className="mt-1 text-sm text-red-500">Please select a city</p>
              )}
            </div>
          </div>
        </div>

        {/* Address Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
          <div className="relative">
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={() => handleBlur('address')}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                errors.address && touched.address ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              } focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200`}
              placeholder="123 Main St, Apt 4B"
            />
            <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          {errors.address && touched.address && (
            <p className="mt-1 text-sm text-red-500">Please enter your street address</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;
