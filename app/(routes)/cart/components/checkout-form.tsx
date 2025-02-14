"use client";

import { useState } from "react";

interface CheckoutFormProps {
  onFormValid: (isValid: boolean, formData: any) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onFormValid }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: ""
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phone: false,
    address: false,
    city: false,
    country: false,
    postalCode: false
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: false });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {
      name: formData.name.trim() === "",
      email: formData.email.trim() === "" || !/\S+@\S+\.\S+/.test(formData.email),
      phone: formData.phone.trim() === "" || !/^\d+$/.test(formData.phone),
      address: formData.address.trim() === "",
      city: formData.city.trim() === "",
      country: formData.country.trim() === "",
      postalCode: formData.postalCode.trim() === ""
    };

    setErrors(newErrors);

    const isValid = !Object.values(newErrors).includes(true);
    onFormValid(isValid, isValid ? formData : null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Details</h2>

      {/* Name Field */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={validateForm}
          className={`w-full p-2 border rounded-md focus:ring focus:ring-blue-200 ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your full name"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">Name is required.</p>}
      </div>

      {/* Email Field */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={validateForm}
          className={`w-full p-2 border rounded-md focus:ring focus:ring-blue-200 ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your email"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">Valid email is required.</p>}
      </div>

      {/* Phone Number Field */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Phone Number</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onBlur={validateForm}
          className={`w-full p-2 border rounded-md focus:ring focus:ring-blue-200 ${
            errors.phone ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your phone number"
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">Valid phone number is required.</p>}
      </div>

      {/* Address Field */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          onBlur={validateForm}
          className={`w-full p-2 border rounded-md focus:ring focus:ring-blue-200 ${
            errors.address ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your street address"
        />
        {errors.address && <p className="text-red-500 text-sm mt-1">Address is required.</p>}
      </div>

      {/* City Field */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">City</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          onBlur={validateForm}
          className={`w-full p-2 border rounded-md focus:ring focus:ring-blue-200 ${
            errors.city ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your city"
        />
        {errors.city && <p className="text-red-500 text-sm mt-1">City is required.</p>}
      </div>

      {/* Country Field */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Country</label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          onBlur={validateForm}
          className={`w-full p-2 border rounded-md focus:ring focus:ring-blue-200 ${
            errors.country ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your country"
        />
        {errors.country && <p className="text-red-500 text-sm mt-1">Country is required.</p>}
      </div>

      {/* Postal Code Field */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Postal Code</label>
        <input
          type="text"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          onBlur={validateForm}
          className={`w-full p-2 border rounded-md focus:ring focus:ring-blue-200 ${
            errors.postalCode ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your postal code"
        />
        {errors.postalCode && <p className="text-red-500 text-sm mt-1">Postal code is required.</p>}
      </div>
    </div>
  );
};

export default CheckoutForm;
